create table bookings (
  id bigint generated always as identity primary key,
  branch text not null default 'lv',
  date date not null,
  court text not null,
  hour smallint not null check (hour between 6 and 23),
  name text not null,
  phone text not null,
  amount integer not null,
  gcash_ref text not null,
  created_at timestamptz not null default now(),
  unique (branch, date, court, hour)
);

-- Lock the table. Only the server key can read or write.
alter table bookings enable row level security;
