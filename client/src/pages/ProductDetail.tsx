import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, ArrowLeft, Star, Award, Gem, Crown, Heart } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id || "";
  
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <div className="text-center space-y-4">
          <Crown className="w-16 h-16 text-amber-600 animate-pulse mx-auto" />
          <p className="text-lg text-muted-foreground font-serif">Unveiling luxury...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl text-muted-foreground font-serif">Product not found</p>
          <Link href="/products">
            <Button className="bg-gradient-to-r from-amber-600 to-amber-700">
              Return to Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-rose-50/30">
      {/* Elegant Back Button */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <Link href="/products">
          <Button variant="ghost" className="gap-2 text-sm sm:text-base hover:bg-amber-100/50 transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-serif">Return to Collection</span>
          </Button>
        </Link>
      </div>

      {/* Luxury Product Showcase */}
      <div className="container mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
          
          {/* Premium Image Gallery */}
          <div className="space-y-6">
            {/* Main Image with Elegant Frame */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 via-rose-200 to-amber-200 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-700" />
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-amber-900/10">
                <img
                  src={Array.isArray(product.images) ? product.images[currentImageIndex] : ''}
                  alt={product.nameEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Luxury Badge Overlay */}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-none px-4 py-2 text-sm font-serif shadow-lg">
                    <Crown className="w-4 h-4 mr-2" />
                    Exclusive Design
                  </Badge>
                </div>

                {/* Wishlist Heart */}
                <button
                  onClick={() => setIsAddedToWishlist(!isAddedToWishlist)}
                  className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart 
                    className={`w-5 h-5 ${isAddedToWishlist ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`}
                  />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden transition-all ${
                      currentImageIndex === index
                        ? 'ring-2 ring-amber-600 shadow-lg scale-105'
                        : 'ring-1 ring-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Luxury Features */}
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif text-lg text-amber-900 flex items-center gap-2">
                  <Gem className="w-5 h-5" />
                  Artisan Craftsmanship
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p>Handcrafted by master artisans with decades of expertise</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p>Premium {product.fabricEn || 'chiffon'} fabric sourced from finest mills</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p>Intricate embellishments applied with meticulous attention</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p>10-day bespoke tailoring for perfect fit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Luxury Product Information */}
          <div className="space-y-8">
            {/* Title & Price */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                <span className="text-sm text-gray-600 ml-2">(Exclusive Collection)</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight">
                {product.nameEn}
              </h1>
              <p className="text-2xl sm:text-3xl font-serif text-amber-900 arabic-text" dir="rtl">
                {product.nameAr}
              </p>
              
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-serif text-amber-700">
                  {product.basePrice} <span className="text-3xl">AED</span>
                </p>
                <Badge variant="outline" className="border-amber-600 text-amber-700 px-3 py-1">
                  Tax Included
                </Badge>
              </div>
            </div>

            {/* Luxury Description */}
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed font-light text-lg">
                {product.descriptionEn}
              </p>
              <p className="text-gray-700 leading-relaxed font-light text-lg arabic-text" dir="rtl">
                {product.descriptionAr}
              </p>
            </div>

            {/* Heritage Story */}
            <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-white">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-serif text-lg text-rose-900 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Heritage & Inspiration
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Inspired by the timeless elegance of Moroccan royalty, this exquisite piece embodies 
                  centuries of textile artistry. Each stitch tells a story of tradition meeting contemporary 
                  sophistication, creating a masterpiece worthy of the most discerning connoisseur.
                </p>
                <p className="text-gray-700 leading-relaxed arabic-text" dir="rtl">
                  مستوحاة من الأناقة الخالدة للملكية المغربية، تجسد هذه القطعة الرائعة قروناً من فن النسيج. 
                  كل غرزة تحكي قصة التقاليد التي تلتقي بالرقي المعاصر.
                </p>
              </CardContent>
            </Card>

            {/* Size Selection */}
            {product.availableSizes && Array.isArray(product.availableSizes) && product.availableSizes.length > 0 && (
              <div className="space-y-4">
                <label className="text-lg font-serif text-gray-900">
                  Select Size <span className="text-sm text-gray-600 arabic-text" dir="rtl">اختر المقاس</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.availableSizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 px-6 rounded-lg font-serif text-lg transition-all ${
                        selectedSize === size
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bespoke Tailoring Notice */}
            <Card className="border-amber-300 bg-amber-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg text-amber-900">Bespoke Tailoring Service</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Each piece is meticulously tailored to your measurements over 10 days by our master craftsmen. 
                      After placing your order, our atelier will contact you to arrange a fitting consultation.
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed arabic-text" dir="rtl">
                      يتم تفصيل كل قطعة بدقة حسب مقاساتك خلال 10 أيام من قبل حرفيينا المتخصصين.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Button */}
            <div className="space-y-4">
              <Link href="/order">
                <Button 
                  size="lg"
                  className="w-full py-7 text-lg font-serif bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 hover:from-amber-700 hover:via-amber-800 hover:to-amber-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Order This Masterpiece
                </Button>
              </Link>
              
              <p className="text-center text-sm text-gray-600">
                ✨ Free consultation • 10-day tailoring • Complimentary alterations
              </p>
            </div>

            {/* Fabric & Care Details */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm font-serif text-gray-500 mb-1">Fabric</p>
                <p className="text-base text-gray-900">{product.fabricEn || 'Premium Chiffon'}</p>
              </div>
              <div>
                <p className="text-sm font-serif text-gray-500 mb-1">Length</p>
                <p className="text-base text-gray-900">58 inches</p>
              </div>
              <div>
                <p className="text-sm font-serif text-gray-500 mb-1">Care</p>
                <p className="text-base text-gray-900">Dry clean only</p>
              </div>
              <div>
                <p className="text-sm font-serif text-gray-500 mb-1">Origin</p>
                <p className="text-base text-gray-900">Handcrafted in Dubai</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

