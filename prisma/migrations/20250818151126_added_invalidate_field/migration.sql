-- AlterTable
ALTER TABLE "public"."TransactionToken" ADD COLUMN     "invalidated" BOOLEAN NOT NULL DEFAULT false;
