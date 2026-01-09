/**
 * Safely evaluate a basic math expression.
 * Supports: +, -, *, / with decimals and PEMDAS order.
 *
 * @param expression - Math expression like "100+50" or "500*0.8"
 * @returns The calculated result, or null if invalid
 */
export function parseAmount(expression: string): number | null {
  // Clean up the expression
  const cleaned = expression.trim().replace(/\s+/g, "");

  // Empty string
  if (!cleaned) return null;

  // If it's just a number, return it directly
  const directNumber = parseFloat(cleaned);
  if (!isNaN(directNumber) && /^-?\d+\.?\d*$/.test(cleaned)) {
    return directNumber;
  }

  // Only allow: digits, decimal points, +, -, *, /, (, )
  if (!/^[\d+\-*/().]+$/.test(cleaned)) {
    return null;
  }

  // Prevent dangerous patterns
  if (/[+\-*/]{2,}/.test(cleaned)) {
    return null; // No consecutive operators
  }

  try {
    // Use Function constructor for safe eval with PEMDAS
    // This is safer than eval() as it doesn't access scope
    const result = new Function(`return (${cleaned})`)();

    // Validate result
    if (typeof result !== "number" || !isFinite(result) || isNaN(result)) {
      return null;
    }

    // Round to 2 decimal places for currency
    return Math.round(result * 100) / 100;
  } catch {
    return null;
  }
}
