-- Table-level GRANTs are checked before RLS policies. This project's `anon`
-- role has never had grants on any table (every other table only ever saw
-- real requests from `authenticated` users, which gets default grants).
-- The waitlist is the first genuinely anonymous write path, so it needs an
-- explicit grant — the RLS policy alone isn't enough.
grant insert on waitlist_signups to anon, authenticated;
