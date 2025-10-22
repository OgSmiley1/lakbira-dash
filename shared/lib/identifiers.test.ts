import { describe, expect, it } from "vitest";
import { generateReadableId } from "./identifiers";

describe("generateReadableId", () => {
  it("creates an uppercase identifier with prefix and timestamp", () => {
    const id = generateReadableId("REG");

    expect(id.startsWith("REG-")).toBe(true);
    const parts = id.split("-");
    expect(parts).toHaveLength(3);
    expect(parts[1]).toMatch(/^\d{8}$/);
    expect(parts[2]).toMatch(/^[A-Z0-9]{5}$/);
  });

  it("generates unique values for subsequent calls", () => {
    const total = 100;
    const ids = new Set(Array.from({ length: total }, () => generateReadableId("CLT")));

    expect(ids.size).toBe(total);
  });
});
