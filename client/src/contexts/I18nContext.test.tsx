import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { I18nProvider, useI18n, T } from "./I18nContext";
import type { ReactNode } from "react";

function renderWithI18n(ui: ReactNode, locale: "en" | "ar" = "en") {
  return render(<I18nProvider initialLocale={locale}>{ui}</I18nProvider>);
}

describe("I18nProvider", () => {
  const originalLang = document.documentElement.lang;
  const originalDir = document.documentElement.dir;

  beforeEach(() => {
    document.documentElement.lang = originalLang;
    document.documentElement.dir = originalDir;
  });

  it("updates html lang and dir when locale changes", async () => {
    const TestComponent = () => {
      const { setLocale } = useI18n();
      return (
        <button onClick={() => setLocale("ar")}>
          change
        </button>
      );
    };

    renderWithI18n(<TestComponent />);

    screen.getByRole("button", { name: "change" }).click();

    await waitFor(() => {
      expect(document.documentElement.getAttribute("lang")).toBe("ar");
      expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    });
  });

  it("renders translated strings via <T>", () => {
    renderWithI18n(
      <div>
        <T k="app.title" />
      </div>,
      "ar"
    );

    expect(screen.getByText("منصّة لقبرة")).toBeTruthy();
  });
});
