import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ManusAdBanner } from "./ManusAdBanner";

describe("ManusAdBanner", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the Manus promotional copy and triggers action", () => {
    const onAction = vi.fn();

    render(
      <ManusAdBanner
        headline="Experience Manus Integration"
        body="Seamlessly preview your Manus-powered dashboard."
        ctaLabel="Open Manus Preview"
        onAction={onAction}
      />
    );

    expect(
      screen.getByRole("heading", { name: /experience manus integration/i })
    ).toBeTruthy();
    expect(
      screen.getByText(/seamlessly preview your manus-powered dashboard/i)
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /open manus preview/i }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("displays optional footnote content when provided", () => {
    render(
      <ManusAdBanner
        headline="Accelerate onboarding"
        body="Use Manus to review and approve submissions instantly."
        ctaLabel="Launch Manus"
        footnote="Requires Manus administrator privileges."
      />
    );

    expect(
      screen.getByText(/requires manus administrator privileges/i)
    ).toBeTruthy();
  });
});
