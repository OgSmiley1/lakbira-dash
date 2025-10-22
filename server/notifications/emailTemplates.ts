export type SupportedLocale = "en" | "ar";

interface ConfirmationTemplateOptions {
  clientName: string;
  reference: string;
  locale: SupportedLocale;
}

interface ConfirmationTemplate {
  subject: string;
  body: string;
}

/**
 * Returns localized copy for the waiting list confirmation email.
 */
export function buildOrderConfirmationEmail({ clientName, reference, locale }: ConfirmationTemplateOptions): ConfirmationTemplate {
  if (locale === "ar") {
    return {
      subject: "لاكبيرة - تم استلام طلبك",
      body: [
        `مرحباً ${clientName},`,
        "نؤكد انضمامك إلى قائمة الانتظار الخاصة بلاكبيرة.",
        `رقم الطلب: ${reference}.`,
        "سنقوم بالتواصل معك خلال 48 ساعة لتأكيد التفاصيل.",
        "مع خالص التحية،", 
        "فريق لاكبيرة",
      ].join("\n"),
    };
  }

  return {
    subject: "La Kbira - We've received your request",
    body: [
      `Hi ${clientName},`,
      "Thank you for joining the La Kbira waiting list.",
      `Your reference number is ${reference}.`,
      "Our team will reach out within 48 hours to confirm your details.",
      "Warm regards,", 
      "La Kbira Concierge",
    ].join("\n"),
  };
}

/**
 * Returns localized copy for general registration confirmation emails.
 */
export function buildRegistrationConfirmationEmail({ clientName, reference, locale }: ConfirmationTemplateOptions): ConfirmationTemplate {
  const baseLines = locale === "ar"
    ? [
      `أهلاً ${clientName},`,
      "تم تسجيلك بنجاح في لاكبيرة.",
      `رقم تسجيلك: ${reference}.`,
      "سنتواصل معك قريباً بخصوص الخطوات التالية.",
      "مع التقدير،", 
      "فريق لاكبيرة",
    ]
    : [
      `Hello ${clientName},`,
      "Your La Kbira registration is confirmed.",
      `Registration ID: ${reference}.`,
      "We'll reach out shortly with next steps.",
      "With appreciation,", 
      "The La Kbira Team",
    ];

  return {
    subject: locale === "ar" ? "لاكبيرة - تم تأكيد التسجيل" : "La Kbira - Registration confirmed",
    body: baseLines.join("\n"),
  };
}
