import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateTransactionId } from "@/lib/utils";
import { createTransferSchema } from "@/lib/schema";

export const POST = async (req: NextRequest) => {
  try {
    const { amount, accountNumber } = await req.json();

    const { success, error } = createTransferSchema.safeParse({
      accountNumber,
      amount,
    });

    if (!success) {
      return NextResponse.json({
        msg: error.message || "Invalid inputs provided",
        success: false,
      });
    }

    const transactionId = generateTransactionId(8);

    await prisma.$transaction(async (txn) => {
      await txn.account.update({
        where: {
          accountNumber,
        },

        data: {
          balance: {
            increment: amount,
          },
        },
      });

      await txn.transaction.create({
        data: {
          accountId: accountNumber,
          amount,
          transactionId,
          transactionType: "CREDIT",
          status: "COMPLETED",
        },
      });
    });

    return NextResponse.json({
      msg: "Transaction created",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Transaction failed",
      success: false,
    });
  }
};
