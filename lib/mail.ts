import { Resend } from "resend";

// Ensure this is in your .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const isDev = process.env.NODE_ENV === "development";

  /**
   * SANDBOX LOGIC:
   * If we are in dev/unverified mode, Resend will throw an error if we
   * try to send to anyone except the owner. We override 'to' with our
   * registered Resend email.
   */
  const recipient = isDev ? process.env.RESEND_REGISTERED_EMAIL! : to;

  const finalSubject = isDev ? `[SANDBOX TEST] ${subject}` : subject;

  try {
    const data = await resend.emails.send({
      // Until verified, 'from' usually must be 'onboarding@resend.dev'
      from: isDev
        ? "Kurunzi Dev <onboarding@resend.dev>"
        : "Newsroom <system@kurunzi.com>",
      to: recipient,
      subject: finalSubject,
      html: isDev
        ? `<div style="background: #fef2f2; padding: 10px; border: 1px solid #fee2e2; margin-bottom: 20px;">
             <strong>Sandbox Mode:</strong> Original intended recipient: <code>${to}</code>
           </div>${html}`
        : html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Resend Error:", error);
    return { success: false, error };
  }
}
