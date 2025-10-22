import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
    useUtils: () => ({ orders: { list: { invalidate: vi.fn() } } }),
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
});
