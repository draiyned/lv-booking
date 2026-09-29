-- Run this only if your bookings table already exists
-- (skip this file entirely on a brand new Supabase project; use supabase.sql instead).
alter table bookings add column if not exists gcash_ref text not null default '';
alter table bookings alter column gcash_ref drop default;
