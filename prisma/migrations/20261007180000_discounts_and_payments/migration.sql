ALTER TABLE "Service" ADD COLUMN "discountPercent" INTEGER NOT NULL DEFAULT 0,
 ADD COLUMN "publicKey" TEXT;
ALTER TABLE "Package" ADD COLUMN "discountPercent" INTEGER NOT NULL DEFAULT 0,
 ADD COLUMN "publicKey" TEXT, ADD COLUMN "description" TEXT;
CREATE UNIQUE INDEX "Service_publicKey_key" ON "Service"("publicKey");
CREATE UNIQUE INDEX "Package_publicKey_key" ON "Package"("publicKey");
ALTER TABLE "Service" ADD CONSTRAINT "Service_discount_range" CHECK ("discountPercent" BETWEEN 0 AND 100);
ALTER TABLE "Package" ADD CONSTRAINT "Package_discount_range" CHECK ("discountPercent" BETWEEN 0 AND 100);
UPDATE "Service" SET "publicKey" = 'single' WHERE "id" = (SELECT "id" FROM "Service" WHERE lower("name") IN ('fahrstunde', 'fahrstunde automatik') ORDER BY "createdAt", "id" LIMIT 1);
UPDATE "Service" SET "publicKey" = 'vku' WHERE "id" = (SELECT "id" FROM "Service" WHERE lower("name") = 'vku' ORDER BY "createdAt", "id" LIMIT 1);
UPDATE "Service" SET "publicKey" = 'firstaid' WHERE "id" = (SELECT "id" FROM "Service" WHERE lower("name") = 'nothelferkurs' ORDER BY "createdAt", "id" LIMIT 1);
UPDATE "Package" SET "publicKey" = 'pack5' WHERE "id" = (SELECT "id" FROM "Package" WHERE lower("name") = '5er-abo' ORDER BY "createdAt", "id" LIMIT 1);
CREATE TABLE "Invoice" (
 "id" TEXT NOT NULL, "source" TEXT NOT NULL, "sourceId" TEXT NOT NULL,
 "description" TEXT NOT NULL, "customerName" TEXT NOT NULL, "customerEmail" TEXT NOT NULL,
 "baseCents" INTEGER, "discountPercent" INTEGER NOT NULL DEFAULT 0, "amountCents" INTEGER,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "paidAt" TIMESTAMP(3),
 "paymentMethod" TEXT, "refundedAt" TIMESTAMP(3), "cancelledAt" TIMESTAMP(3),
 CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "Invoice_amount_range" CHECK ("amountCents" IS NULL OR "amountCents" >= 0),
 CONSTRAINT "Invoice_discount_range" CHECK ("discountPercent" BETWEEN 0 AND 100),
 CONSTRAINT "Invoice_paid_amount" CHECK ("paidAt" IS NULL OR "amountCents" IS NOT NULL),
 CONSTRAINT "Invoice_refund_payment" CHECK ("refundedAt" IS NULL OR "paidAt" IS NOT NULL)
);
CREATE UNIQUE INDEX "Invoice_source_sourceId_key" ON "Invoice"("source", "sourceId");
CREATE INDEX "Invoice_paidAt_idx" ON "Invoice"("paidAt");
CREATE INDEX "Invoice_createdAt_idx" ON "Invoice"("createdAt");
-- Old prices/payment dates were not recorded. Preserve them as unknown, never guess income.
INSERT INTO "Invoice" ("id", "source", "sourceId", "description", "customerName", "customerEmail", "createdAt", "cancelledAt")
SELECT 'legacy-booking-' || b."id", 'BOOKING', b."id", s."name", u."name", u."email", b."createdAt", CASE WHEN b."status" = 'CANCELLED' THEN b."updatedAt" END
FROM "Booking" b JOIN "Service" s ON s."id" = b."serviceId" JOIN "User" u ON u."id" = b."userId" WHERE b."userPackageId" IS NULL;
INSERT INTO "Invoice" ("id", "source", "sourceId", "description", "customerName", "customerEmail", "createdAt")
SELECT 'legacy-package-' || p."id", 'PACKAGE', p."id", a."name", u."name", u."email", p."purchasedAt"
FROM "UserPackage" p JOIN "Package" a ON a."id" = p."packageId" JOIN "User" u ON u."id" = p."userId";
INSERT INTO "Invoice" ("id", "source", "sourceId", "description", "customerName", "customerEmail", "createdAt", "cancelledAt")
SELECT 'legacy-course-' || b."id", 'COURSE', b."id", CASE WHEN d."type" = 'VKU' THEN 'VKU' ELSE 'Nothelferkurs' END, u."name", u."email", b."createdAt", CASE WHEN b."status" = 'CANCELLED' THEN b."createdAt" END
FROM "CourseBooking" b JOIN "CourseDate" d ON d."id" = b."courseDateId" JOIN "User" u ON u."id" = b."userId";
