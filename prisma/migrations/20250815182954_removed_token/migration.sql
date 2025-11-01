/*
  Warnings:

  - You are about to drop the column `token` on the `TransactionToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `TransactionToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `TransactionToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."TransactionToken_token_key";

-- AlterTable
ALTER TABLE "public"."TransactionToken" DROP COLUMN "token",
ADD COLUMN     "transactionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TransactionToken_transactionId_key" ON "public"."TransactionToken"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionToken_transactionId_idx" ON "public"."TransactionToken"("transactionId");
