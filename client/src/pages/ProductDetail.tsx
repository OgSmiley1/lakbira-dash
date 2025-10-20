import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id || "";
  
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl text-muted-foreground">Product not found</p>
          <Link href="/products">
            <Button>Back to Collection</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Set default color if not selected
  if (!selectedColor && Array.isArray(product.availableColors) && product.availableColors.length > 0) {
    setSelectedColor(product.availableColors[0]);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-6">
        <Link href="/products">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Button>
        </Link>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Color Overlay */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <img
                src={Array.isArray(product.images) ? product.images[currentImageIndex] : ''}
                alt={product.nameEn}
                className="w-full h-full object-cover"
              />
              
              {/* Color Tint Overlay for Live Preview */}
              {selectedColor && (
                <div 
                  className="absolute inset-0 mix-blend-color opacity-30 pointer-events-none"
                  style={{ backgroundColor: selectedColor.hex }}
                />
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Array.isArray(product.images) && product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-foreground">
                    {product.nameEn}
                  </h1>
                  <p className="text-2xl text-muted-foreground" lang="ar">
                    {product.nameAr}
                  </p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Limited Edition
                </Badge>
              </div>

              <div className="text-4xl font-bold text-primary">
                {(product.basePrice / 100).toFixed(0)} AED
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.descriptionEn}
              </p>

              {product.storyEn && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm text-foreground/80 italic">
                      {product.storyEn}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Select Color
                  <span className="text-sm font-normal text-muted-foreground ml-2" lang="ar">
                    اختر اللون
                  </span>
                </h3>
                {selectedColor && (
                  <span className="text-sm text-muted-foreground">
                    {selectedColor.name} • {selectedColor.nameAr}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                {Array.isArray(product.availableColors) && product.availableColors.map((color: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`group relative w-16 h-16 rounded-full border-4 transition-all ${
                      selectedColor?.hex === color.hex
                        ? 'border-primary scale-110'
                        : 'border-white hover:border-primary/50 hover:scale-105'
                    } shadow-lg`}
                    title={`${color.name} - ${color.nameAr}`}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    {selectedColor?.hex === color.hex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Select Size
                <span className="text-sm font-normal text-muted-foreground ml-2" lang="ar">
                  اختر المقاس
                </span>
              </h3>
              
              <div className="grid grid-cols-5 gap-3">
                {Array.isArray(product.availableSizes) && product.availableSizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Info */}
            {product.fabricEn && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Fabric</h3>
                <p className="text-muted-foreground">
                  {product.fabricEn}
                  {product.fabricAr && (
                    <span className="mx-2">•</span>
                  )}
                  <span lang="ar">{product.fabricAr}</span>
                </p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              <Link href={`/order/${product.id}`}>
                <Button 
                  size="lg" 
                  className="w-full btn-luxury text-lg py-6"
                  disabled={!selectedColor || !selectedSize}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Join Waiting List
                  <span className="mx-2">•</span>
                  انضم إلى قائمة الانتظار
                </Button>
              </Link>
              
              <p className="text-center text-sm text-muted-foreground">
                Limited availability • Custom tailoring available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

