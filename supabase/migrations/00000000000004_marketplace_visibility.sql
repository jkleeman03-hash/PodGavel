-- Advertisers need to keep seeing a slot's details after its status moves
-- past 'open' (e.g. filled/expired) if they submitted against it.
drop policy "ad_slots: select open or own" on ad_slots;

create policy "ad_slots: select open, own, or submitted" on ad_slots
  for select using (
    status = 'open'
    or auth.uid() = podcaster_id
    or auth.uid() in (
      select advertiser_id from ad_submissions where ad_submissions.slot_id = ad_slots.id
    )
  );

-- Show name/category are marketplace directory info: any signed-in user
-- (advertisers browsing slots) needs to read them, not just the owner.
create policy "podcaster_profiles: select for authenticated" on podcaster_profiles
  for select using (auth.uid() is not null);

-- Company name is only shared with podcasters an advertiser has actually
-- submitted to, not the whole marketplace.
create policy "advertiser_profiles: select by slot owner" on advertiser_profiles
  for select using (
    id in (
      select ad_submissions.advertiser_id
      from ad_submissions
      join ad_slots on ad_slots.id = ad_submissions.slot_id
      where ad_slots.podcaster_id = auth.uid()
    )
  );
