import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Products() {
  const { data: products, isLoading } = trpc.products.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-20">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Our Collection
              <span className="block text-3xl md:text-4xl text-muted-foreground mt-2" lang="ar">
                مجموعتنا
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover handcrafted luxury pieces that blend tradition with contemporary elegance
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
                    alt={product.nameEn}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick View Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="w-full bg-white text-foreground hover:bg-white/90">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {product.nameEn}
                    </h3>
                    <p className="text-sm text-muted-foreground" lang="ar">
                      {product.nameAr}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.descriptionEn}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-2xl font-bold text-primary">
                      {(product.basePrice / 100).toFixed(0)} AED
                    </div>
                    <div className="flex gap-1">
                      {product.availableColors.slice(0, 3).map((color: any, idx: number) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                      {product.availableColors.length > 3 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm bg-muted flex items-center justify-center text-xs">
                          +{product.availableColors.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

