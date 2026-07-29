begin;

-- These assertions are intended for a disposable Supabase test database.
-- They verify structural controls without fabricating production identities.

do $$
begin
  if not exists (
    select 1 from pg_class where relnamespace = 'public'::regnamespace
    and relname = 'custody_events' and relrowsecurity
  ) then raise exception 'custody_events RLS must be enabled'; end if;

  if not exists (
    select 1 from pg_class where relnamespace = 'public'::regnamespace
    and relname = 'audit_events' and relrowsecurity
  ) then raise exception 'audit_events RLS must be enabled'; end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'custody_events_immutable' and not tgisinternal
  ) then raise exception 'custody event immutability trigger missing'; end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'audit_events_immutable' and not tgisinternal
  ) then raise exception 'audit event immutability trigger missing'; end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'custody_events'
    and policyname = 'custody_append' and cmd = 'INSERT'
  ) then raise exception 'custody append policy missing'; end if;

  if not exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public' and table_name = 'custody_events'
    and constraint_type = 'UNIQUE'
  ) then raise exception 'custody uniqueness constraints missing'; end if;
end $$;

rollback;
