# Gastos

A sleek, minimal personal finance tracker built for speed and simplicity. Optimized for mobile use as a Progressive Web App (PWA).

## Key Features

- **Dashboard**: Quick overview of your recent financial activity and monthly budget status.
- **Transaction Management**: Fast entry for daily expenses with notes, categories, and real-time updates.
- **Smart Summaries**: Comprehensive monthly and yearly breakdowns, including spending averages and trends.
- **Visual Analytics**: Interactive charts to help you visualize spending patterns and long-term habits.
- **Secure Authentication**: Robust security powered by Supabase with GitHub integration.
- **Progressive Web App**: Fully optimized for installation on iOS, Android, and Desktop.

## PWA Support

Gastos is designed to work seamlessly across all your devices:

- **Home Screen Access**: Install it directly from your browser for a full-screen, app-like experience.
- **Speed & Reliability**: Fast loading times and optimized performance using modern service workers.
- **Responsive Design**: A mobile-first UI that feels native on any screen size.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Database/Auth**: [Supabase](https://supabase.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## File Structure

- `app/` - Application routes, layouts, and page-specific logic.
- `components/` - Reusable UI components, dashboard widgets, and data visualizations.
- `lib/` - Shared logic, TypeScript types, database queries, and server actions.
- `public/` - Static assets, icons, and PWA manifest.
- `supabase/` - Database schema definitions and migrations.

## Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```
