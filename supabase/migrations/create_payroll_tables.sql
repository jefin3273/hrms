-- Create pay_schedules table
create table pay_schedules (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  name text not null,
  is_public_holiday_working boolean default false,
  holiday_group text not null,
  working_days numeric(3,1) not null,
  week_schedule jsonb not null,
  pay_cycle_start int not null,
  pay_cycle_end int not null,
  created_by uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table pay_schedules enable row level security;

-- Create policies
create policy "Users can view pay schedules"
  on pay_schedules for select
  using (true);

create policy "Users can create pay schedules"
  on pay_schedules for insert
  with check (auth.uid() = created_by);

create policy "Users can update their own pay schedules"
  on pay_schedules for update
  using (auth.uid() = created_by);

