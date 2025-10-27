import { describe, expect, it } from "vitest";
import { resolveLocalizedCopy, buildImagesByColor } from "./localization";

describe("resolveLocalizedCopy", () => {
  const base = {
    name: "Oasis Bloom",
    description: "English description",
    story: "English story",
    fabric: "English fabric",
  };

  it("returns locale specific fields when available", () => {
    const result = resolveLocalizedCopy(
      "ar",
      base,
      [
        { locale: "en", name: "Oasis Bloom", description: "English description", story: "English story", fabric: "English fabric" },
        { locale: "ar", name: "تفتّح الواحة", description: "وصف عربي", story: "قصة عربية", fabric: "نسيج عربي" },
      ]
    );

    expect(result).toEqual({
      name: "تفتّح الواحة",
      description: "وصف عربي",
      story: "قصة عربية",
      fabric: "نسيج عربي",
    });
  });

  it("falls back to english when locale is missing", () => {
    const result = resolveLocalizedCopy(
      "ar",
      base,
      [{ locale: "en", name: "Oasis Bloom", description: "English description", story: "English story", fabric: "English fabric" }]
    );

    expect(result).toEqual(base);
  });
});

describe("buildImagesByColor", () => {
  it("groups variant images by colour key", () => {
    const result = buildImagesByColor(
      [
        { id: "variant-1", colorKey: "#ffffff" },
        { id: "variant-2", colorKey: "#000000" },
      ],
      [
        { variantId: "variant-1", imageUrl: "white-1.jpg", sortOrder: 1 },
        { variantId: "variant-1", imageUrl: "white-2.jpg", sortOrder: 2 },
        { variantId: "variant-2", imageUrl: "black-1.jpg", sortOrder: 1 },
      ]
    );

    expect(result).toEqual({
      "#ffffff": ["white-1.jpg", "white-2.jpg"],
      "#000000": ["black-1.jpg"],
    });
  });
});
