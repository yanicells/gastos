# Gastos - Personal Finance Tracker

A web app to replace Excel-based expense tracking with a modern, mobile-friendly interface. Built with Next.js, Supabase, and shadcn/ui.

## Project Status

**Current Phase:** Phase 3 (Summary & Analytics) - ✅ Complete

### Completed

#### Phase 1: Foundation ✅

- [x] Supabase client configuration (`lib/supabase/client.ts`, `server.ts`, `proxy.ts`)
- [x] Email-based authentication protection (whitelisted user only)
- [x] Database schema created:
  - `transactions` table with soft delete support
  - Performance indexes (date, type, active records)
  - Granular RLS policies for authenticated users
- [x] Transaction type definitions (`lib/data/types.ts`)
- [x] Protected routes with middleware
- [x] Unauthorized page for non-whitelisted users

#### Phase 2: Core Features ✅

**Data Layer:**

- [x] Transaction queries (`lib/queries/transactions.ts`)
  - `getTransactions()` with filters and pagination
  - `getTransactionById()`
  - `getTransactionsByMonth()`
  - `getMonthlyTotals()`
  - `getRecentTransactions()` for dashboard
- [x] Analytics queries (`lib/queries/analytics.ts`)
  - `getCategoryBreakdown()`
  - `getMonthlyTrend()`
  - `getTopCategories()`
- [x] Server actions (`lib/actions/transactions.ts`)
  - `createTransaction()`
  - `updateTransaction()`
  - `softDeleteTransaction()`
  - `softDeleteBatch()`
  - `restoreTransaction()`
- [x] Load-more action (`lib/actions/load-more.ts`) for infinite scroll with filters
- [x] TypeScript types (`lib/types/transaction.ts`)
- [x] Math expression parser (`lib/utils/calculate.ts`)

**UI Components:**

- [x] Shared components:
  - `DatePicker` with dark mode support
- [x] Dashboard components:
  - `QuickAddForm` with math expression support (e.g., `100+50`)
  - `RecentTransactions` table with edit/delete functionality
  - `EditTransactionModal` for editing transactions
  - `MonthlySummary` placeholder
- [x] Transaction components:
  - `TransactionList` with infinite scroll
  - `TransactionFilters` (Reddit-style filter bar)

**Pages:**

- [x] Dashboard page (`app/page.tsx`)
  - Split-view layout: Left (Quick Add), Right (Summary placeholder), Bottom (Recent Transactions)
  - Navigation to transactions, summary, and charts pages
- [x] Transactions page (`app/transactions/page.tsx`)
  - Full transaction list with infinite scroll
  - Reddit-style filters (category pills, type dropdown, date range, search)
  - Edit and delete with confirmation dialogs

**UI Improvements:**

- [x] Dropdowns positioned below triggers (popper mode)
- [x] Number input spinners removed
- [x] Calendar dark mode fixed (removed background boxing)
- [x] Math expression evaluation in amount field with live preview
- [x] Edit modal for transactions
- [x] Delete confirmation dialog
- [x] Filter-aware infinite scroll

#### Phase 3: Summary & Analytics ✅

**Data Layer:**

- [x] New analytics queries (`lib/queries/analytics.ts`)
  - `getYearlySummary()` for Excel-style monthly breakdown
  - `getComparisonData()` for MoM and YoY comparisons

**UI Components:**

- [x] Shared components:
  - `YearSelector` dropdown (`components/shared/year-selector.tsx`)
- [x] Summary components:
  - `MonthlyTable` Excel-style table with color-coded headers
  - `SummaryClient` client-side wrapper with year selection
- [x] Chart components (using shadcn charts/Recharts):
  - `MonthlyBarChart` - income vs expenses by month
  - `CategoryPieChart` - expense breakdown by type
  - `TopCategories` - horizontal progress bars for top spending
  - `TrendLineChart` - monthly trend visualization
  - `ComparisonCards` - MoM and YoY comparison cards

**Pages:**

- [x] Summary page (`app/summary/page.tsx`)
  - Excel-style monthly summary table
  - Year dropdown selector (defaults to current year)
  - Color-coded columns: Expenses (red), Revenue (blue), Savings (green)
- [x] Charts page (`app/charts/page.tsx`)
  - Comparison cards (MoM and YoY for income/expenses)
  - Monthly bar chart (income vs expenses)
  - Category pie chart + Top categories side by side
  - Trend line chart

### Pending

#### Phase 4: Polish & Import

- [ ] CSV/Excel data import
- [ ] PWA configuration
- [ ] Mobile optimization

---

## Tech Stack

- **Framework:** Next.js 16 with Turbopack
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth with GitHub OAuth
- **UI:** shadcn/ui + Tailwind CSS
- **Validation:** TypeScript strict mode
- **Package Manager:** pnpm

## Database Schema

### `transactions`

| Column       | Type          | Description                   |
| ------------ | ------------- | ----------------------------- |
| `id`         | uuid          | Primary key (auto-generated)  |
| `date`       | date          | Transaction date (no default) |
| `type`       | text          | Transaction type key          |
| `amount`     | decimal(12,2) | Amount                        |
| `notes`      | text          | Optional notes                |
| `created_at` | timestamptz   | Created timestamp             |
| `updated_at` | timestamptz   | Updated timestamp             |
| `deleted_at` | timestamptz   | Soft delete timestamp         |

**Indexes:**

- `idx_transactions_date` on `date DESC`
- `idx_transactions_type` on `type`
- `idx_transactions_active` partial index where `deleted_at IS NULL`

## File Structure

```
app/
├── page.tsx                     # Dashboard (split-view)
├── transactions/
│   └── page.tsx                 # Full transaction list
├── auth/
│   ├── login/                   # Login page
│   ├── oauth/                   # OAuth callback
│   └── error/                   # Auth error
└── unauthorized/                # Access denied page

components/
├── shared/
│   └── date-picker.tsx          # Reusable date picker
├── dashboard/
│   ├── quick-add-form.tsx       # Transaction form
│   ├── recent-transactions.tsx  # Recent transactions table
│   ├── edit-transaction-modal.tsx # Edit modal
│   └── monthly-summary.tsx      # Summary placeholder
├── transactions/
│   ├── transaction-list.tsx     # Infinite scroll list
│   └── transaction-filters.tsx  # Filter bar
└── ui/                          # shadcn components

lib/
├── actions/
│   ├── transactions.ts          # Server actions (CRUD)
│   └── load-more.ts             # Infinite scroll loader
├── queries/
│   ├── transactions.ts          # Transaction queries
│   └── analytics.ts             # Aggregation queries
├── types/
│   └── transaction.ts           # TypeScript interfaces
├── data/
│   └── types.ts                 # Transaction type config
├── utils/
│   ├── calculate.ts             # Math expression parser
│   └── utils.ts                 # Utilities
└── supabase/
    ├── client.ts                # Browser client
    ├── server.ts                # Server client
    └── proxy.ts                 # Middleware client

supabase/
└── migrations/
    └── 20260109152100_create_transactions.sql
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_anon_key
ALLOWED_USER_EMAIL=edrianmiguelcapistrano@gmail.com
```

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build
```
