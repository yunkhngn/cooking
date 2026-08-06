export function vnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}đ`;
}

/**
 * Formats digits to Vietnamese currency string, e.g. 150000 -> "150.000đ"
 */
export function formatVndInput(val: string | number): string {
  const digits = String(val).replace(/\D/g, "");
  if (!digits) return "";
  const num = parseInt(digits, 10);
  return `${num.toLocaleString("vi-VN")}đ`;
}

/**
 * Extracts raw integer number from formatted string, e.g. "150.000đ" -> 150000
 */
export function parseVndInput(val: string | number): number {
  const digits = String(val).replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}
