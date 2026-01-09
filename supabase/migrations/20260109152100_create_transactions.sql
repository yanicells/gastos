-- ============================================================================
-- Migration: Create transactions table for personal finance tracker
-- Purpose: Store income and expense transactions with soft delete support
-- Affected: public.transactions (new table)
-- ============================================================================

-- Create the transactions table
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null,  -- no default, always set explicitly from frontend
  type text not null,
  amount decimal(12, 2) not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz  -- null = active, set = soft deleted
);

-- Add table description
comment on table public.transactions is 'Stores all income and expense transactions for personal finance tracking.';

-- Indexes for query performance
create index idx_transactions_date on public.transactions (date desc);
create index idx_transactions_type on public.transactions (type);
create index idx_transactions_active on public.transactions (deleted_at) where deleted_at is null;

-- Enable Row Level Security
alter table public.transactions enable row level security;

-- ============================================================================
-- RLS Policies: Only authenticated users can access (single-user app)
-- Granular policies per operation as per Supabase best practices
-- ============================================================================

create policy "Authenticated users can view transactions"
  on public.transactions
  for select
  to authenticated
  using (true);

create policy "Authenticated users can insert transactions"
  on public.transactions
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update transactions"
  on public.transactions
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete transactions"
  on public.transactions
  for delete
  to authenticated
  using (true);
