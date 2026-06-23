export function formatPrice(value: number | undefined, currency = "$"): string {
  if (!value || value <= 0) return "Price on request";
  if (value >= 1_000_000) {
    return `${currency}${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (value >= 1_000) {
    return `${currency}${Math.round(value / 1_000)}K`;
  }
  return `${currency}${value.toLocaleString()}`;
}

export function formatFullPrice(value: number | undefined, currency = "$"): string {
  if (!value || value <= 0) return "Price on request";
  return `${currency}${value.toLocaleString()}`;
}

export function formatArea(value: number | undefined): string {
  if (!value || value <= 0) return "—";
  return `${value} m²`;
}

export function availabilityLabel(a: string): string {
  if (a === "available") return "Available";
  if (a === "reserved") return "Reserved";
  if (a === "sold") return "Sold";
  return a;
}

/** Monthly mortgage payment using standard amortization. */
export function monthlyPayment(
  principal: number,
  annualRatePercent: number,
  years: number,
): number {
  if (principal <= 0 || years <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return principal / n;
  const factor = Math.pow(1 + monthlyRate, n);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function buildWhatsappLink(rawNumber: string, message: string): string {
  const number = (rawNumber || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
