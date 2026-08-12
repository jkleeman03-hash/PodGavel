-- A slot's floor (reserve) price. Kept in its own table, not a column on
-- ad_slots, so RLS can hide it row-wise from everyone except the owning
-- podcaster (RLS can't restrict individual columns of a row that's
-- otherwise visible, e.g. to advertisers browsing open slots).
create table ad_slot_floors (
  slot_id uuid primary key references ad_slots(id),
  floor_price_cents int not null,
  created_at timestamptz default now()
);

alter table ad_slot_floors enable row level security;

create policy "ad_slot_floors: select own" on ad_slot_floors
  for select using (public.is_podcaster_of_slot(slot_id));

create policy "ad_slot_floors: insert own" on ad_slot_floors
  for insert with check (public.is_podcaster_of_slot(slot_id));

create policy "ad_slot_floors: update own" on ad_slot_floors
  for update using (public.is_podcaster_of_slot(slot_id));

-- Each submission now carries the advertiser's bid alongside their script.
alter table ad_submissions add column bid_amount_cents int;
update ad_submissions
  set bid_amount_cents = (select price_cents from ad_slots where ad_slots.id = ad_submissions.slot_id)
  where bid_amount_cents is null;
alter table ad_submissions alter column bid_amount_cents set not null;

alter table ad_submissions drop constraint ad_submissions_status_check;
alter table ad_submissions add constraint ad_submissions_status_check
  check (status in (
    'submitted', 'generating', 'pending_approval',
    'approved', 'rejected', 'delivered', 'below_floor'
  ));

-- Returns true if a bid is below the slot's hidden floor (false if no floor
-- is set). Security definer so it can read ad_slot_floors regardless of the
-- caller's RLS visibility, without ever exposing the floor value itself.
create or replace function public.is_bid_below_floor(target_slot_id uuid, bid_cents int)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from ad_slot_floors
    where ad_slot_floors.slot_id = target_slot_id
      and ad_slot_floors.floor_price_cents > bid_cents
  );
$$;

-- Forces status to 'below_floor' whenever the bid doesn't clear the
-- reserve, regardless of what status the insert requested. The row is
-- still recorded (not rejected outright) so podcasters and we can see the
-- attempt.
create or replace function public.set_submission_floor_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_bid_below_floor(new.slot_id, new.bid_amount_cents) then
    new.status := 'below_floor';
  end if;
  return new;
end;
$$;

create trigger set_submission_floor_status
  before insert on ad_submissions
  for each row execute function public.set_submission_floor_status();
