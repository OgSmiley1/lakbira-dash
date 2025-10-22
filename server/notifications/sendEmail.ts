import { buildOrderConfirmationEmail, buildRegistrationConfirmationEmail, SupportedLocale } from "./emailTemplates";
import { sendMail } from "./mailer";

interface ConfirmationPayload {
  email: string | null | undefined;
  clientName: string;
  reference: string;
  locale: SupportedLocale;
}

/**
 * Dispatches the waiting list confirmation email when a new order is submitted.
 */
export async function sendOrderConfirmationEmail({ email, clientName, reference, locale }: ConfirmationPayload): Promise<void> {
  if (!email) {
    return;
  }

  const { subject, body } = buildOrderConfirmationEmail({ clientName, reference, locale });
  await sendMail({ to: email, subject, body });
}

/**
 * Dispatches the registration confirmation email when a prospect signs up.
 */
export async function sendRegistrationConfirmationEmail({ email, clientName, reference, locale }: ConfirmationPayload): Promise<void> {
  if (!email) {
    return;
  }

  const { subject, body } = buildRegistrationConfirmationEmail({ clientName, reference, locale });
  await sendMail({ to: email, subject, body });
}
