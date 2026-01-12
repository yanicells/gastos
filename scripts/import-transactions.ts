/**
 * Import transactions from markdown files into Supabase.
 *
 * Usage:
 *   pnpm import           - Run the actual import
 *   pnpm import --dry-run - Preview without inserting
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load .env from project root
dotenv.config({ path: path.join(process.cwd(), ".env") });

// ============================================================================
// Configuration
// ============================================================================

const SHEETS_DIR = path.join(process.cwd(), "sheets");
const DRY_RUN = process.argv.includes("--dry-run");

// Supabase client - use service role for inserts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env");
  process.exit(1);
}

// For actual import, we need the service role key
// For dry-run, we don't need any key since we're just parsing files
let supabase: ReturnType<typeof createClient> | null = null;

if (!DRY_RUN) {
  if (!supabaseServiceKey) {
    console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env");
    console.error("   This is required for inserting data.");
    console.error(
      "   Get it from: Supabase Dashboard → Settings → API → service_role key"
    );
    process.exit(1);
  }
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// ============================================================================
// Type Mapping
// ============================================================================

/**
 * Maps the source labels from Excel/markdown to TransactionTypeKey.
 */
const TYPE_MAP: Record<string, string> = {
  // Expenses
  "School Expense": "school",
  "Groceries and Food Expense": "groceries",
  "Personal Expense": "personal",
  "General Expense": "general",
  "Other Expense": "other_expense",
  // Income
  Allowance: "allowance",
  Scholarships: "scholarship",
  Other: "other_income", // "Other" without "Expense" is income
};

// ============================================================================
// Parsing
// ============================================================================

interface ParsedTransaction {
  date: string; // YYYY-MM-DD
  type: string; // TransactionTypeKey
  amount: number;
  notes: string | null;
  sourceFile: string;
  sourceLine: number;
}

/**
 * Parse a single line from the markdown file.
 * Format: MM/DD/YYYY\tType Label\t₱Amount\tNotes
 */
function parseLine(
  line: string,
  sourceFile: string,
  lineNumber: number
): ParsedTransaction | null {
  // Skip empty lines
  if (!line.trim()) return null;

  const parts = line.split("\t");
  if (parts.length < 3) {
    console.warn(
      `⚠️  Skipping malformed line ${lineNumber} in ${sourceFile}: ${line}`
    );
    return null;
  }

  const [dateStr, rawType, rawAmount, rawNotes = ""] = parts;

  // Parse date: M/D/YYYY or MM/DD/YYYY → YYYY-MM-DD
  const dateParts = dateStr.trim().split("/");
  if (dateParts.length !== 3) {
    console.warn(`⚠️  Invalid date format at line ${lineNumber}: ${dateStr}`);
    return null;
  }

  const [month, day, yearRaw] = dateParts.map((p) => p.trim());

  // Handle edge case like "9/23/20249" (typo in original data)
  const year = yearRaw.length > 4 ? yearRaw.substring(0, 4) : yearRaw;

  const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  // Parse amount: ₱1,234.00 → 1234.00
  const amount = parseFloat(rawAmount.replace(/[₱,]/g, "").trim());
  if (isNaN(amount)) {
    console.warn(`⚠️  Invalid amount at line ${lineNumber}: ${rawAmount}`);
    return null;
  }

  // Parse type
  const typeLabel = rawType.trim();

  let type: string;
  if (TYPE_MAP[typeLabel]) {
    type = TYPE_MAP[typeLabel];
  } else {
    console.warn(`⚠️  Unknown type at line ${lineNumber}: "${typeLabel}"`);
    return null;
  }

  // Parse notes
  const notes = rawNotes.trim() || null;

  return {
    date,
    type,
    amount,
    notes,
    sourceFile,
    sourceLine: lineNumber,
  };
}

/**
 * Parse all markdown files in the sheets directory.
 */
function parseAllFiles(): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];

  const files = fs.readdirSync(SHEETS_DIR).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const filePath = path.join(SHEETS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    console.log(`📄 Parsing ${file}...`);

    for (let i = 0; i < lines.length; i++) {
      const parsed = parseLine(lines[i], file, i + 1);
      if (parsed) {
        transactions.push(parsed);
      }
    }
  }

  return transactions;
}

// ============================================================================
// Import
// ============================================================================

async function importTransactions(transactions: ParsedTransaction[]) {
  if (!supabase) {
    console.error("❌ Supabase client not initialized");
    return;
  }

  console.log(`\n📥 Importing ${transactions.length} transactions...`);

  // Batch insert in chunks of 100
  const BATCH_SIZE = 100;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
    const batch = transactions.slice(i, i + BATCH_SIZE);

    const rows = batch.map((t) => ({
      date: t.date,
      type: t.type,
      amount: t.amount,
      notes: t.notes,
    }));

    const { error } = await supabase.from("transactions").insert(rows);

    if (error) {
      console.error(`❌ Batch insert error: ${error.message}`);
      errors += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`\r   Inserted: ${inserted}/${transactions.length}`);
    }
  }

  console.log(`\n\n✅ Import complete!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Errors: ${errors}`);
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log("🚀 Gastos Transaction Import\n");

  if (DRY_RUN) {
    console.log("🔍 DRY RUN MODE - No data will be inserted\n");
  }

  // Parse all files
  const transactions = parseAllFiles();

  console.log(`\n📊 Summary:`);
  console.log(`   Total entries: ${transactions.length}`);

  // Count by type
  const typeCounts: Record<string, number> = {};
  for (const t of transactions) {
    typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
  }

  console.log(`\n   By type:`);
  for (const [type, count] of Object.entries(typeCounts).sort()) {
    console.log(`     ${type}: ${count}`);
  }

  // Show sample
  console.log(`\n   Sample entries (first 5):`);
  for (const t of transactions.slice(0, 5)) {
    console.log(
      `     ${t.date} | ${t.type.padEnd(15)} | ₱${t.amount
        .toFixed(2)
        .padStart(10)} | ${t.notes || ""}`
    );
  }

  if (DRY_RUN) {
    console.log(`\n✅ Dry run complete. Run without --dry-run to import.`);
    return;
  }

  // Confirm before inserting
  console.log(`\n⚠️  About to insert ${transactions.length} transactions.`);
  console.log(`   Press Ctrl+C to cancel, or wait 3 seconds to continue...`);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await importTransactions(transactions);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
