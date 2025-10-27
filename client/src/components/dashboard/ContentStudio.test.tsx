import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DashboardContentStudio from "./ContentStudio";

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
      { hex: "#D4AF37", name: "Royal Gold" },
    ],
  },
];

const updateCollectionMediaMock = vi.fn().mockResolvedValue(undefined);
const createCollectionMock = vi.fn().mockResolvedValue({ success: true, collectionId: "col-new" });
const updateProductDetailsMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/trpc", () => ({
  trpc: {
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
      collections: { list: { invalidate: vi.fn() } },
      products: { list: { invalidate: vi.fn() } },
    }),
  },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("DashboardContentStudio", () => {
  it("updates hero media, creates collections, and saves product details", async () => {
    render(<DashboardContentStudio />);

    const heroVideoInput = screen.getByLabelText(/hero video url/i) as HTMLInputElement;
    fireEvent.change(heroVideoInput, { target: { value: "https://cdn.example.com/new-hero.mp4" } });

    const heroForm = screen.getByTestId("hero-video-form");
    fireEvent.submit(heroForm);

    await waitFor(() =>
      expect(updateCollectionMediaMock).toHaveBeenCalledWith({
        collectionId: "col1",
        videoUrl: "https://cdn.example.com/new-hero.mp4",
        coverImage: "https://cdn.example.com/ramadan.jpg",
      }),
    );

    fireEvent.change(screen.getByLabelText(/collection name \(english\)/i), {
      target: { value: "Eid Capsule" },
    });
    fireEvent.change(screen.getByLabelText(/collection name \(arabic\)/i), {
      target: { value: "مجموعة العيد" },
    });

    const createForm = screen.getByTestId("create-collection-form");
    fireEvent.submit(createForm);

    await waitFor(() =>
      expect(createCollectionMock).toHaveBeenCalledWith({
        nameEn: "Eid Capsule",
        nameAr: "مجموعة العيد",
        descriptionEn: undefined,
        descriptionAr: undefined,
        videoUrl: undefined,
        coverImage: undefined,
      }),
    );

    fireEvent.change(screen.getByLabelText(/base price \(aed\)/i), {
      target: { value: "210000" },
    });
    fireEvent.change(screen.getByLabelText(/gallery image urls/i), {
      target: {
        value: "https://cdn.example.com/moonlight-1.jpg,https://cdn.example.com/moonlight-2.jpg",
      },
    });
    fireEvent.change(screen.getByLabelText(/fabric colours/i), {
      target: { value: "D4AF37 Royal Gold,1F3B4D Midnight Indigo" },
    });

    const productForm = screen.getByTestId("product-update-form");
    fireEvent.submit(productForm);

    await waitFor(() =>
      expect(updateProductDetailsMock).toHaveBeenCalledWith({
        productId: "prod1",
        basePrice: 210000,
        images: [
          "https://cdn.example.com/moonlight-1.jpg",
          "https://cdn.example.com/moonlight-2.jpg",
        ],
        availableColors: [
          { hex: "#D4AF37", name: "Royal Gold", nameAr: undefined },
          { hex: "#1F3B4D", name: "Midnight Indigo", nameAr: undefined },
        ],
      }),
    );
  });
});
