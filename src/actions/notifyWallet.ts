"use server";

import { bankWebhookInstance } from "@/lib/axios";

export const notifyWallet = async (
  user_identifier: string,
  amount: number,
  provider: string,
  transactionId: string,
  status: string
) => {
  const response = await bankWebhookInstance.post(
    "/bank-webhook",
    {
      user_identifier,
      amount,
      provider,
      transactionId,
      status,
    },
    {
      headers: {
        "x-bank-key": process.env.WALLET_SECRET,
      },
    }
  );

  return {
    success: response.data.success,
  };
};
