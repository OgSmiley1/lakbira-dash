import type { SupportedLocale } from "@shared/i18n";

export type LocaleRow = {
  locale: SupportedLocale;
  name?: string | null;
  description?: string | null;
  story?: string | null;
  fabric?: string | null;
};

export type BaseCopy = {
  name: string;
  description: string;
  story?: string | null;
  fabric?: string | null;
};

/**
 * Resolves the correct localisation payload using the requested locale with English fallback.
 */
export function resolveLocalizedCopy(
  locale: SupportedLocale,
  base: BaseCopy,
  translations: LocaleRow[]
): BaseCopy {
  const match = translations.find(row => row.locale === locale);
  if (match) {
    return {
      name: match.name ?? base.name,
      description: match.description ?? base.description,
      story: match.story ?? base.story ?? null,
      fabric: match.fabric ?? base.fabric ?? null,
    };
  }

  const english = translations.find(row => row.locale === "en");
  if (english) {
    return {
      name: english.name ?? base.name,
      description: english.description ?? base.description,
      story: english.story ?? base.story ?? null,
      fabric: english.fabric ?? base.fabric ?? null,
    };
  }

  return base;
}

export type VariantRow = {
  id: string;
  colorKey: string;
};

export type VariantImageRow = {
  variantId: string;
  imageUrl: string;
  sortOrder?: number | null;
};

/**
 * Groups variant imagery by colour for quick lookup in the client gallery.
 */
export function buildImagesByColor(
  variants: VariantRow[],
  images: VariantImageRow[]
): Record<string, string[]> {
  const grouped: Record<string, { sortOrder: number; imageUrl: string }[]> = {};

  for (const variant of variants) {
    if (!grouped[variant.colorKey]) {
      grouped[variant.colorKey] = [];
    }
  }

  for (const image of images) {
    const variant = variants.find(v => v.id === image.variantId);
    if (!variant) continue;
    const sortOrder = image.sortOrder ?? 0;
    grouped[variant.colorKey].push({ sortOrder, imageUrl: image.imageUrl });
  }

  const result: Record<string, string[]> = {};
  for (const [colorKey, list] of Object.entries(grouped)) {
    result[colorKey] = list
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(item => item.imageUrl);
  }

  return result;
}
