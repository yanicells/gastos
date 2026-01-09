# Gastos - Personal Finance Tracker

A web app to replace Excel-based expense tracking with a modern, mobile-friendly interface. Built with Next.js, Supabase, and shadcn/ui.

## Project Status

**Current Phase:** Phase 2 (Core Features) - ✅ Complete

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
- [x] TypeScript types (`lib/types/transaction.ts`)
- [x] Math expression parser (`lib/utils/calculate.ts`)

**UI Components:**

- [x] Shared components:
  - `DatePicker` with dark mode support
- [x] Dashboard components:
  - `QuickAddForm` with math expression support (e.g., `100+50`)
  - `RecentTransactions` table with delete functionality
- [x] Dashboard page (`app/page.tsx`)

**UI Improvements:**

- [x] Dropdowns positioned below triggers (popper mode)
- [x] Number input spinners removed
- [x] Calendar dark mode fixed (removed background boxing)
- [x] Math expression evaluation in amount field with live preview

### In Progress

None - Phase 2 complete, ready for Phase 3

### Pending

#### Phase 3: Summary & Analytics

- [ ] Excel-style monthly summary view (`app/(protected)/summary/page.tsx`)
  - Year dropdown selector
  - Rows: Months (Jan-Dec + Total)
  - Columns: Expense groups | Revenue groups | Savings
- [ ] Analytics dashboard (`app/(protected)/charts/page.tsx`)
  - Monthly totals bar chart
  - Category breakdown pie chart
  - Expense trends line chart
  - Top spending categories
  - Period comparison cards (MoM, YoY)
- [ ] Chart components using Recharts

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
├── page.tsx                     # Dashboard
├── auth/
│   ├── login/                   # Login page
│   ├── oauth/                   # OAuth callback
│   └── error/                   # Auth error
├── protected/                   # Future protected pages
└── unauthorized/                # Access denied page

components/
├── shared/
│   └── date-picker.tsx          # Reusable date picker
├── dashboard/
│   ├── quick-add-form.tsx       # Transaction form
│   └── recent-transactions.tsx  # Transactions table
└── ui/                          # shadcn components

lib/
├── actions/
│   └── transactions.ts          # Server actions (CRUD)
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
