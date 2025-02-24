-- Create leave_types table
create table leave_types (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create leave_requests table
create table leave_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  leave_type_id uuid references leave_types not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'pending',
  reason text,
  department text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create leave_balances table
create table leave_balances (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  leave_type_id uuid references leave_types not null,
  year int not null,
  total_days int not null,
  used_days int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, leave_type_id, year)
);

-- Enable RLS
alter table leave_types enable row level security;
alter table leave_requests enable row level security;
alter table leave_balances enable row level security;

-- Create policies
create policy "Users can view leave types"
  on leave_types for select
  using (true);

create policy "Users can view their own leave requests"
  on leave_requests for select
  using (auth.uid() = user_id);

create policy "Users can create their own leave requests"
  on leave_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own leave balances"
  on leave_balances for select
  using (auth.uid() = user_id);

-- Insert default leave types
insert into leave_types (name, description) values
  ('Annual Leave', 'Regular paid time off'),
  ('Sick Leave', 'Leave for medical reasons'),
  ('Personal Leave', 'Leave for personal matters'),
  ('Maternity Leave', 'Leave for childbirth and care'),
  ('Paternity Leave', 'Leave for new fathers');

