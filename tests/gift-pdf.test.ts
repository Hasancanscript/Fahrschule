import test from "node:test";
import assert from "node:assert/strict";
import { createGiftPdf } from "../src/lib/gift-pdf";
import { inflateSync } from "node:zlib";
import { PDFDocument, PDFName, PDFRawStream, PDFArray } from "pdf-lib";
test("unpaid gifts cannot generate PDFs; activated vouchers use individual white landscape pages", async () => {
  await assert.rejects(
    createGiftPdf([
      {
        recipient: "Test",
        amountCents: 10000,
        code: "GS-TEST",
        activatedAt: null,
      },
    ]),
  );
  const bytes = await createGiftPdf([
    {
      recipient: "Hüseyin Éléonore",
      message: "Liebe Grüsse und viel Freude beim Fahren!",
      amountCents: 10000,
      code: "GS-2026-0123456789ABCDEF0123456789ABCDEF",
      activatedAt: new Date("2026-10-08T12:00:00Z"),
    },
    {
      recipient: "Anna Beispiel",
      amountCents: 20000,
      code: "GS-2026-FEDCBA9876543210FEDCBA9876543210",
      activatedAt: new Date("2026-10-08T12:00:00Z"),
    },
  ]);
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getPageCount(), 2);
  assert.equal(pdf.getAuthor(), "Fahrschule fürs Leben");
  assert.equal(pdf.getTitle(), "Dein Gutschein · Fahrschule fürs Leben");
  for (const page of pdf.getPages()) {
    const contents = page.node.Contents()!;
    const stream = (contents instanceof PDFArray ? pdf.context.lookup(contents.get(0)) : contents) as PDFRawStream;
    const operations = inflateSync(stream.getContents()).toString();
    assert.match(operations, /1 1 1 rg/);
    assert.match(operations, /BT/);
    const images = page.node.Resources()!.lookup(PDFName.of("XObject"));
    assert.equal((images as import("pdf-lib").PDFDict).keys().length, 1, "only the logo is raster; lettering and layout are vectors");
  }
  assert.ok(pdf.getPages().every((p) => p.getWidth() > p.getHeight()));
});
