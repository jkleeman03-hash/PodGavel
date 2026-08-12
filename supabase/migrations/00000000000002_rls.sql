alter table profiles enable row level security;
alter table podcaster_profiles enable row level security;
alter table voice_profiles enable row level security;
alter table advertiser_profiles enable row level security;
alter table ad_slots enable row level security;
alter table ad_submissions enable row level security;
alter table transactions enable row level security;

-- profiles: a user can read and create their own row
create policy "profiles: select own" on profiles
  for select using (auth.uid() = id);

create policy "profiles: insert own" on profiles
  for insert with check (auth.uid() = id);

-- podcaster_profiles: owner-only read/write, keyed off profiles.id
create policy "podcaster_profiles: select own" on podcaster_profiles
  for select using (auth.uid() = id);

create policy "podcaster_profiles: insert own" on podcaster_profiles
  for insert with check (auth.uid() = id);

create policy "podcaster_profiles: update own" on podcaster_profiles
  for update using (auth.uid() = id);

-- advertiser_profiles: owner-only read/write
create policy "advertiser_profiles: select own" on advertiser_profiles
  for select using (auth.uid() = id);

create policy "advertiser_profiles: insert own" on advertiser_profiles
  for insert with check (auth.uid() = id);

create policy "advertiser_profiles: update own" on advertiser_profiles
  for update using (auth.uid() = id);

-- voice_profiles: owned via podcaster_id
create policy "voice_profiles: select own" on voice_profiles
  for select using (auth.uid() = podcaster_id);

create policy "voice_profiles: insert own" on voice_profiles
  for insert with check (auth.uid() = podcaster_id);

-- ad_slots: podcasters manage their own slots; anyone authenticated can browse open slots
create policy "ad_slots: select open or own" on ad_slots
  for select using (status = 'open' or auth.uid() = podcaster_id);

create policy "ad_slots: insert own" on ad_slots
  for insert with check (auth.uid() = podcaster_id);

create policy "ad_slots: update own" on ad_slots
  for update using (auth.uid() = podcaster_id);

-- ad_submissions: visible to the advertiser who submitted and the podcaster who owns the slot
create policy "ad_submissions: select involved parties" on ad_submissions
  for select using (
    auth.uid() = advertiser_id
    or auth.uid() in (
      select podcaster_id from ad_slots where ad_slots.id = ad_submissions.slot_id
    )
  );

create policy "ad_submissions: insert own" on ad_submissions
  for insert with check (auth.uid() = advertiser_id);

create policy "ad_submissions: update involved parties" on ad_submissions
  for update using (
    auth.uid() = advertiser_id
    or auth.uid() in (
      select podcaster_id from ad_slots where ad_slots.id = ad_submissions.slot_id
    )
  );

-- transactions: visible to the advertiser and podcaster tied to the submission
create policy "transactions: select involved parties" on transactions
  for select using (
    auth.uid() in (
      select advertiser_id from ad_submissions where ad_submissions.id = transactions.submission_id
      union
      select ad_slots.podcaster_id from ad_submissions
        join ad_slots on ad_slots.id = ad_submissions.slot_id
        where ad_submissions.id = transactions.submission_id
    )
  );
