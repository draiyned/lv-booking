alter table bookings drop constraint if exists bookings_hour_check;
alter table bookings add constraint bookings_hour_check check (hour between 5 and 22);
