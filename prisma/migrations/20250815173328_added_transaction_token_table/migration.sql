/*
  Warnings:

  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."TokenStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "status" "public"."TransactionStatus" NOT NULL;

-- CreateTable
CREATE TABLE "public"."TransactionToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "public"."TokenStatus" NOT NULL,
    "user_identifier" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionToken_token_key" ON "public"."TransactionToken"("token");
