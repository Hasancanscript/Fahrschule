CREATE TABLE "InvoicePayment" (
 "id" TEXT NOT NULL, "invoiceId" TEXT NOT NULL, "requestId" TEXT NOT NULL,
 "kind" TEXT NOT NULL, "amountCents" INTEGER NOT NULL, "occurredAt" TIMESTAMP(3) NOT NULL,
 "paymentMethod" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "InvoicePayment_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "InvoicePayment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "InvoicePayment_positive_amount" CHECK ("amountCents" > 0),
 CONSTRAINT "InvoicePayment_kind" CHECK ("kind" IN ('PAYMENT', 'REFUND'))
);
CREATE UNIQUE INDEX "InvoicePayment_requestId_key" ON "InvoicePayment"("requestId");
CREATE INDEX "InvoicePayment_invoiceId_occurredAt_idx" ON "InvoicePayment"("invoiceId", "occurredAt");
-- Preserve previously confirmed payments/refunds exactly; never infer a payment from the invoice price alone.
INSERT INTO "InvoicePayment" ("id", "invoiceId", "requestId", "kind", "amountCents", "occurredAt", "paymentMethod")
SELECT 'legacy-payment-' || "id", "id", 'migration-paid-' || "id", 'PAYMENT', "amountCents", "paidAt", COALESCE("paymentMethod", 'Andere') FROM "Invoice" WHERE "paidAt" IS NOT NULL AND "amountCents" > 0;
INSERT INTO "InvoicePayment" ("id", "invoiceId", "requestId", "kind", "amountCents", "occurredAt", "paymentMethod")
SELECT 'legacy-refund-' || "id", "id", 'migration-refund-' || "id", 'REFUND', "amountCents", "refundedAt", COALESCE("paymentMethod", 'Andere') FROM "Invoice" WHERE "refundedAt" IS NOT NULL AND "amountCents" > 0;
