import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProductDetail from "./ProductDetail";
import { I18nProvider } from "@/contexts/I18nContext";

const productMock = {
  id: "prod_1",
  name: "Golden Mirage Kaftan",
  description: "Hand embroidered silk with shimmering gold accents.",
  story: "Crafted in Marrakech with lunar motifs.",
  fabric: "100% Moroccan silk",
  basePrice: 180000,
  images: ["/kaftan-main.jpg", "/kaftan-alt.jpg"],
  imagesByColor: {
    "#C19A6B": ["/kaftan-gold-1.jpg", "/kaftan-gold-2.jpg"],
    "#3A7D44": ["/kaftan-emerald-1.jpg", "/kaftan-emerald-2.jpg"],
  },
  availableColors: [
    { hex: "#C19A6B", name: "Desert Gold", nameAr: "ذهبي صحراوي" },
    { hex: "#3A7D44", name: "Emerald Grove", nameAr: "زمردي" },
  ],
  availableSizes: ["S", "M", "L"],
  fabricAr: "حرير مغربي ١٠٠٪",
  localized: {
    name: "Golden Mirage Kaftan",
    nameAr: "قفطان السراب الذهبي",
    description: "Hand embroidered silk with shimmering gold accents.",
    story: "Crafted in Marrakech with lunar motifs.",
    fabric: "100% Moroccan silk",
  },
};

vi.mock("wouter", () => ({
  useRoute: () => [true, { id: "prod_1" }],
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const getByIdMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/trpc", () => ({
  trpc: {
    products: {
      getById: {
        useQuery: getByIdMock,
      },
    },
  },
}));

const renderWithI18n = () =>
  render(
    <I18nProvider initialLocale="en">
      <ProductDetail />
    </I18nProvider>
  );

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeEach(() => {
  document.documentElement.lang = "en";
  getByIdMock.mockReturnValue({ data: productMock, isLoading: false });
});

describe("ProductDetail fabric preview", () => {
  it("tints the hero image with the default fabric colour", async () => {
    renderWithI18n();

    const overlay = screen.getByTestId("fabric-color-overlay");

    expect(overlay).toBeTruthy();
    await waitFor(() => {
      expect(overlay.style.backgroundColor).toBe("rgb(193, 154, 107)");
    });
  });

  it("updates the tint when a different swatch is selected", async () => {
    renderWithI18n();

    const emeraldButton = screen.getByRole("button", {
      name: /select color.*emerald grove/i,
    });

    fireEvent.click(emeraldButton);

    const overlay = screen.getByTestId("fabric-color-overlay");
    await waitFor(() => {
      expect(overlay.style.backgroundColor).toBe("rgb(58, 125, 68)");
    });
  });

  it("swaps gallery images when a colour variant is chosen", async () => {
    renderWithI18n();

    const heroImage = screen.getByRole("img", { name: /golden mirage kaftan/i });
    expect(heroImage.getAttribute("src")).toBe("/kaftan-gold-1.jpg");

    const emeraldButton = screen.getByRole("button", {
      name: /select color.*emerald grove/i,
    });

    fireEvent.click(emeraldButton);

    await waitFor(() => {
      expect(heroImage.getAttribute("src")).toBe("/kaftan-emerald-1.jpg");
    });
  });
});
