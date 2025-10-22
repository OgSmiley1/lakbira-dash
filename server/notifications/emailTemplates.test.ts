import { describe, expect, it } from "vitest";
import { buildOrderConfirmationEmail, buildRegistrationConfirmationEmail } from "./emailTemplates";

describe("email confirmation templates", () => {
  it("produces English copy for orders", () => {
    const { subject, body } = buildOrderConfirmationEmail({
      clientName: "Sarah",
      reference: "LK123456",
      locale: "en",
    });

    expect(subject).toContain("La Kbira");
    expect(body).toContain("Sarah");
    expect(body).toContain("LK123456");
    expect(body).toContain("waiting list");
  });

  it("produces Arabic copy for orders", () => {
    const { subject, body } = buildOrderConfirmationEmail({
      clientName: "ليلى",
      reference: "LK654321",
      locale: "ar",
    });

    expect(subject).toContain("لاكبيرة");
    expect(body).toContain("ليلى");
    expect(body).toContain("LK654321");
    expect(body).toContain("قائمة الانتظار");
  });

  it("produces bilingual registration copy", () => {
    const { subject, body } = buildRegistrationConfirmationEmail({
      clientName: "Amina",
      reference: "REG-20250101-AAA11",
      locale: "en",
    });

    expect(subject).toContain("Registration confirmed");
    expect(body).toMatch(/REG-20250101-AAA11/);
    expect(body).toMatch(/Amina/);
    expect(body).toMatch(/La Kbira/);
  });
});
