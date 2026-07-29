begin;

create extension if not exists pgcrypto;

create type public.bag_dna_role as enum (
  'platform_admin','tenant_admin','security_officer','operations_controller',
  'baggage_handler','investigator','auditor','passenger_support','passenger'
);

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'active' check (status in ('active','suspended','closed')),
  data_region text not null,
  created_at timestamptz not null default now()
);

create table public.tenant_memberships (
  tenant_id uuid not null references public.tenants(id),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.bag_dna_role not null,
  mfa_required boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id, role)
);

create table public.bag_identities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  passenger_reference text not null,
  journey_id text not null,
  status text not null default 'active',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (tenant_id, journey_id, passenger_reference)
);

create table public.custody_events (
  id uuid primary key,
  tenant_id uuid not null references public.tenants(id),
  bag_identity_id uuid not null references public.bag_identities(id),
  journey_id text not null,
  sequence bigint not null check (sequence > 0),
  event_type text not null,
  occurred_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  actor_id uuid not null references auth.users(id),
  actor_role public.bag_dna_role not null,
  checkpoint_id text,
  device_id text,
  latitude double precision,
  longitude double precision,
  attributes jsonb not null default '{}'::jsonb,
  previous_hash text,
  event_hash text not null check (event_hash ~ '^[0-9a-f]{64}$'),
  hash_algorithm text not null default 'SHA-256' check (hash_algorithm = 'SHA-256'),
  schema_version integer not null default 1,
  unique (tenant_id, bag_identity_id, sequence),
  unique (tenant_id, event_hash)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id),
  actor_id uuid references auth.users(id),
  session_id text,
  action text not null,
  resource_type text not null,
  resource_id text,
  outcome text not null check (outcome in ('allowed','denied','error')),
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create or replace function public.current_tenant_id()
returns uuid language sql stable as $$
  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
$$;

create or replace function public.current_roles()
returns text[] language sql stable as $$
  select coalesce(array(select jsonb_array_elements_text(coalesce(auth.jwt() -> 'roles','[]'::jsonb))), array[]::text[])
$$;

create or replace function public.has_role(required_role text)
returns boolean language sql stable as $$
  select required_role = any(public.current_roles())
$$;

create or replace function public.prevent_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'append-only table: mutation denied';
end;
$$;

create trigger custody_events_immutable
before update or delete on public.custody_events
for each row execute function public.prevent_mutation();

create trigger audit_events_immutable
before update or delete on public.audit_events
for each row execute function public.prevent_mutation();

alter table public.tenants enable row level security;
alter table public.tenant_memberships enable row level security;
alter table public.bag_identities enable row level security;
alter table public.custody_events enable row level security;
alter table public.audit_events enable row level security;

create policy tenant_read on public.tenants for select using (
  id = public.current_tenant_id() or public.has_role('platform_admin')
);

create policy membership_read on public.tenant_memberships for select using (
  tenant_id = public.current_tenant_id() or public.has_role('platform_admin')
);

create policy bag_identity_read on public.bag_identities for select using (
  tenant_id = public.current_tenant_id() or public.has_role('platform_admin')
);

create policy bag_identity_insert on public.bag_identities for insert with check (
  tenant_id = public.current_tenant_id()
  and (public.has_role('tenant_admin') or public.has_role('operations_controller'))
);

create policy custody_read on public.custody_events for select using (
  tenant_id = public.current_tenant_id() or public.has_role('platform_admin')
);

create policy custody_append on public.custody_events for insert with check (
  tenant_id = public.current_tenant_id()
  and actor_id = auth.uid()
  and (
    public.has_role('tenant_admin') or public.has_role('security_officer') or
    public.has_role('operations_controller') or public.has_role('baggage_handler')
  )
);

create policy audit_read on public.audit_events for select using (
  (tenant_id = public.current_tenant_id() and (
    public.has_role('tenant_admin') or public.has_role('security_officer') or
    public.has_role('investigator') or public.has_role('auditor')
  )) or public.has_role('platform_admin')
);

create policy audit_append on public.audit_events for insert with check (
  tenant_id is null or tenant_id = public.current_tenant_id() or public.has_role('platform_admin')
);

revoke update, delete on public.custody_events from authenticated;
revoke update, delete on public.audit_events from authenticated;

commit;
