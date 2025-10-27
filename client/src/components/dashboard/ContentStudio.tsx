import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { normaliseFabricHex } from "@shared/lib/fabricColor";

/**
 * Enables administrators to update hero media, create new collections,
 * and adjust pricing or visual assets for couture pieces.
 */
export function DashboardContentStudio(): React.JSX.Element {
  const utils = trpc.useUtils();
  const collectionsQuery = trpc.collections.list.useQuery();
  const productsQuery = trpc.products.list.useQuery();
  const updateCollectionMediaMutation = trpc.collections.updateMedia.useMutation();
  const createCollectionMutation = trpc.collections.create.useMutation();
  const updateProductDetailsMutation = trpc.products.updateDetails.useMutation();

  const collections = collectionsQuery.data ?? [];
  const products = productsQuery.data ?? [];

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const [newCollection, setNewCollection] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    videoUrl: "",
    coverImage: "",
  });

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productPrice, setProductPrice] = useState("");
  const [productImages, setProductImages] = useState("");
  const [productColors, setProductColors] = useState("");

  useEffect(() => {
    if (collections.length > 0 && !selectedCollectionId) {
      setSelectedCollectionId(collections[0]?.id ?? "");
    }
  }, [collections, selectedCollectionId]);

  const activeCollection = useMemo(() => {
    return collections.find(collection => collection.id === selectedCollectionId);
  }, [collections, selectedCollectionId]);

  useEffect(() => {
    if (activeCollection) {
      setHeroVideoUrl(activeCollection.videoUrl ?? "");
      setCoverImageUrl(activeCollection.coverImage ?? "");
    }
  }, [activeCollection]);

  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0]?.id ?? "");
    }
  }, [products, selectedProductId]);

  useEffect(() => {
    const currentProduct = products.find(product => product.id === selectedProductId);
    if (currentProduct) {
      const currentImages = Array.isArray(currentProduct.images)
        ? currentProduct.images
        : typeof currentProduct.images === "string" && currentProduct.images.length > 0
        ? [currentProduct.images]
        : [];
      const currentColours = Array.isArray(currentProduct.availableColors)
        ? currentProduct.availableColors
        : [];
      setProductPrice(
        typeof currentProduct.basePrice === "number" ? String(currentProduct.basePrice) : "",
      );
      setProductImages(currentImages.join(","));
      setProductColors(
        currentColours
          .map((color: { hex: string; name?: string | null }) => {
            const hex = normaliseFabricHex(color.hex) ?? "";
            const label = color.name ?? "";
            return `${hex} ${label}`.trim();
          })
          .filter(Boolean)
          .join(","),
      );
    }
  }, [products, selectedProductId]);

  /**
   * Normalises a comma separated list of URLs into a cleaned string array.
   */
  const parseImages = (value: string): string[] => {
    return value
      .split(",")
      .map(segment => segment.trim())
      .filter(Boolean);
  };

  /**
   * Normalises comma separated colour descriptors into structured records while
   * sanitising hex values so downstream CSS consumers receive valid strings.
   */
  const parseColors = (
    value: string,
  ): Array<{ hex: string; name?: string; nameAr?: string }> => {
    return value
      .split(",")
      .map(segment => segment.trim())
      .filter(Boolean)
      .reduce<Array<{ hex: string; name?: string; nameAr?: string }>>((acc, segment) => {
        const [hexCandidate, ...nameParts] = segment.split(/\s+/);
        if (!hexCandidate) {
          return acc;
        }

        const normalisedHex = normaliseFabricHex(hexCandidate);
        if (!normalisedHex) {
          return acc;
        }

        acc.push({
          hex: normalisedHex,
          name: nameParts.join(" ") || undefined,
        });

        return acc;
      }, []);
  };

  const handleHeroFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCollectionId) {
      toast.error("Please select a collection to update.");
      return;
    }

    try {
      await updateCollectionMediaMutation.mutateAsync({
        collectionId: selectedCollectionId,
        videoUrl: heroVideoUrl.trim() || undefined,
        coverImage: coverImageUrl.trim() || undefined,
      });
      await utils.collections.list.invalidate();
      toast.success("Collection media updated");
    } catch (error) {
      console.error("Failed to update collection media", error);
      toast.error("Unable to update collection media");
    }
  };

  const handleCreateCollection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newCollection.nameEn || !newCollection.nameAr) {
      toast.error("Collection names are required in both languages.");
      return;
    }

    try {
      await createCollectionMutation.mutateAsync({
        nameEn: newCollection.nameEn.trim(),
        nameAr: newCollection.nameAr.trim(),
        descriptionEn: newCollection.descriptionEn.trim() || undefined,
        descriptionAr: newCollection.descriptionAr.trim() || undefined,
        videoUrl: newCollection.videoUrl.trim() || undefined,
        coverImage: newCollection.coverImage.trim() || undefined,
      });
      await utils.collections.list.invalidate();
      toast.success("Collection created");
      setNewCollection({
        nameEn: "",
        nameAr: "",
        descriptionEn: "",
        descriptionAr: "",
        videoUrl: "",
        coverImage: "",
      });
    } catch (error) {
      console.error("Failed to create collection", error);
      toast.error("Unable to create collection");
    }
  };

  const handleProductUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProductId) {
      toast.error("Please choose a product to update.");
      return;
    }

    const parsedImages = parseImages(productImages);
    const parsedColors = parseColors(productColors);
    const numericPrice = productPrice ? Number(productPrice) : undefined;

    try {
      await updateProductDetailsMutation.mutateAsync({
        productId: selectedProductId,
        basePrice: numericPrice,
        images: parsedImages.length > 0 ? parsedImages : undefined,
        availableColors: parsedColors.length > 0 ? parsedColors : undefined,
      });
      await utils.products.list.invalidate();
      toast.success("Product details updated");
    } catch (error) {
      console.error("Failed to update product details", error);
      toast.error("Unable to update product details");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2" aria-label="Content studio forms">
      <Card>
        <CardHeader>
          <CardTitle>Hero Media Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleHeroFormSubmit} data-testid="hero-video-form">
            <div className="space-y-2">
              <Label htmlFor="collection-select">Select Collection</Label>
              <select
                id="collection-select"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedCollectionId}
                onChange={event => setSelectedCollectionId(event.target.value)}
              >
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>
                    {collection.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-video-url">Hero video URL</Label>
              <Input
                id="hero-video-url"
                placeholder="https://cdn.example.com/hero.mp4"
                value={heroVideoUrl}
                onChange={event => setHeroVideoUrl(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-cover-image">Cover image URL</Label>
              <Input
                id="hero-cover-image"
                placeholder="https://cdn.example.com/hero.jpg"
                value={coverImageUrl}
                onChange={event => setCoverImageUrl(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={updateCollectionMediaMutation.isPending}>
              {updateCollectionMediaMutation.isPending ? "Saving..." : "Save hero media"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleCreateCollection} data-testid="create-collection-form">
            <div className="space-y-2">
              <Label htmlFor="collection-name-en">Collection name (English)</Label>
              <Input
                id="collection-name-en"
                value={newCollection.nameEn}
                onChange={event => setNewCollection(current => ({ ...current, nameEn: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-name-ar">Collection name (Arabic)</Label>
              <Input
                id="collection-name-ar"
                value={newCollection.nameAr}
                onChange={event => setNewCollection(current => ({ ...current, nameAr: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description-en">Description (English)</Label>
              <Textarea
                id="collection-description-en"
                rows={3}
                value={newCollection.descriptionEn}
                onChange={event => setNewCollection(current => ({ ...current, descriptionEn: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description-ar">Description (Arabic)</Label>
              <Textarea
                id="collection-description-ar"
                rows={3}
                value={newCollection.descriptionAr}
                onChange={event => setNewCollection(current => ({ ...current, descriptionAr: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-video-url">Launch video URL</Label>
              <Input
                id="collection-video-url"
                value={newCollection.videoUrl}
                onChange={event => setNewCollection(current => ({ ...current, videoUrl: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-cover-image">Cover image URL</Label>
              <Input
                id="collection-cover-image"
                value={newCollection.coverImage}
                onChange={event => setNewCollection(current => ({ ...current, coverImage: event.target.value }))}
              />
            </div>
            <Button type="submit" disabled={createCollectionMutation.isPending}>
              {createCollectionMutation.isPending ? "Creating..." : "Add collection"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Product Catalogue Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleProductUpdate} data-testid="product-update-form">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product-select">Select product</Label>
              <select
                id="product-select"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedProductId}
                onChange={event => setSelectedProductId(event.target.value)}
              >
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-price">Base price (AED)</Label>
              <Input
                id="product-price"
                value={productPrice}
                onChange={event => setProductPrice(event.target.value)}
                placeholder="180000"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-images">Gallery image URLs</Label>
              <Input
                id="product-images"
                value={productImages}
                onChange={event => setProductImages(event.target.value)}
                placeholder="https://cdn.example.com/image1.jpg,https://cdn.example.com/image2.jpg"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product-colors">Fabric colours</Label>
              <Textarea
                id="product-colors"
                rows={3}
                value={productColors}
                onChange={event => setProductColors(event.target.value)}
                placeholder="#D4AF37 Royal Gold,#1F3B4D Midnight Indigo"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={updateProductDetailsMutation.isPending}>
                {updateProductDetailsMutation.isPending ? "Saving..." : "Save product details"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardContentStudio;
