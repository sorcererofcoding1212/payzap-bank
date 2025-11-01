import { z } from "zod";

export const createTransactionTokenSchema = z.object({
  user_identifier: z.string(),
  amount: z.number(),
  provider: z.string(),
  transactionId: z.string(),
});

export type CreateTransactionTokenSchema = z.infer<
  typeof createTransactionTokenSchema
>;

export const createTransferSchema = z.object({
  amount: z.number(),
  accountNumber: z.string(),
});

export type CreateTransferSchema = z.infer<typeof createTransferSchema>;

// user_identifier, amount, provider, transactionId
