import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "1", role: "admin" },
    loading: false,
    isAuthenticated: true,
  }),
}));

const ordersMock = [
  {
    id: "o1",
    orderNumber: "LK123456",
    customerName: "Salma",
    customerEmail: "salma@example.com",
    customerPhone: "+97150000000",
    shippingCity: "Dubai",
    shippingCountry: "UAE",
    selectedColor: "Gold",
    selectedSize: "M",
    totalPrice: 150000,
    status: "pending",
    updatedAt: new Date().toISOString(),
  },
];

const registrationsMock = [
  {
    id: "r1",
    registrationNumber: "REG-20250101-AB123",
    fullName: "Amal",
    email: "amal@example.com",
    phone: "+97151111111",
    city: "Abu Dhabi",
    country: "UAE",
    preferredLanguage: "en",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
];

const collectionsMock = [
  {
    id: "col1",
    nameEn: "Ramadan 2025",
    nameAr: "مجموعة رمضان ٢٠٢٥",
    videoUrl: "https://cdn.example.com/ramadan.mp4",
    coverImage: "https://cdn.example.com/ramadan.jpg",
  },
];

const productsMock = [
  {
    id: "prod1",
    nameEn: "Moonlight Kaftan",
    nameAr: "قفطان ضوء القمر",
    basePrice: 175000,
    images: ["https://cdn.example.com/moonlight-1.jpg"],
    availableColors: [
      { hex: "#D4AF37", name: "Royal Gold", nameAr: "ذهبي ملكي" },
    ],
  },
];

const updateCollectionMediaMock = vi.fn().mockResolvedValue(undefined);
const createCollectionMock = vi.fn().mockResolvedValue({ success: true, collectionId: "col-new" });
const updateProductDetailsMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/trpc", () => ({
  trpc: {
    orders: {
      list: {
        useQuery: () => ({ data: ordersMock, isLoading: false, refetch: vi.fn() }),
      },
      updateStatus: {
        useMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
      },
    },
    registrations: {
      list: {
        useQuery: () => ({ data: registrationsMock, isLoading: false }),
      },
    },
    collections: {
      list: {
        useQuery: () => ({ data: collectionsMock, isLoading: false }),
      },
      updateMedia: {
        useMutation: () => ({ mutateAsync: updateCollectionMediaMock, isPending: false }),
      },
      create: {
        useMutation: () => ({ mutateAsync: createCollectionMock, isPending: false }),
      },
    },
    products: {
      list: {
        useQuery: () => ({ data: productsMock, isLoading: false }),
      },
      updateDetails: {
        useMutation: () => ({ mutateAsync: updateProductDetailsMock, isPending: false }),
      },
    },
    useUtils: () => ({
      orders: { list: { invalidate: vi.fn() } },
      collections: { list: { invalidate: vi.fn() } },
      products: { list: { invalidate: vi.fn() } },
    }),
  },
}));

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  document.documentElement.lang = "en";
});

describe("Dashboard", () => {
  it("shows waiting list and registrations tabs in English", async () => {
    render(<Dashboard />);

    expect(screen.getByRole("tab", { name: /waiting list/i })).toBeTruthy();
    const registrationsTab = screen.getByRole("tab", { name: /registrations/i });
    expect(registrationsTab).toBeTruthy();
    fireEvent.click(registrationsTab);
    expect(await screen.findByText(/LK123456/)).toBeTruthy();
    expect(screen.getByText(/Total Registrations/i)).toBeTruthy();
  });

  it("switches labels to Arabic when the page language is Arabic", () => {
    document.documentElement.lang = "ar";
    render(<Dashboard />);

    expect(screen.getByRole("tab", { name: /قائمة الانتظار/ })).toBeTruthy();
    expect(screen.getByRole("tab", { name: /التسجيلات/ })).toBeTruthy();
  });

  it("exposes a content studio tab for media management", () => {
    render(<Dashboard />);

    expect(screen.getByRole("tab", { name: /content studio/i })).toBeTruthy();
  });
});
