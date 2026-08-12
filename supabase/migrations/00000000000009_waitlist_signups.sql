create table waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  show_or_company_name text not null,
  email text not null,
  role text check (role in ('podcaster', 'advertiser')) not null,
  created_at timestamptz default now()
);

-- Landing page visitors are anonymous (not logged in), so inserts must be
-- open to anyone. No select policy is defined, so the list itself (with
-- everyone's email) stays unreadable via the public API key.
alter table waitlist_signups enable row level security;

create policy "waitlist_signups: insert by anyone" on waitlist_signups
  for insert with check (true);
