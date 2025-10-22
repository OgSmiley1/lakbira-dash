import nodemailer from "nodemailer";
import { ENV } from "../_core/env";

export interface MailOptions {
  to: string;
  subject: string;
  body: string;
}

let transporter: nodemailer.Transporter | null = null;

/**
 * Lazily creates a nodemailer transporter using SMTP credentials from the environment.
 */
function getTransporter(): nodemailer.Transporter | null {
  if (transporter) {
    return transporter;
  }

  if (!ENV.smtpHost || !ENV.smtpUser || !ENV.smtpPassword) {
    console.warn("[Mailer] SMTP credentials missing, skipping email delivery.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: ENV.smtpHost,
    port: ENV.smtpPort || 587,
    secure: ENV.smtpPort === 465,
    auth: {
      user: ENV.smtpUser,
      pass: ENV.smtpPassword,
    },
  });

  return transporter;
}

/**
 * Sends an email using the configured SMTP transport. Fails silently when SMTP is not configured.
 */
export async function sendMail({ to, subject, body }: MailOptions): Promise<void> {
  const activeTransporter = getTransporter();
  if (!activeTransporter) {
    return;
  }

  try {
    await activeTransporter.sendMail({
      from: ENV.smtpFrom,
      to,
      subject,
      text: body,
    });
  } catch (error) {
    console.error("[Mailer] Failed to dispatch email", error);
  }
}
