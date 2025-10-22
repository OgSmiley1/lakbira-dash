import React from "react";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { ManusDialog } from "./ManusDialog";

/**
 * Updates the <html> locale attributes to simulate runtime language toggling.
 */
function setDocumentLocale({ lang, dir }: { lang: string; dir: "ltr" | "rtl" }) {
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
}

describe("ManusDialog", () => {
  beforeEach(() => {
    setDocumentLocale({ lang: "en", dir: "ltr" });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders English copy by default", () => {
    render(<ManusDialog onLogin={() => {}} open />);

    expect(screen.getByText(/Please login with Manus/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Login with Manus/i })).toBeTruthy();
  });

  it("renders Arabic copy when the document locale is Arabic", () => {
    setDocumentLocale({ lang: "ar", dir: "rtl" });

    render(<ManusDialog onLogin={() => {}} open />);

    expect(screen.getByText(/يرجى تسجيل الدخول عبر Manus للمتابعة/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /تسجيل الدخول عبر Manus/i })).toBeTruthy();
  });
});
