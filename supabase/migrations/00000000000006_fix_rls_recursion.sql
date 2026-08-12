-- The ad_slots and ad_submissions select/update policies each queried the
-- other table inline, which Postgres evaluates as mutual RLS recursion
-- ("infinite recursion detected in policy for relation ad_slots"). These
-- security definer functions run as the function owner (bypassing RLS for
-- their internal query only), breaking the cycle.
create or replace function public.is_podcaster_of_slot(target_slot_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from ad_slots
    where ad_slots.id = target_slot_id
      and ad_slots.podcaster_id = auth.uid()
  );
$$;

create or replace function public.advertiser_submitted_to_slot(target_slot_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from ad_submissions
    where ad_submissions.slot_id = target_slot_id
      and ad_submissions.advertiser_id = auth.uid()
  );
$$;

drop policy "ad_slots: select open, own, or submitted" on ad_slots;
create policy "ad_slots: select open, own, or submitted" on ad_slots
  for select using (
    status = 'open'
    or auth.uid() = podcaster_id
    or public.advertiser_submitted_to_slot(id)
  );

drop policy "ad_submissions: select involved parties" on ad_submissions;
create policy "ad_submissions: select involved parties" on ad_submissions
  for select using (
    auth.uid() = advertiser_id
    or public.is_podcaster_of_slot(slot_id)
  );

drop policy "ad_submissions: update involved parties" on ad_submissions;
create policy "ad_submissions: update involved parties" on ad_submissions
  for update using (
    auth.uid() = advertiser_id
    or public.is_podcaster_of_slot(slot_id)
  );
