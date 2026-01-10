-- ============================================================================
-- Migration: Add composite index for analytics queries
-- Purpose: Optimize date+type filtering for analytics aggregations
-- Affected: public.transactions (new index)
-- ============================================================================

-- Composite index for analytics queries that filter by date range and aggregate by type
-- The partial index (WHERE deleted_at IS NULL) ensures we only index active records
CREATE INDEX idx_transactions_date_type_amount 
  ON public.transactions (date, type, amount) 
  WHERE deleted_at IS NULL;

-- Drop older single-column indexes that are now redundant
-- The composite index covers date-first queries, and we keep type for type-only queries
-- Note: Keep idx_transactions_date if you query by date without type
