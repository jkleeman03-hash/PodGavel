alter table ad_slots add column auto_accept_highest_bid boolean not null default false;

-- Advertisers had no legitimate reason to update a submission after
-- creating it (the app never does this), but the old policy let an
-- advertiser update their own row's status column directly via the API —
-- including setting it to 'approved' themselves. Only the podcaster
-- deciding a submission's outcome is a legitimate update.
drop policy "ad_submissions: update involved parties" on ad_submissions;
create policy "ad_submissions: update by podcaster" on ad_submissions
  for update using (public.is_podcaster_of_slot(slot_id));

-- Shared mutation for accepting a submission: approve it, fill the slot,
-- reject the other live bids. Security definer because it's invoked both
-- from an already-authorized RPC call and from the unattended cron job.
create or replace function public._apply_accept(target_submission_id uuid, target_slot_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update ad_submissions
    set status = 'approved', updated_at = now()
    where id = target_submission_id;

  update ad_slots
    set status = 'filled'
    where id = target_slot_id;

  update ad_submissions
    set status = 'rejected', rejection_reason = 'Slot filled by another submission', updated_at = now()
    where slot_id = target_slot_id
      and id <> target_submission_id
      and status in ('submitted', 'pending_approval');
end;
$$;

-- Callable by the podcaster (via RPC) to accept a specific submission.
-- Security invoker: authorization is an explicit check here, not implicit
-- RLS fallthrough, so it stays correct even if table policies change later.
create or replace function public.accept_submission(target_submission_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  target_slot_id uuid;
  slot_status text;
begin
  select slot_id into target_slot_id
  from ad_submissions
  where id = target_submission_id;

  if target_slot_id is null then
    raise exception 'Submission not found';
  end if;

  if not public.is_podcaster_of_slot(target_slot_id) then
    raise exception 'Not authorized to accept this submission';
  end if;

  select status into slot_status from ad_slots where id = target_slot_id;
  if slot_status is distinct from 'open' then
    raise exception 'Slot is not open';
  end if;

  perform public._apply_accept(target_submission_id, target_slot_id);
end;
$$;

-- Runs on a schedule (see cron.schedule below). For every open slot past
-- its deadline with auto-accept turned on, accepts the highest live bid,
-- or marks the slot expired if there were none.
create or replace function public.auto_accept_expired_slots()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  expired_slot record;
  winning_submission_id uuid;
begin
  for expired_slot in
    select id from ad_slots
    where status = 'open'
      and auto_accept_highest_bid = true
      and deadline < now()
  loop
    select id into winning_submission_id
    from ad_submissions
    where slot_id = expired_slot.id
      and status in ('submitted', 'pending_approval')
    order by bid_amount_cents desc
    limit 1;

    if winning_submission_id is not null then
      perform public._apply_accept(winning_submission_id, expired_slot.id);
    else
      update ad_slots set status = 'expired' where id = expired_slot.id;
    end if;
  end loop;
end;
$$;

create extension if not exists pg_cron;

select cron.schedule(
  'auto-accept-expired-slots',
  '*/5 * * * *',
  $$select public.auto_accept_expired_slots();$$
);
