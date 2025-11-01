import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/utils";
import { createTransactionTokenSchema } from "@/lib/schema";

export const POST = async (req: NextRequest) => {
  const { user_identifier, amount, provider, transactionId } = await req.json();
  const { success, error } = createTransactionTokenSchema.safeParse({
    user_identifier,
    amount,
    provider,
    transactionId,
  });

  if (!success) {
    return Response.json({
      msg: error.message || "Invalid inputs provided",
      success: false,
    });
  }
  await prisma.transactionToken.create({
    data: {
      user_identifier,
      provider,
      amount,
      status: "PENDING",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      transactionId,
    },
  });
  const signedToken = signToken(user_identifier, transactionId);
  return NextResponse.json({
    token: signedToken,
  });
};
