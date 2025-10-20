import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const productImages = [
  "/IMG_7266.jpeg",
  "/IMG_7265.jpeg",
  "/IMG_7262.jpeg",
  "/IMG_7263.jpeg",
  "/IMG_7264.jpeg",
  "/IMG_7261.jpeg",
  "/1000009309.jpg",
  "/1000009310.jpg",
  "/1000009311.jpg",
  "/1000009331.jpg",
  "/1000009332.jpg",
  "/1000009333.jpg",
];

// Add videos
const productVideos = [
  "/1000009328.mp4",
  "/1000009329.mp4",
  "/1000009330.mp4",
];

export default function Home() {
  const { t, isRTL } = useLanguage();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // Combine images and videos
  const allMedia = [
    ...productImages.map(img => ({ type: 'image', src: img })),
    ...productVideos.map(vid => ({ type: 'video', src: vid })),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
        setIsVisible(true);
      }, 500);
    }, 5000); // 5 seconds per media

    return () => clearInterval(interval);
  }, [allMedia.length]);

  return (
    <div className="min-h-screen relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Animated Background Slideshow with Videos */}
      <div className="fixed inset-0 z-0">
        {allMedia.map((media, idx) => (
          <div
            key={`${media.type}-${idx}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentMediaIndex && isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {media.type === 'image' ? (
              <img
                src={media.src}
                alt="La Kbira Collection"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={media.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
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
            {isRTL ? (
              <>لا كبيرة <span className="text-lg font-light">| La Kbira</span></>
            ) : (
              <>La Kbira <span className="text-lg font-light">| لا كبيرة</span></>
            )}
          </h1>
        </div>
        <div className="flex gap-6 items-center">
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center">
        <div className="max-w-4xl space-y-8 animate-fade-in">
          {/* Title */}
          <h2 
            className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl leading-tight"
            lang={isRTL ? 'ar' : 'en'}
          >
            {t('hero.title')}
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
            {t('hero.subtitle')}
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="w-16 h-[2px] bg-primary/60" />
            <Sparkles className="w-6 h-6 text-primary" />
            <div className="w-16 h-[2px] bg-primary/60" />
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/products">
              <Button 
                size="lg" 
                className="btn-luxury text-lg px-8 py-6 w-full sm:w-auto"
              >
                {t('hero.cta.join')}
              </Button>
            </Link>
            <Link href="/products">
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-full sm:w-auto"
              >
                {t('hero.cta.explore')}
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>{t('hero.badge.dubai')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>{t('hero.badge.excellence')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>{t('hero.badge.limited')}</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </div>

      {/* Why La Kbira Section */}
      <div className="relative z-10 bg-background py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('why.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('why.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Exclusive Designs */}
            <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t('why.exclusive.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('why.exclusive.desc')}
              </p>
            </div>

            {/* Custom Tailoring */}
            <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t('why.custom.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('why.custom.desc')}
              </p>
            </div>

            {/* Waiting List Access */}
            <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t('why.waiting.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('why.waiting.desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

