import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren, type ReactElement } from "react";
import { strings, type TranslationKey } from "@/strings";
import type { SupportedLocale } from "@shared/i18n";

/**
 * Context payload describing the active locale and translation utilities.
 */
export type I18nContextValue = {
  /** Currently active locale. */
  locale: SupportedLocale;
  /** Updates the active locale and cascades layout direction changes. */
  setLocale: (locale: SupportedLocale) => void;
  /** Resolves a translation key for the active locale with fallback to English. */
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const HTML_DIRECTION: Record<SupportedLocale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

const HTML_LANG: Record<SupportedLocale, string> = {
  en: "en",
  ar: "ar",
};

const DEFAULT_LOCALE: SupportedLocale = "en";

/**
 * Provides locale-aware translations to the React tree and synchronises document metadata.
 */
export function I18nProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: PropsWithChildren<{ initialLocale?: SupportedLocale }>): ReactElement {
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);

  useEffect(() => {
    const lang = HTML_LANG[locale] ?? HTML_LANG[DEFAULT_LOCALE];
    const dir = HTML_DIRECTION[locale] ?? HTML_DIRECTION[DEFAULT_LOCALE];
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
  }, [locale]);

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      const localeStrings = (strings[locale] ?? strings[DEFAULT_LOCALE]) as Record<TranslationKey, string>;
      return localeStrings[key] ?? strings[DEFAULT_LOCALE][key] ?? key;
    },
    [locale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Hook exposing the i18n context with safeguards for missing providers.
 */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

/**
 * Translates the provided key using the nearest i18n provider.
 */
export function T({ k }: { k: TranslationKey }): ReactElement {
  const { t } = useI18n();
  return <>{t(k)}</>;
}
