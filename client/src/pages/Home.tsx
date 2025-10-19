import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import { Link } from "wouter";

const productImages = [
  "/IMG_7266.jpeg",
  "/IMG_7265.jpeg",
  "/IMG_7262.jpeg",
  "/IMG_7263.jpeg",
  "/IMG_7264.jpeg",
  "/IMG_7261.jpeg",
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Slideshow */}
      <div className="fixed inset-0 z-0">
        {productImages.map((img, idx) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentImageIndex && isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt="La Kbira Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>
        ))}
        
        {/* Moroccan Pattern Overlay */}
        <div className="absolute inset-0 moroccan-pattern opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-white tracking-wider">
            La Kbira <span className="text-lg font-light">| لا كبيرة</span>
          </h1>
        </div>
        <div className="flex gap-6 items-center">
          <button className="text-white hover:text-primary transition-colors text-sm font-medium">
            English
          </button>
          <button className="text-white/80 hover:text-primary transition-colors text-sm font-medium">
            العربية
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center">
        <div className="max-w-4xl space-y-8 animate-fade-in">
          {/* Arabic Title */}
          <h2 
            className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl leading-tight"
            lang="ar"
          >
            مجموعة رمضان
          </h2>
          
          {/* English Subtitle */}
          <p className="text-3xl md:text-5xl text-white/90 font-light tracking-wide">
            Ramadan Eid Collection 2024
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary" />
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary" />
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Handcrafted luxury kaftans and abayas, blending Moroccan heritage with contemporary elegance.
            Each piece tells a story of tradition, craftsmanship, and timeless beauty.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="btn-luxury bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-2xl"
            >
              انضم إلى قائمة الانتظار
              <span className="mx-2">•</span>
              Join Waiting List
            </Button>
            <Link href="/products">
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-luxury border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
              >
                استكشف المجموعة
                <span className="mx-2">•</span>
                Explore Collection
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-12 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Licensed from Dubai</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Handcrafted Excellence</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Limited Edition</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </div>

      {/* Featured Section Preview */}
      <div className="relative z-10 bg-gradient-to-b from-transparent to-background py-20">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-foreground">
              Why La Kbira?
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience luxury fashion that honors tradition while embracing modernity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Exclusive Designs</h4>
              <p className="text-muted-foreground">
                Each kaftan is a unique masterpiece, featuring intricate Moroccan embroidery and premium fabrics
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Custom Tailoring</h4>
              <p className="text-muted-foreground">
                Personalized measurements and color choices to ensure the perfect fit for your special occasion
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Waiting List Access</h4>
              <p className="text-muted-foreground">
                Join our exclusive registry for priority access to new collections and special offers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

