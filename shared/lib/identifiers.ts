/**
 * Generates a human readable identifier using a prefix, the current date, and a short random suffix.
 *
 * @param prefix - The uppercase prefix identifying the entity type (e.g., "REG" or "ORD").
 * @returns An identifier in the format `${prefix}-YYYYMMDD-RANDOM`.
 */
export function generateReadableId(prefix: string): string {
  const normalizedPrefix = prefix.toUpperCase();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStamp = `${year}${month}${day}`;
  const randomSuffix = Array.from({ length: 5 }, () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const index = Math.floor(Math.random() * alphabet.length);
    return alphabet[index];
  }).join("");

  return `${normalizedPrefix}-${dateStamp}-${randomSuffix}`;
}
