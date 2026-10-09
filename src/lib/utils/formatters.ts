/**
 * Deterministic Number & Currency Formatters for DRISHTI-SWARM
 * Guarantees identical output across SSR (Node) and Client (Browser) to prevent hydration mismatches.
 */

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatIndianCurrencyCrores(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '₹0 Cr';
  return `₹${formatNumber(num)} Cr`;
}
