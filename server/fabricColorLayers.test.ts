import { describe, expect, it } from "vitest";
import { resolveDefaultFabricColor } from "../shared/lib/fabricColor";

describe("resolveDefaultFabricColor", () => {
  it("returns null when there are no available colors", () => {
    expect(resolveDefaultFabricColor([], null)).toBeNull();
  });

  it("returns the first available color when nothing is selected", () => {
    const available = [
      { id: "rose", hex: "#f5c6d6" },
      { id: "pearls", hex: "#f1ede8" },
    ];

    expect(resolveDefaultFabricColor(available, null)).toEqual(available[0]);
  });

  it("returns the previously selected color when it is still available", () => {
    const available = [
      { id: "rose", hex: "#f5c6d6" },
      { id: "pearls", hex: "#f1ede8" },
    ];

    expect(resolveDefaultFabricColor(available, available[1])).toBe(available[1]);
  });

  it("falls back to the first available color when the current selection is no longer present", () => {
    const available = [
      { id: "rose", hex: "#f5c6d6" },
      { id: "pearls", hex: "#f1ede8" },
    ];

    const staleSelection = { id: "emerald", hex: "#3a9d5d" };

    expect(resolveDefaultFabricColor(available, staleSelection)).toEqual(available[0]);
  });
});
