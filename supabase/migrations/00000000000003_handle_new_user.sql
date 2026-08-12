-- Creates the profiles (+ role-specific) row from signup metadata.
-- Runs as the function owner so it isn't blocked by RLS on profiles/podcaster_profiles/advertiser_profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_role text := new.raw_user_meta_data ->> 'role';
begin
  insert into public.profiles (id, role, display_name)
  values (
    new.id,
    user_role,
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  );

  if user_role = 'podcaster' then
    insert into public.podcaster_profiles (id, show_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'show_name', ''));
  elsif user_role = 'advertiser' then
    insert into public.advertiser_profiles (id, company_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'company_name', ''));
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
