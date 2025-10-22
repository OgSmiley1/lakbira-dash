import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Home from "./Home";

afterEach(() => {
  cleanup();
});

describe("Home", () => {
  it("stacks navigation elements on small screens and realigns for desktops", () => {
    render(<Home />);
    const nav = screen.getByRole("navigation");
    const classes = nav.className;

    expect(classes.includes("flex-col")).toBe(true);
    expect(classes.includes("md:flex-row")).toBe(true);
    expect(classes.includes("gap-4")).toBe(true);
  });

  it("expands primary call-to-action buttons to full width on mobile", () => {
    render(<Home />);

    const waitlistButton = screen.getByRole("button", { name: /join waiting list/i });
    const exploreButton = screen.getByRole("button", { name: /explore collection/i });

    expect(waitlistButton.className.includes("w-full")).toBe(true);
    expect(waitlistButton.className.includes("sm:w-auto")).toBe(true);
    expect(exploreButton.className.includes("w-full")).toBe(true);
    expect(exploreButton.className.includes("sm:w-auto")).toBe(true);
  });

  it("scales the hero title typography across breakpoints", () => {
    render(<Home />);

    const heroTitle = screen.getByText("مجموعة رمضان");
    const classes = heroTitle.className;

    expect(classes.includes("text-4xl")).toBe(true);
    expect(classes.includes("sm:text-6xl")).toBe(true);
    expect(classes.includes("md:text-8xl")).toBe(true);
  });
});
