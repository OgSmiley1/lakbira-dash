import { useState } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id || "";
  const { t, isRTL, language } = useLanguage();
  
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center space-y-4">
          <p className="text-2xl text-muted-foreground">
            {language === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
          </p>
          <Link href="/products">
            <Button>{t('product.back')}</Button>
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
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-wider">
              {isRTL ? 'لا كبيرة' : 'La Kbira'}
            </h1>
          </div>
        </Link>
        <LanguageSwitcher />
      </nav>

      {/* Back Button */}
      <div className="container mx-auto px-6 py-4">
        <Link href="/products">
          <Button variant="ghost" className="gap-2">
            {isRTL ? (
              <>
                {t('product.back')}
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                {t('product.back')}
              </>
            )}
          </Button>
        </Link>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Enhanced Color Transformation */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-2xl">
              <img
                src={Array.isArray(product.images) ? product.images[currentImageIndex] : ''}
                alt={language === 'ar' ? product.nameAr : product.nameEn}
                className="w-full h-full object-cover"
              />
              
              {/* Enhanced Color Transformation - affects fabric only */}
              {selectedColor && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: selectedColor.hex,
                    mixBlendMode: 'multiply',
                    opacity: 0.5
                  }}
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
                    currentImageIndex === idx ? 'border-primary shadow-lg' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${language === 'ar' ? 'عرض' : 'View'} ${idx + 1}`}
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
                    {language === 'ar' ? product.nameAr : product.nameEn}
                  </h1>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-1" />
                  {t('product.limited')}
                </Badge>
              </div>

              <div className="text-4xl font-bold text-primary">
                {(product.basePrice / 100).toFixed(0)} {t('product.price')}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {language === 'ar' ? product.descriptionAr : product.descriptionEn}
              </p>

              {(language === 'ar' ? product.storyAr : product.storyEn) && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm text-foreground/80 italic">
                      {language === 'ar' ? product.storyAr : product.storyEn}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Color Selection */}
            {Array.isArray(product.availableColors) && product.availableColors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('product.colors')}</h3>
                <div className="grid grid-cols-4 gap-3">
                  {product.availableColors.map((color: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`relative group`}
                    >
                      <div
                        className={`w-full aspect-square rounded-lg border-2 transition-all ${
                          selectedColor?.hex === color.hex
                            ? 'border-primary shadow-lg scale-110'
                            : 'border-border hover:border-primary/50'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      {selectedColor?.hex === color.hex && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                      )}
                      <p className="text-xs text-center mt-1 text-muted-foreground">
                        {language === 'ar' ? color.nameAr : color.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {Array.isArray(product.availableSizes) && product.availableSizes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('product.sizes')}</h3>
                <div className="grid grid-cols-5 gap-3">
                  {product.availableSizes.map((size: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
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
            )}

            {/* Fabric Details */}
            {(product.fabricEn || product.fabricAr) && (
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-semibold">{t('product.fabric')}</h3>
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-2">
                      {language === 'ar' ? 'تفاصيل القماش' : 'Fabric Details'}
                    </p>
                    <p className="font-medium">
                      {language === 'ar' ? product.fabricAr : product.fabricEn}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA Button */}
            <div className="space-y-4">
              <Link href={`/order?product=${product.id}&color=${selectedColor?.hex || ''}&size=${selectedSize}`}>
                <Button size="lg" className="w-full text-lg py-6 btn-luxury">
                  <Sparkles className={isRTL ? "w-5 h-5 ml-2" : "w-5 h-5 mr-2"} />
                  {t('product.join')}
                </Button>
              </Link>
              <p className="text-sm text-center text-muted-foreground">
                {t('product.availability')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

