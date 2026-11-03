create extension if not exists pgcrypto;

create type public.customer_mode as enum ('household', 'business');
create type public.order_status as enum ('pending_payment', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'payment_failed');
create type public.payment_status as enum ('created', 'authorized', 'captured', 'failed', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  mode public.customer_mode not null default 'household',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id text primary key,
  name text not null,
  icon text not null default 'basket-outline',
  color text not null default '#E7F5EC',
  sort_order integer not null default 0,
  active boolean not null default true
);

create table public.products (
  id text primary key,
  category_id text not null references public.categories(id),
  name text not null,
  description text not null default '',
  image_url text not null,
  origin text not null default '',
  household_price_paise integer not null check (household_price_paise >= 0),
  business_price_paise integer not null check (business_price_paise >= 0),
  household_unit text not null,
  business_unit text not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  discount_percent integer check (discount_percent between 0 and 100),
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  recipient_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  latitude double precision,
  longitude double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  display_id text unique not null default ('BF' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  user_id uuid not null references auth.users(id),
  address_id uuid references public.addresses(id),
  customer_mode public.customer_mode not null,
  status public.order_status not null default 'pending_payment',
  subtotal_paise integer not null check (subtotal_paise >= 0),
  delivery_fee_paise integer not null check (delivery_fee_paise >= 0),
  total_paise integer generated always as (subtotal_paise + delivery_fee_paise) stored,
  delivery_slot text not null,
  address_snapshot jsonb not null,
  razorpay_order_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  product_name text not null,
  unit text not null,
  unit_price_paise integer not null check (unit_price_paise >= 0),
  quantity integer not null check (quantity > 0),
  line_total_paise integer generated always as (unit_price_paise * quantity) stored
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  razorpay_order_id text not null,
  razorpay_payment_id text unique,
  status public.payment_status not null default 'created',
  amount_paise integer not null check (amount_paise >= 0),
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products(category_id) where active;
create index addresses_user_idx on public.addresses(user_id);
create index orders_user_created_idx on public.orders(user_id, created_at desc);
create index order_items_order_idx on public.order_items(order_id);
create index payments_order_idx on public.payments(order_id);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

create policy "Public can read active categories" on public.categories for select using (active);
create policy "Public can read active products" on public.products for select using (active);
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users read own addresses" on public.addresses for select using (auth.uid() = user_id);
create policy "Users insert own addresses" on public.addresses for insert with check (auth.uid() = user_id);
create policy "Users update own addresses" on public.addresses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own addresses" on public.addresses for delete using (auth.uid() = user_id);
create policy "Users read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users read own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users read own payments" on public.payments for select using (
  exists (select 1 from public.orders where orders.id = payments.order_id and orders.user_id = auth.uid())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.phone);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger products_updated before update on public.products for each row execute procedure public.set_updated_at();
create trigger addresses_updated before update on public.addresses for each row execute procedure public.set_updated_at();
create trigger orders_updated before update on public.orders for each row execute procedure public.set_updated_at();
create trigger payments_updated before update on public.payments for each row execute procedure public.set_updated_at();

revoke all on public.profiles, public.addresses, public.orders, public.order_items, public.payments from anon;
grant select on public.categories, public.products to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select on public.orders, public.order_items, public.payments to authenticated;

create or replace function public.confirm_paid_order(p_order_id uuid, p_payment_id text)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  item record;
begin
  if not exists (
    select 1 from public.orders
    where id = p_order_id and status = 'pending_payment'
    for update
  ) then
    raise exception 'Order cannot be confirmed';
  end if;

  for item in
    select product_id, quantity from public.order_items where order_id = p_order_id
  loop
    update public.products
      set stock_quantity = stock_quantity - item.quantity
      where id = item.product_id and stock_quantity >= item.quantity;
    if not found then
      raise exception 'Insufficient stock for product %', item.product_id;
    end if;
  end loop;

  update public.payments
    set razorpay_payment_id = p_payment_id, status = 'captured'
    where order_id = p_order_id;
  update public.orders set status = 'confirmed' where id = p_order_id;
end;
$$;

revoke all on function public.confirm_paid_order(uuid, text) from public, anon, authenticated;
grant execute on function public.confirm_paid_order(uuid, text) to service_role;
