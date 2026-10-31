import nodemailer from "nodemailer";

// E-Mail-Versand für Anfragen (Fahrstunde, VKU, Nothelferkurs, Gutscheine).
// Zugangsdaten stehen in .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
// und INBOX_EMAIL (dort kommen die Anfragen an).

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_FROM && process.env.INBOX_EMAIL);
}

function transport() {
  const port = Number(process.env.SMTP_PORT || 465);
  if (![465, 587].includes(port)) throw new Error("SMTP benötigt TLS auf Port 465 oder STARTTLS auf Port 587.");
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    tls: { rejectUnauthorized: true },
  });
}

type Mail = { subject: string; text: string; replyTo?: string };

/**
 * Schickt die Anfrage an die Fahrschule und eine Kopie an die Kundin / den Kunden.
 * Ohne SMTP-Zugang wird lokal (npm run dev) nur in die Konsole geschrieben.
 */
export async function sendInquiry(toSchool: Mail, toCustomer: Mail & { to: string }) {
  if (!mailConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[Anfrage, Testmodus ohne E-Mail]\n${toSchool.subject}\n\n${toSchool.text}`);
      return;
    }
    throw new Error("E-Mail-Versand ist nicht eingerichtet.");
  }
  const t = transport();
  const from = process.env.SMTP_FROM!;
  await t.sendMail({ from, to: process.env.INBOX_EMAIL, subject: toSchool.subject, text: toSchool.text, replyTo: toSchool.replyTo });
  // Die Kopie ist ein Extra: schlägt sie fehl, ist die Anfrage trotzdem angekommen.
  try {
    await t.sendMail({ from, to: toCustomer.to, subject: toCustomer.subject, text: toCustomer.text, replyTo: process.env.INBOX_EMAIL });
  } catch (error) {
    console.error("Kopie an Kunde/Kundin konnte nicht gesendet werden:", error);
  }
}
