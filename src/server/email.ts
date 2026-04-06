import nodemailer from 'nodemailer';

const SMTP_FROM = process.env.SMTP_FROM || 'support@wedding30s.com';

let _transport: nodemailer.Transporter | null = null;

export function getTransport() {
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    });
  }
  return _transport;
}

export async function sendEmail(options: { to: string; subject: string; html: string; bcc?: string }) {
  try {
    await getTransport().sendMail({
      from: `"Wedding30s" <${SMTP_FROM}>`,
      to: options.to,
      bcc: options.bcc || undefined,
      subject: options.subject,
      html: options.html,
    });
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

export function wrapEmailTemplate(body: string) {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2C3E2D;">
      <div style="text-align: center; padding: 2rem 0 1rem;">
        <h1 style="font-size: 1.5rem; font-weight: 400; color: #7A8B5E;">Wedding30s</h1>
      </div>
      <div style="padding: 1.5rem; background: #FDFBF7; border-radius: 12px; border: 1px solid #e8e4de;">
        ${body}
      </div>
      <p style="text-align: center; margin-top: 1.5rem; color: #888; font-size: 0.8rem;">
        Wedding30s &mdash; Your wedding website, made simple.
      </p>
    </div>
  `;
}
