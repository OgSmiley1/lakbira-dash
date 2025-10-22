import React, { useEffect, useState } from "react";
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

/**
 * Renders the La Kbira home page hero with responsive layout primitives so the
 * experience remains accessible across mobile, tablet, and desktop viewports.
 */
export default function Home(): React.JSX.Element {
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
    <div className="relative min-h-screen overflow-hidden">
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
      <nav className="relative z-20 container mx-auto flex flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-white tracking-wider">
            La Kbira <span className="text-lg font-light">| لا كبيرة</span>
          </h1>
        </div>
        <div className="flex flex-col gap-2 text-sm font-medium text-white sm:flex-row sm:items-center sm:gap-6">
          <button className="transition-colors hover:text-primary">
            English
          </button>
          <button className="text-white/80 transition-colors hover:text-primary">
            العربية
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="max-w-4xl space-y-8 animate-fade-in">
          {/* Arabic Title */}
          <h2
            className="text-4xl font-bold leading-tight text-white drop-shadow-2xl sm:text-6xl md:text-8xl"
            lang="ar"
          >
            مجموعة رمضان
          </h2>

          {/* English Subtitle */}
          <p className="text-2xl font-light tracking-wide text-white/90 sm:text-3xl md:text-5xl">
            Ramadan Eid Collection 2024
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary" />
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary" />
          </div>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
            Handcrafted luxury kaftans and abayas, blending Moroccan heritage with contemporary elegance.
            Each piece tells a story of tradition, craftsmanship, and timeless beauty.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
            <Button
              size="lg"
              className="btn-luxury w-full rounded-full bg-primary px-8 py-6 text-lg text-white shadow-2xl transition-colors hover:bg-primary/90 sm:w-auto"
            >
              انضم إلى قائمة الانتظار
              <span className="mx-2">•</span>
              Join Waiting List
            </Button>
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="btn-luxury w-full rounded-full border-2 border-white px-8 py-6 text-lg text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto"
              >
                استكشف المجموعة
                <span className="mx-2">•</span>
                Explore Collection
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 pt-12 text-sm text-white/70 sm:gap-8">
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
      <div className="relative z-10 bg-gradient-to-b from-transparent to-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 space-y-4 text-center">
            <h3 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              Why La Kbira?
            </h3>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              Experience luxury fashion that honors tradition while embracing modernity
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg transition-all backdrop-blur-sm hover:shadow-xl sm:p-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Exclusive Designs</h4>
              <p className="text-muted-foreground">
                Each kaftan is a unique masterpiece, featuring intricate Moroccan embroidery and premium fabrics
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg transition-all backdrop-blur-sm hover:shadow-xl sm:p-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Custom Tailoring</h4>
              <p className="text-muted-foreground">
                Personalized measurements and color choices to ensure the perfect fit for your special occasion
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg transition-all backdrop-blur-sm hover:shadow-xl sm:p-8">
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

