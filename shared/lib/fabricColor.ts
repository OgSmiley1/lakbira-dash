/**
 * Shape definition for colour records retrieved from the API.
 */
export interface FabricColorLike {
  /** Hexadecimal colour string used for swatch previews. */
  hex?: string | null;
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

  const normalised = availableColors.filter((color): color is T => {
    return typeof color?.hex === "string" && color.hex.trim().length > 0;
  });

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
