import { afterEach, describe, expect, it, vi } from "vitest";
import * as dbModule from "./db";
import { collections, products } from "../drizzle/schema";

const insertValuesMock = vi.fn().mockResolvedValue(undefined);
const updateWhereMock = vi.fn().mockResolvedValue(undefined);
const dbStub = {
  insert: vi.fn(() => ({ values: insertValuesMock })),
  update: vi.fn(() => ({ set: vi.fn(() => ({ where: updateWhereMock })) })),
};

describe("content management database helpers", () => {
  afterEach(() => {
    dbModule.__setDbInstance(null);
    vi.restoreAllMocks();
    insertValuesMock.mockClear();
    updateWhereMock.mockClear();
    dbStub.insert.mockClear();
    dbStub.update.mockClear();
  });

  it("persists a new collection with media metadata", async () => {
    dbModule.__setDbInstance(dbStub as any);

    await dbModule.createCollection({
      nameEn: "Eid Capsule",
      nameAr: "مجموعة العيد",
      descriptionEn: "Curated silhouettes",
      descriptionAr: "تصاميم مختارة",
      coverImage: "https://cdn.example.com/eid-cover.jpg",
      videoUrl: "https://cdn.example.com/eid.mp4",
    });

    expect(dbStub.insert).toHaveBeenCalledWith(collections);
    expect(insertValuesMock).toHaveBeenCalled();
    const payload = insertValuesMock.mock.calls[0][0];
    expect(payload).toMatchObject({
      nameEn: "Eid Capsule",
      nameAr: "مجموعة العيد",
      descriptionEn: "Curated silhouettes",
      descriptionAr: "تصاميم مختارة",
      coverImage: "https://cdn.example.com/eid-cover.jpg",
      videoUrl: "https://cdn.example.com/eid.mp4",
      isActive: true,
    });
  });

  it("updates a collection's hero media assets", async () => {
    dbModule.__setDbInstance(dbStub as any);

    await dbModule.updateCollectionMedia("col1", {
      videoUrl: "https://cdn.example.com/new-hero.mp4",
      coverImage: "https://cdn.example.com/new-hero.jpg",
    });

    expect(dbStub.update).toHaveBeenCalledWith(collections);
    const setFn = (dbStub.update.mock.results[0].value as any).set;
    expect(setFn).toHaveBeenCalledWith({
      videoUrl: "https://cdn.example.com/new-hero.mp4",
      coverImage: "https://cdn.example.com/new-hero.jpg",
    });
    expect(updateWhereMock).toHaveBeenCalled();
  });

  it("updates product pricing and presentation assets", async () => {
    dbModule.__setDbInstance(dbStub as any);

    await dbModule.updateProductDetails("prod1", {
      basePrice: 210000,
      images: ["https://cdn.example.com/moonlight-1.jpg"],
      availableColors: [
        { hex: "#D4AF37", name: "Royal Gold" },
        { hex: "#1F3B4D", name: "Midnight Indigo" },
      ],
    });

    expect(dbStub.update).toHaveBeenCalledWith(products);
    const setFn = (dbStub.update.mock.results[0].value as any).set;
    expect(setFn).toHaveBeenCalledWith({
      basePrice: 210000,
      images: JSON.stringify(["https://cdn.example.com/moonlight-1.jpg"]),
      availableColors: JSON.stringify([
        { hex: "#D4AF37", name: "Royal Gold" },
        { hex: "#1F3B4D", name: "Midnight Indigo" },
      ]),
    });
    expect(updateWhereMock).toHaveBeenCalled();
  });
});
