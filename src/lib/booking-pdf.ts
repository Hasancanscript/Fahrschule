import { translateUi, type UiLanguage } from "@/lib/ui-translations";
import { PDFDocument, rgb, type PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { bookingDate, bookingRange, bookingStatus, type CustomerAccount, type CustomerBooking } from "@/lib/customer";
import { formatPrice } from "@/lib/pricing";
const green = rgb(0.04, 0.54, 0.23), ink = rgb(0.08, 0.1, 0.09), muted = rgb(0.36, 0.4, 0.38);
export async function createBookingPdf(user: CustomerAccount["user"], booking: CustomerBooking, lang: UiLanguage = "de") {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const fontFiles = ["noto-sans-latin-400-normal.woff", "noto-sans-latin-ext-400-normal.woff"];
  const fonts = await Promise.all(fontFiles.map(async name => doc.embedFont(await readFile(path.join(process.cwd(), "public", "fonts", name)), { subset: true })));
  const characterSets = fonts.map(font => new Set(font.getCharacterSet()));
  function glyph(character: string): { character: string; font: PDFFont } {
    const index = characterSets.findIndex(set => set.has(character.codePointAt(0)!));
    return { character: index === -1 ? "?" : character, font: fonts[Math.max(index, 0)] };
  }
  let page = doc.addPage([595.28, 841.89]);
  const logo = await doc.embedPng(await readFile(path.join(process.cwd(), "public", "logo.png")));
  let y = 730;
  function header() {
    page.drawImage(logo, { x: 55, y: 760, width: 58, height: 58 });
    page.drawText("FAHRSCHULE FÜRS LEBEN", { x: 128, y: 785, font: fonts[0], size: 12, color: green });
    page.drawLine({ start: { x: 55, y: 750 }, end: { x: 540, y: 750 }, color: rgb(0.86, 0.9, 0.87), thickness: 1 });
  }
  header();
  function text(value: string, size = 11, color = ink, translate = true) {
    if (translate) value = translateUi(value, lang);
    const lines: string[] = []; let line = "", width = 0;
    for (const character of value.replace(/\r/g, "")) {
      if (character === "\n") { lines.push(line); line = ""; width = 0; continue; }
      const item = glyph(character); const nextWidth = item.font.widthOfTextAtSize(item.character, size);
      if (width + nextWidth > 485) { lines.push(line); line = ""; width = 0; }
      line += character; width += nextWidth;
    }
    lines.push(line);
    for (const current of lines) {
      if (y < 70) { page = doc.addPage([595.28, 841.89]); y = 730; header(); }
      let x = 55; let run = ""; let activeFont: PDFFont | null = null;
      function flush() { if (activeFont && run) { page.drawText(run, { x, y, font: activeFont, size, color }); x += activeFont.widthOfTextAtSize(run, size); run = ""; } }
      for (const character of current) { const item = glyph(character); if (item.font !== activeFont) { flush(); activeFont = item.font; } run += item.character; }
      flush(); y -= size * 1.5;
    }
  }
  function field(label: string, value: string, translate = true) { text(label, 9, muted); text(value, 12, ink, translate); y -= 12; }
  text("Deine Buchungsübersicht", 25); y -= 12;
  text(booking.title, 17, green); y -= 18;
  page.drawLine({ start: { x: 55, y }, end: { x: 540, y }, color: rgb(0.86, 0.9, 0.87), thickness: 1 }); y -= 26;
  field("Gebucht für", `${user.name}\n${user.email}`, false);
  field("Datum", bookingDate(booking.startTime, lang));
  field("Uhrzeit · Schweizer Ortszeit", bookingRange(booking, lang));
  field("Ort / Treffpunkt", booking.location || "Bitte vereinbare den genauen Treffpunkt direkt mit dem Fahrlehrer.");
  field("Buchungsstatus", bookingStatus[booking.status] ?? booking.status);
  if (booking.packageName) field("Abrechnung", `Im Abo enthalten: ${booking.packageName}`);
  else {
    field("Vereinbarter Gesamtpreis", booking.payment.totalCents === null ? "Noch nicht erfasst: bitte bei der Fahrschule nachfragen." : formatPrice(booking.payment.totalCents));
    field("Zahlungsstand", `${booking.payment.status} · Bereits bezahlt: ${formatPrice(booking.payment.paidCents)}${booking.payment.remainingCents === null || booking.payment.remainingCents <= 0 ? "" : ` · Noch offen: ${formatPrice(booking.payment.remainingCents)}`}`);
  }
  if (booking.notes) field("Deine Anmerkungen", booking.notes, false);
  field("Buchungsnummer", booking.id);
  y -= 8; text("Fragen oder Terminänderung?", 12, green);
  text("078 777 81 61 · info@fahrschulefuersleben.ch", 10);
  y -= 12; text("Die Angaben entsprechen dem Stand beim Download. Eine ausstehende oder stornierte Buchung wird durch dieses PDF nicht bestätigt. Das Dokument ist eine Buchungsübersicht und keine Rechnung.", 9, muted);
  y -= 8; text(`Erstellt am ${bookingDate(new Date().toISOString(), lang)}`, 9, muted);
  doc.setTitle(translateUi(`Buchungsübersicht: ${translateUi(booking.title, lang)}`, lang)); doc.setAuthor("Fahrschule fürs Leben"); doc.setLanguage(lang === "fr" ? "fr-CH" : "de-CH");
  return doc.save();
}
