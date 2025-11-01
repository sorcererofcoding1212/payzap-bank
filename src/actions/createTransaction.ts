"use server";

import { prisma } from "@/lib/db";
import { generateTransactionId } from "@/lib/utils";
import { notifyWallet } from "./notifyWallet";

export const createDebitTransaction = async (
  ownerId: string,
  amount: number,
  user_identifier: string,
  provider: string,
  transactionTokenId: string,
  transactionId: string
) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        ownerId,
      },

      select: {
        accountNumber: true,
        balance: true,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    const result = await prisma.$transaction(async (txn) => {
      const availableBalance = account.balance >= amount;

      const transaction = await txn.transaction.create({
        data: {
          transactionType: "DEBIT",
          transactionId: generateTransactionId(8),
          amount,
          accountId: account.accountNumber,
          status: availableBalance ? "COMPLETED" : "FAILED",
        },
      });

      if (transaction.status === "COMPLETED") {
        await txn.account.update({
          where: {
            accountNumber: account.accountNumber,
          },

          data: {
            balance: {
              decrement: amount,
            },
          },
        });

        await txn.transactionToken.update({
          where: {
            id: transactionTokenId,
          },

          data: {
            status: "COMPLETED",
          },
        });
      }

      return transaction;
    });

    if (result.status === "FAILED") {
      await notifyWallet(
        user_identifier,
        amount,
        provider,
        transactionId,
        result.status
      );
      return {
        msg: "Transaction Failed",
        success: false,
      };
    }

    const { success } = await notifyWallet(
      user_identifier,
      amount,
      provider,
      transactionId,
      result.status
    );

    if (success) {
      return {
        msg: "Transaction Completed",
        success: true,
      };
    } else {
      await prisma.$transaction([
        prisma.account.update({
          where: {
            accountNumber: account.accountNumber,
          },

          data: {
            balance: {
              increment: result.amount,
            },
          },
        }),

        prisma.transaction.update({
          where: {
            id: result.id,
          },

          data: {
            status: "FAILED",
          },
        }),
      ]);
      return {
        msg: "Transaction Failed",
        success: false,
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      msg: error.message || "Transaction Failed",
      success: false,
    };
  }
};
