export function normalizePhone(phone: string): string | null {
  const digits = phone.replaceAll(/\D/g, "");
  const isUsNumber =
    digits.length === 10 || (digits.length === 11 && digits[0] === "1");
  const number = isUsNumber ? digits.slice(-10) : null;
  return isUsNumber ? `+1${number}` : null;
}
