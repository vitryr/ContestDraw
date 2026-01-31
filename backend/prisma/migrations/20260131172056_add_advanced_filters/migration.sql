-- CreateEnum
CREATE TYPE "PassType" AS ENUM ('PASS_48H', 'PASS_24H', 'PASS_WEEK');

-- AlterTable
ALTER TABLE "draws" ADD COLUMN     "advancedFilters" JSONB,
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "postId" TEXT,
ADD COLUMN     "preScanResult" JSONB;

-- CreateTable
CREATE TABLE "user_passes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PassType" NOT NULL DEFAULT 'PASS_48H',
    "purchasePrice" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "stripePaymentId" TEXT,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "drawsUsed" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_passes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_passes_userId_expiresAt_idx" ON "user_passes"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "user_passes_isActive_expiresAt_idx" ON "user_passes"("isActive", "expiresAt");

-- CreateIndex
CREATE INDEX "draws_lockedAt_idx" ON "draws"("lockedAt");
