/**
 * Shape definition for colour records retrieved from the API.
 */
export interface FabricColorLike {
  /** Hexadecimal colour string used for swatch previews. */
  hex?: string | null;
}

/**
 * Normalises a hexadecimal colour string so CSS consumers can reliably use it.
 *
 * The helper trims whitespace, removes duplicate hash prefixes, strips any
 * illegal characters, and guarantees a leading `#` for valid values. Invalid
 * inputs (including empty strings) return `null` so callers can gracefully
 * ignore unusable colours.
 *
 * @param hex - Raw hexadecimal colour input from APIs or user forms.
 * @returns A CSS-ready hexadecimal string beginning with `#`, or `null`.
 */
export function normaliseFabricHex(hex?: string | null): string | null {
  if (typeof hex !== "string") {
    return null;
  }

  const trimmed = hex.trim();
  if (!trimmed) {
    return null;
  }

  const withoutHashes = trimmed.replace(/^#+/, "");
  const sanitised = withoutHashes.replace(/[^0-9a-fA-F]/g, "");

  if (!sanitised) {
    return null;
  }

  return `#${sanitised}`;
}

/**
 * Determines which fabric colour should be treated as the active selection.
 *
 * The function prioritises the previously selected colour when it still exists
 * within the available palette. If the stored selection is missing or stale, it
 * falls back to the first valid colour exposed by the API. When no colours are
 * available, the function returns null.
 *
 * @param availableColors - The list of selectable colours provided by the API.
 * @param currentSelection - The colour currently persisted in component state.
 * @returns A colour object that should be considered the active selection.
 */
export function resolveDefaultFabricColor<T extends FabricColorLike>(
  availableColors: T[] | null | undefined,
  currentSelection: T | null | undefined,
): T | null {
  if (!Array.isArray(availableColors) || availableColors.length === 0) {
    return null;
  }

  const normalised: T[] = [];

  for (const color of availableColors) {
    const hex = normaliseFabricHex(color?.hex ?? null);
    if (!hex) {
      continue;
    }

    (color as T).hex = hex as any;
    normalised.push(color as T);
  }

  if (normalised.length === 0) {
    return null;
  }

  const selectionHex = currentSelection?.hex?.trim().toLowerCase();

  if (selectionHex) {
    const matchingColor = normalised.find(
      (color) => color.hex?.trim().toLowerCase() === selectionHex,
    );

    if (matchingColor) {
      return matchingColor;
    }
  }

  return normalised[0] ?? null;
}
