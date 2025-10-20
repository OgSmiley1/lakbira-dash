import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Products() {
  const { t, isRTL, language } = useLanguage();
  const { data: products, isLoading } = trpc.products.list.useQuery();

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
        <div className="flex gap-4 items-center">
          <LanguageSwitcher />
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              {t('nav.dashboard')}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-20">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              {t('products.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('products.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map((product: any) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={product.images[0]}
                    alt={language === 'ar' ? product.nameAr : product.nameEn}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Limited Edition Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {t('product.limited')}
                    </Badge>
                  </div>
                  
                  {/* Quick View Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="w-full bg-white text-foreground hover:bg-white/90">
                      {t('products.view')}
                      {isRTL ? (
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      ) : (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">
                      {language === 'ar' ? product.nameAr : product.nameEn}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {language === 'ar' ? product.descriptionAr : product.descriptionEn}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {(product.basePrice / 100).toFixed(0)} {t('product.price')}
                    </div>
                  </div>

                  {/* Available Colors Preview */}
                  {Array.isArray(product.availableColors) && product.availableColors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{t('products.colors')}:</p>
                      <div className="flex gap-2">
                        {product.availableColors.slice(0, 5).map((color: any, idx: number) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-border"
                            style={{ backgroundColor: color.hex }}
                            title={language === 'ar' ? color.nameAr : color.name}
                          />
                        ))}
                        {product.availableColors.length > 5 && (
                          <div className="w-6 h-6 rounded-full border-2 border-border bg-muted flex items-center justify-center text-xs">
                            +{product.availableColors.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Available Sizes */}
                  {Array.isArray(product.availableSizes) && product.availableSizes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{t('products.sizes')}:</p>
                      <div className="flex gap-2 flex-wrap">
                        {product.availableSizes.map((size: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {products?.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">
              {language === 'ar' ? 'لا توجد منتجات حالياً' : 'No products available'}
            </p>
          </div>
        )}
      </div>

      {/* Back to Home */}
      <div className="container mx-auto px-6 pb-12">
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              {isRTL ? (
                <ArrowRight className="w-4 h-4 ml-2" />
              ) : (
                <ArrowLeft className="w-4 h-4 mr-2" />
              )}
              {t('common.back')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

