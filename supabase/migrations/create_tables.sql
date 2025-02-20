-- Create subscriptions table
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  tms_expiry timestamp with time zone,
  pay_expiry timestamp with time zone,
  leave_expiry timestamp with time zone,
  claim_expiry timestamp with time zone,
  hr_expiry timestamp with time zone,
  appraisal_expiry timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create attendance table
create table attendance (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  shift text not null,
  clock_in timestamp with time zone,
  clock_out timestamp with time zone,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table subscriptions enable row level security;
alter table attendance enable row level security;

create policy "Users can view their own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can view their own attendance"
  on attendance for select
  using (auth.uid() = user_id);

