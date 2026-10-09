-- CreateEnum
CREATE TYPE "GiftOrderStatus" AS ENUM ('OPEN', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GiftMethod" AS ENUM ('CASH', 'TWINT');

-- CreateEnum
CREATE TYPE "GiftStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'REDEEMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "GiftSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "minCents" INTEGER NOT NULL DEFAULT 5000,
    "maxCents" INTEGER NOT NULL DEFAULT 100000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftOrder" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "accessHash" TEXT NOT NULL,
    "userId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "requestedMethod" "GiftMethod" NOT NULL,
    "paidMethod" "GiftMethod",
    "status" "GiftOrderStatus" NOT NULL DEFAULT 'OPEN',
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftVoucher" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "remainingCents" INTEGER NOT NULL DEFAULT 0,
    "recipient" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "GiftStatus" NOT NULL DEFAULT 'INACTIVE',
    "activatedAt" TIMESTAMP(3),

    CONSTRAINT "GiftVoucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftRedemption" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiftRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "actorId" TEXT,
    "kind" TEXT NOT NULL,
    "detail" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiftEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftMail" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftMail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftOrder_number_key" ON "GiftOrder"("number");

-- CreateIndex
CREATE UNIQUE INDEX "GiftOrder_requestId_key" ON "GiftOrder"("requestId");

-- CreateIndex
CREATE INDEX "GiftOrder_status_createdAt_idx" ON "GiftOrder"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GiftVoucher_code_key" ON "GiftVoucher"("code");

-- CreateIndex
CREATE INDEX "GiftVoucher_orderId_idx" ON "GiftVoucher"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "GiftRedemption_requestId_key" ON "GiftRedemption"("requestId");

-- CreateIndex
CREATE INDEX "GiftRedemption_voucherId_idx" ON "GiftRedemption"("voucherId");

-- CreateIndex
CREATE INDEX "GiftEvent_orderId_createdAt_idx" ON "GiftEvent"("orderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GiftMail_key_key" ON "GiftMail"("key");

-- CreateIndex
CREATE INDEX "GiftMail_status_createdAt_idx" ON "GiftMail"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "GiftVoucher" ADD CONSTRAINT "GiftVoucher_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "GiftOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftRedemption" ADD CONSTRAINT "GiftRedemption_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "GiftVoucher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftEvent" ADD CONSTRAINT "GiftEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "GiftOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftMail" ADD CONSTRAINT "GiftMail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "GiftOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Rappen remain integral and balances cannot become negative, even across concurrent requests.
ALTER TABLE "GiftSettings" ADD CONSTRAINT "GiftSettings_range" CHECK ("minCents" >= 100 AND "maxCents" <= 1000000 AND "minCents" <= "maxCents");
ALTER TABLE "GiftOrder" ADD CONSTRAINT "GiftOrder_total" CHECK ("totalCents" > 0 AND "totalCents" <= 30000000);
ALTER TABLE "GiftOrder" ADD CONSTRAINT "GiftOrder_paid" CHECK ("status" <> 'PAID' OR ("paidAt" IS NOT NULL AND "paidMethod" IS NOT NULL));
ALTER TABLE "GiftVoucher" ADD CONSTRAINT "GiftVoucher_balance" CHECK ("amountCents" >= 100 AND "amountCents" <= 1000000 AND "remainingCents" >= 0 AND "remainingCents" <= "amountCents");
ALTER TABLE "GiftVoucher" ADD CONSTRAINT "GiftVoucher_state" CHECK (("status" NOT IN ('INACTIVE', 'CANCELLED', 'REDEEMED') OR "remainingCents" = 0) AND ("status" NOT IN ('ACTIVE', 'REDEEMED') OR "activatedAt" IS NOT NULL));
ALTER TABLE "GiftRedemption" ADD CONSTRAINT "GiftRedemption_positive" CHECK ("amountCents" > 0);
ALTER TABLE "GiftSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GiftOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GiftVoucher" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GiftRedemption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GiftEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GiftMail" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "GiftSettings", "GiftOrder", "GiftVoucher", "GiftRedemption", "GiftEvent", "GiftMail" FROM anon, authenticated;
INSERT INTO "GiftSettings" ("id", "minCents", "maxCents", "updatedAt") VALUES ('default', 5000, 100000, CURRENT_TIMESTAMP);
