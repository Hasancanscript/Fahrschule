import nodemailer from "nodemailer";
import { prisma } from "./prisma";
import { createGiftPdf } from "./gift-pdf";
import { giftText, money, methodLabel } from "./gift-shared";
export function giftMailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.SMTP_FROM &&
      process.env.GIFT_ADMIN_EMAIL,
  );
}
export async function sendGiftMails(orderId?: string) {
  if (!giftMailConfigured()) return { sent: 0, pending: true };
  const port = Number(process.env.SMTP_PORT || 465);
  if (![465, 587].includes(port))
    throw new Error(
      "SMTP benötigt TLS auf Port 465 oder STARTTLS auf Port 587.",
    );
  const transport = nodemailer.createTransport({
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
  const rows = await prisma.giftMail.findMany({
    where: {
      ...(orderId ? { orderId } : {}),
      OR: [
        { status: { in: ["PENDING", "FAILED"] } },
        { status: "SENDING", updatedAt: { lt: new Date(Date.now() - 300000) } },
      ],
    },
    include: { order: { include: { vouchers: true } } },
    orderBy: { createdAt: "asc" },
    take: 30,
  });
  let sent = 0;
  for (const mail of rows) {
    const claimed = await prisma.giftMail.updateMany({
      where: { id: mail.id, updatedAt: mail.updatedAt, status: mail.status },
      data: { status: "SENDING", attempts: { increment: 1 } },
    });
    if (!claimed.count) continue;
    try {
      const o = mail.order,
        admin = mail.kind === "ADMIN",
        paid = mail.kind === "VOUCHERS";
      if (paid && o.status !== "PAID")
        throw new Error("Bestellung ist nicht bezahlt.");
      const l = admin ? "de" : o.lang;
      const t = (de: string, fr: string) => giftText(l, de, fr);
      const lines = [
        "Fahrschule fürs Leben",
        t(`Bestellnummer: ${o.number}`, `Numéro de commande: ${o.number}`),
        `${o.firstName} ${o.lastName}`,
        o.email,
        o.phone,
        "",
        ...o.vouchers.map(
          (v) =>
            `${money(v.amountCents)} · ${v.recipient}${v.message ? `\n${v.message}` : ""}`,
        ),
        "",
        `${t("Gesamtbetrag", "Montant total")}: ${money(o.totalCents)}`,
        `${t("Zahlungsart", "Mode de paiement")}: ${methodLabel(o.paidMethod || o.requestedMethod, l)}`,
        paid
          ? t(
              "Die Zahlung wurde bestätigt. Deine aktivierten Gutscheine findest du im Anhang.",
              "Le paiement a été confirmé. Tes bons activés sont joints à ce message.",
            )
          : t(
              "Deine Bestellung wurde erfolgreich gespeichert. Wir kontaktieren dich, um die Bezahlung vor Ort in bar oder mit TWINT zu vereinbaren. Nach bestätigter Bezahlung wird dein Gutschein aktiviert und ausgestellt.",
              "Ta commande a bien été enregistrée. Nous te contacterons pour convenir du paiement sur place, en espèces ou avec TWINT. Après confirmation du paiement, ton bon est activé et établi.",
            ),
        t(
          "Bei Fragen erreichst du Hüseyin unter",
          "Pour toute question, tu peux joindre Hüseyin au",
        ),
        "078 777 81 61",
        "info@fahrschulefuersleben.ch",
        "Aegertenstrasse 28, 2503 Biel/Bienne",
        t(
          "Gutscheinbedingungen: Kein zusätzliches Verfallsdatum. Es gelten die gesetzlichen Verjährungsfristen. Teilbeträge können eingelöst werden. Eine Barauszahlung ist ausgeschlossen, vorbehaltlich zwingender gesetzlicher Ansprüche.",
          "Conditions des bons: Aucune date d’expiration supplémentaire. Les délais légaux de prescription s’appliquent. Une utilisation partielle est possible. Aucun remboursement en espèces, sous réserve des droits impératifs.",
        ),
      ];
      await transport.sendMail({
        from: process.env.SMTP_FROM,
        to: admin ? process.env.GIFT_ADMIN_EMAIL : o.email,
        replyTo: "info@fahrschulefuersleben.ch",
        messageId: `<gift-${mail.id}@fahrschulefuersleben.ch>`,
        subject: `${t(admin ? "Neue Gutscheinbestellung" : paid ? "Deine Gutscheine" : "Bestätigung deiner Gutscheinbestellung", paid ? "Tes bons cadeaux" : "Confirmation de ta commande de bons")}: ${o.number}`,
        text: lines.join("\n"),
        attachments: paid
          ? [
              {
                filename: `Gutscheine-${o.number}.pdf`,
                content: Buffer.from(await createGiftPdf(o.vouchers, o.lang)),
                contentType: "application/pdf",
              },
            ]
          : [],
      });
      await prisma.$transaction([
        prisma.giftMail.update({
          where: { id: mail.id },
          data: { status: "SENT", sentAt: new Date(), lastError: null },
        }),
        prisma.giftEvent.create({
          data: {
            orderId: o.id,
            kind: "MAIL_SENT",
            detail: { kind: mail.kind },
          },
        }),
      ]);
      sent++;
    } catch {
      await prisma.giftMail.update({
        where: { id: mail.id },
        data: {
          status: "FAILED",
          lastError:
            "SMTP-Versand fehlgeschlagen. Konfiguration und Postfach prüfen.",
        },
      });
    }
  }
  transport.close();
  return { sent, pending: false };
}
