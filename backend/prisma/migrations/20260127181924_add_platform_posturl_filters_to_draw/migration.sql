-- AlterTable
ALTER TABLE "draws" ADD COLUMN     "filters" JSONB,
ADD COLUMN     "platform" TEXT,
ADD COLUMN     "postUrl" TEXT;
