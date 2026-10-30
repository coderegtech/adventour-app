create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  avatar_url text not null default ''
);
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'avatar_url', ''));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0
);
create table public.tourist_spots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  description text not null default '',
  image_url text not null default '',
  category text not null default '',
  price numeric(12,2) not null check (price >= 0),
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  packages jsonb not null default '[]' check (jsonb_typeof(packages) = 'array'),
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180)
);
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  spot_id uuid not null references public.tourist_spots(id),
  package_name text,
  full_name text not null check (length(trim(full_name)) between 1 and 200),
  age integer check (age between 0 and 120),
  email text not null check (email like '%_@_%._%'),
  contact_number text not null check (contact_number ~ '^[0-9]{10,15}$'),
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  amount numeric(12,2) not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending','approved','completed','cancelled')),
  created_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  method text not null check (method in ('card','gcash')),
  status text not null default 'demo' check (status = 'demo'),
  created_at timestamptz not null default now()
);
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  spot_id uuid not null references public.tourist_spots(id) on delete cascade,
  unique(user_id, spot_id)
);
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  spot_id uuid not null references public.tourist_spots(id) on delete cascade,
  message text not null check (length(trim(message)) between 1 and 2000),
  rating integer not null check (rating between 1 and 5),
  author_name text not null default '',
  author_avatar_url text not null default '',
  created_at timestamptz not null default now(),
  unique(user_id, spot_id)
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index on public.bookings(user_id);
create index on public.payments(user_id);
create index on public.notifications(user_id);
create index on public.reviews(spot_id);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tourist_spots enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.bookmarks enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;

create policy profiles_read on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy categories_read on public.categories for select to anon, authenticated using (true);
create policy spots_read on public.tourist_spots for select to anon, authenticated using (true);
create policy bookings_read on public.bookings for select to authenticated using (user_id = (select auth.uid()));
create policy payments_read on public.payments for select to authenticated using (user_id = (select auth.uid()));
create policy notifications_read on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create policy bookmarks_read on public.bookmarks for select to authenticated using (user_id = (select auth.uid()));
create policy bookmarks_insert on public.bookmarks for insert to authenticated with check (user_id = (select auth.uid()));
create policy bookmarks_delete on public.bookmarks for delete to authenticated using (user_id = (select auth.uid()));
create policy reviews_read on public.reviews for select to anon, authenticated using (true);
create policy reviews_insert on public.reviews for insert to authenticated with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.bookings b where b.user_id = (select auth.uid()) and b.spot_id = reviews.spot_id and b.status = 'completed'
  )
);

create function public.set_review_author() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  select name, avatar_url into new.author_name, new.author_avatar_url from public.profiles where id = new.user_id;
  new.created_at := now();
  return new;
end;
$$;
create trigger review_author before insert on public.reviews for each row execute function public.set_review_author();

-- One transaction records a pending booking and simulated payment. No payment provider is called.
create function public.create_demo_booking(
  p_spot_id uuid, p_package_name text, p_full_name text, p_age integer,
  p_email text, p_contact_number text, p_start_date date, p_end_date date,
  p_method text, p_request_id uuid
) returns public.bookings language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_spot public.tourist_spots;
  v_booking public.bookings;
  v_amount numeric(12,2);
begin
  if v_user is null then raise exception 'Sign in to book'; end if;
  if p_request_id is null then raise exception 'Request ID required'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  select * into v_booking from public.bookings where id = p_request_id;
  if found then
    if v_booking.user_id <> v_user then raise exception 'Invalid request ID'; end if;
    return v_booking;
  end if;
  if p_start_date is null or p_end_date is null or p_start_date < current_date or p_end_date < p_start_date then
    raise exception 'Choose valid future travel dates';
  end if;
  select * into v_spot from public.tourist_spots where id = p_spot_id;
  if not found then raise exception 'Destination not found'; end if;
  if jsonb_array_length(v_spot.packages) > 0 then
    select (item->>'price')::numeric into v_amount from jsonb_array_elements(v_spot.packages) item where item->>'name' = p_package_name;
    if v_amount is null then raise exception 'Choose a valid package'; end if;
  else
    if nullif(p_package_name, '') is not null then raise exception 'Invalid package'; end if;
    v_amount := v_spot.price;
  end if;
  insert into public.bookings(id,user_id,spot_id,package_name,full_name,age,email,contact_number,start_date,end_date,amount)
  values(p_request_id,v_user,p_spot_id,nullif(p_package_name,''),trim(p_full_name),p_age,trim(p_email),p_contact_number,p_start_date,p_end_date,v_amount)
  returning * into v_booking;
  insert into public.payments(booking_id,user_id,amount,method) values(v_booking.id,v_user,v_amount,p_method);
  insert into public.notifications(user_id,subject,body) values(v_user,'Demo booking created',
    'Your pending booking for ' || v_spot.name || ' was saved. Payment is simulated; no money was charged.');
  return v_booking;
end;
$$;
revoke all on function public.create_demo_booking(uuid,text,text,integer,text,text,date,date,text,uuid) from public, anon;
grant execute on function public.create_demo_booking(uuid,text,text,integer,text,text,date,date,text,uuid) to authenticated;
revoke all on function public.handle_new_user() from public;
revoke all on function public.set_review_author() from public;

revoke all on public.profiles, public.categories, public.tourist_spots, public.bookings, public.payments, public.bookmarks, public.reviews, public.notifications from anon, authenticated;
grant select on public.categories, public.tourist_spots, public.reviews to anon, authenticated;
grant select on public.profiles, public.bookings, public.payments, public.bookmarks, public.notifications to authenticated;
grant update(name, avatar_url) on public.profiles to authenticated;
grant insert(user_id, spot_id), delete on public.bookmarks to authenticated;
grant insert(user_id, spot_id, message, rating) on public.reviews to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('avatars','avatars',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
create policy avatar_insert on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy avatar_update on storage.objects for update to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text) with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy avatar_delete on storage.objects for delete to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy avatar_read on storage.objects for select to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
