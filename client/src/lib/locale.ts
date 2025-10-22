export type SupportedLocale = "en" | "ar";

/**
 * Reads the <html lang> attribute to determine the current UI locale.
 */
export function getDocumentLocale(): SupportedLocale {
  if (typeof document === "undefined") {
    return "en";
  }

  const lang = document.documentElement.lang?.toLowerCase() ?? "en";
  return lang.startsWith("ar") ? "ar" : "en";
}

/**
 * Utility guard to simplify conditional rendering for Arabic layouts.
 */
export function isArabicLocale(locale: SupportedLocale): boolean {
  return locale === "ar";
}
