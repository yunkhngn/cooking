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

/**
 * Formats Title Case strings (e.g. "Thực Đơn Cơm Nhà Bình Dân Ấm Cúng")
 * to standard Vietnamese sentence case ("Thực đơn cơm nhà bình dân ấm cúng")
 * while preserving proper noun capitalization (e.g. Việt Nam, Hàn Quốc).
 */
export function toSentenceCase(str: string): string {
  if (!str) return str;
  const trimmed = str.trim();
  let sentence = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();

  const properNouns = [
    "Việt Nam", "Hàn Quốc", "Nhật Bản", "Trung Hoa", "Thái Lan", "Ý", "Mỹ",
  ];
  for (const noun of properNouns) {
    const regex = new RegExp(`\\b${noun}\\b`, "gi");
    sentence = sentence.replace(regex, noun);
  }
  return sentence;
}
