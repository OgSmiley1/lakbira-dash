import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive translations
const translations = {
  ar: {
    // Header
    'app.title': 'لا كبيرة',
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.about': 'من نحن',
    'nav.contact': 'تواصل معنا',
    'nav.dashboard': 'لوحة التحكم',
    
    // Homepage Hero
    'hero.title': 'مجموعة رمضان',
    'hero.subtitle': 'Ramadan Eid Collection 2024',
    'hero.description': 'قفاطين وجلابيات فاخرة مصنوعة يدوياً، تمزج التراث المغربي الأصيل مع الأناقة العصرية. كل قطعة تحكي قصة من التقاليد والحرفية والجمال الخالد.',
    'hero.cta.join': 'انضم إلى قائمة الانتظار',
    'hero.cta.explore': 'استكشف المجموعة',
    'hero.badge.dubai': 'مرخص من دبي',
    'hero.badge.excellence': 'حرفية متقنة',
    'hero.badge.limited': 'إصدار محدود',
    
    // Why La Kbira
    'why.title': 'لماذا لا كبيرة؟',
    'why.subtitle': 'استمتعي بأزياء فاخرة تحترم التقاليد وتعانق الحداثة',
    'why.exclusive.title': 'تصاميم حصرية',
    'why.exclusive.desc': 'كل قفطان تحفة فنية فريدة، تتميز بتطريز مغربي معقد وأقمشة فاخرة',
    'why.custom.title': 'تفصيل مخصص',
    'why.custom.desc': 'قياسات شخصية وخيارات ألوان لضمان المقاس المثالي لمناسبتك الخاصة',
    'why.waiting.title': 'الوصول لقائمة الانتظار',
    'why.waiting.desc': 'انضمي لسجلنا الحصري للحصول على أولوية الوصول للمجموعات الجديدة والعروض الخاصة',
    
    // Products
    'products.title': 'مجموعتنا الفاخرة',
    'products.subtitle': 'قفاطين وجلابيات مصنوعة يدوياً بحب وإتقان',
    'products.view': 'عرض التفاصيل',
    'products.colors': 'ألوان متاحة',
    'products.sizes': 'مقاسات متاحة',
    
    // Product Detail
    'product.limited': 'إصدار محدود',
    'product.price': 'درهم',
    'product.colors': 'اختاري اللون',
    'product.sizes': 'اختاري المقاس',
    'product.fabric': 'القماش والتفاصيل',
    'product.join': 'انضم إلى قائمة الانتظار',
    'product.back': 'العودة للمجموعة',
    'product.custom': 'مقاس مخصص',
    'product.availability': 'توفر محدود • تفصيل مخصص متاح',
    
    // Order Form
    'order.title': 'نموذج الطلب',
    'order.subtitle': 'املئي التفاصيل للانضمام لقائمة الانتظار',
    'order.personal': 'المعلومات الشخصية',
    'order.name': 'الاسم الكامل',
    'order.email': 'البريد الإلكتروني',
    'order.phone': 'رقم الهاتف',
    'order.whatsapp': 'رقم الواتساب',
    'order.shipping': 'معلومات الشحن',
    'order.city': 'المدينة',
    'order.address': 'العنوان الكامل',
    'order.country': 'الدولة',
    'order.product': 'تفاصيل المنتج',
    'order.color': 'اللون المختار',
    'order.size': 'المقاس',
    'order.measurements': 'القياسات المخصصة (اختياري)',
    'order.height': 'الطول (سم)',
    'order.bust': 'الصدر (سم)',
    'order.waist': 'الخصر (سم)',
    'order.hips': 'الأرداف (سم)',
    'order.shoulders': 'الأكتاف (سم)',
    'order.arm': 'طول الذراع (سم)',
    'order.notes': 'ملاحظات خاصة',
    'order.pricing': 'التسعير',
    'order.base': 'السعر الأساسي',
    'order.custom.fee': 'رسوم التفصيل المخصص',
    'order.total': 'الإجمالي',
    'order.submit': 'إرسال الطلب',
    'order.success': 'تم إرسال طلبك بنجاح!',
    'order.error': 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.subtitle': 'إدارة ومراجعة جميع طلبات العملاء',
    'dashboard.total': 'إجمالي الطلبات',
    'dashboard.pending': 'قيد الانتظار',
    'dashboard.approved': 'معتمدة',
    'dashboard.rejected': 'مرفوضة',
    'dashboard.all': 'جميع الطلبات',
    'dashboard.no.orders': 'لا توجد طلبات بعد',
    'dashboard.order': 'الطلب',
    'dashboard.customer': 'العميل',
    'dashboard.product': 'المنتج',
    'dashboard.status': 'الحالة',
    'dashboard.actions': 'الإجراءات',
    'dashboard.view': 'عرض',
    'dashboard.approve': 'موافقة',
    'dashboard.reject': 'رفض',
    'dashboard.notes': 'ملاحظات الإدارة',
    'dashboard.reason': 'سبب الرفض',
    
    // Common
    'common.loading': 'جارٍ التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'نجح!',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
  },
  en: {
    // Header
    'app.title': 'La Kbira',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Dashboard',
    
    // Homepage Hero
    'hero.title': 'Ramadan Collection',
    'hero.subtitle': 'Ramadan Eid Collection 2024',
    'hero.description': 'Handcrafted luxury kaftans and abayas, blending Moroccan heritage with contemporary elegance. Each piece tells a story of tradition, craftsmanship, and timeless beauty.',
    'hero.cta.join': 'Join Waiting List',
    'hero.cta.explore': 'Explore Collection',
    'hero.badge.dubai': 'Licensed from Dubai',
    'hero.badge.excellence': 'Handcrafted Excellence',
    'hero.badge.limited': 'Limited Edition',
    
    // Why La Kbira
    'why.title': 'Why La Kbira?',
    'why.subtitle': 'Experience luxury fashion that honors tradition while embracing modernity',
    'why.exclusive.title': 'Exclusive Designs',
    'why.exclusive.desc': 'Each kaftan is a unique masterpiece, featuring intricate Moroccan embroidery and premium fabrics',
    'why.custom.title': 'Custom Tailoring',
    'why.custom.desc': 'Personalized measurements and color choices to ensure the perfect fit for your special occasion',
    'why.waiting.title': 'Waiting List Access',
    'why.waiting.desc': 'Join our exclusive registry for priority access to new collections and special offers',
    
    // Products
    'products.title': 'Our Luxury Collection',
    'products.subtitle': 'Handcrafted kaftans and abayas made with love and precision',
    'products.view': 'View Details',
    'products.colors': 'Available Colors',
    'products.sizes': 'Available Sizes',
    
    // Product Detail
    'product.limited': 'Limited Edition',
    'product.price': 'AED',
    'product.colors': 'Choose Color',
    'product.sizes': 'Choose Size',
    'product.fabric': 'Fabric & Details',
    'product.join': 'Join Waiting List',
    'product.back': 'Back to Collection',
    'product.custom': 'Custom Size',
    'product.availability': 'Limited availability • Custom tailoring available',
    
    // Order Form
    'order.title': 'Order Form',
    'order.subtitle': 'Fill in the details to join our waiting list',
    'order.personal': 'Personal Information',
    'order.name': 'Full Name',
    'order.email': 'Email Address',
    'order.phone': 'Phone Number',
    'order.whatsapp': 'WhatsApp Number',
    'order.shipping': 'Shipping Information',
    'order.city': 'City',
    'order.address': 'Full Address',
    'order.country': 'Country',
    'order.product': 'Product Details',
    'order.color': 'Selected Color',
    'order.size': 'Size',
    'order.measurements': 'Custom Measurements (Optional)',
    'order.height': 'Height (cm)',
    'order.bust': 'Bust (cm)',
    'order.waist': 'Waist (cm)',
    'order.hips': 'Hips (cm)',
    'order.shoulders': 'Shoulders (cm)',
    'order.arm': 'Arm Length (cm)',
    'order.notes': 'Special Notes',
    'order.pricing': 'Pricing',
    'order.base': 'Base Price',
    'order.custom.fee': 'Custom Tailoring Fee',
    'order.total': 'Total',
    'order.submit': 'Submit Order',
    'order.success': 'Your order has been submitted successfully!',
    'order.error': 'An error occurred. Please try again.',
    
    // Dashboard
    'dashboard.title': 'Orders Dashboard',
    'dashboard.subtitle': 'Manage and review all customer orders',
    'dashboard.total': 'Total Orders',
    'dashboard.pending': 'Pending',
    'dashboard.approved': 'Approved',
    'dashboard.rejected': 'Rejected',
    'dashboard.all': 'All Orders',
    'dashboard.no.orders': 'No orders yet',
    'dashboard.order': 'Order',
    'dashboard.customer': 'Customer',
    'dashboard.product': 'Product',
    'dashboard.status': 'Status',
    'dashboard.actions': 'Actions',
    'dashboard.view': 'View',
    'dashboard.approve': 'Approve',
    'dashboard.reject': 'Reject',
    'dashboard.notes': 'Admin Notes',
    'dashboard.reason': 'Rejection Reason',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage or default to Arabic
    const saved = localStorage.getItem('language');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('language', language);
    
    // Update document direction and lang attribute
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

