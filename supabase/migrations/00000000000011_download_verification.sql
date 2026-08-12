-- Podcasters can submit a screenshot of their downloads dashboard as proof;
-- we manually review and flip the status to 'verified'. downloads_verified_value
-- tracks the number that was actually verified, so if a podcaster later edits
-- avg_downloads to something else, the badge automatically drops back to
-- 'pending' instead of silently vouching for an unverified number.
alter table podcaster_profiles
  add column downloads_screenshot_path text,
  add column downloads_verification_status text
    check (downloads_verification_status in ('unverified', 'pending', 'verified'))
    not null default 'unverified',
  add column downloads_verified_value int;

-- Private bucket: podcasters upload their own screenshot, nobody else
-- (including advertisers browsing the marketplace) can read the raw image
-- via the API. Only the verification status/badge is exposed publicly
-- through the podcaster_profiles row.
insert into storage.buckets (id, name, public)
values ('download-verification', 'download-verification', false)
on conflict (id) do nothing;

create policy "download-verification: insert own" on storage.objects
  for insert with check (
    bucket_id = 'download-verification'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "download-verification: select own" on storage.objects
  for select using (
    bucket_id = 'download-verification'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "download-verification: update own" on storage.objects
  for update using (
    bucket_id = 'download-verification'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "download-verification: delete own" on storage.objects
  for delete using (
    bucket_id = 'download-verification'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
