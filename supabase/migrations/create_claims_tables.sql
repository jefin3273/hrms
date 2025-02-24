-- Create claims table
create table claims (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  amount decimal(10,2) not null,
  description text not null,
  claim_type text not null,
  status text not null default 'PENDING',
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  approved_at timestamp with time zone,
  approved_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create claim_types table
create table claim_types (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  max_amount decimal(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table claims enable row level security;
alter table claim_types enable row level security;

-- Create policies
create policy "Users can view their own claims"
  on claims for select
  using (auth.uid() = user_id);

create policy "Users can create claims"
  on claims for insert
  with check (auth.uid() = user_id);

create policy "Users can view claim types"
  on claim_types for select
  using (true);

