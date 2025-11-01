import { TransactionToken } from "@/generated/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/lib/db";

export const createAccountNumber = () => {
  const accountNumber = Math.floor(
    100000000000 + Math.random() * 900000000000
  ).toString();

  return accountNumber;
};

export const signToken = (user_identifier: string, transactionId: string) => {
  const signedToken = jwt.sign(
    { user_identifier, transactionId },
    process.env.JWT_SECRET || "myjwtsecret",
    {
      expiresIn: "5m",
    }
  );

  return signedToken;
};

export const parseToken = (token: string) => {
  try {
    const parsedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "myjwtsecret"
    ) as JwtPayload;

    return parsedToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const checkTransactionTokenExpiry = (
  transactionToken: TransactionToken
) => {
  const currentTime = new Date();

  return currentTime < transactionToken.expiresAt;
};

export const markTransactionTokenExpired = async (
  transactionTokenId: string
) => {
  await prisma.transactionToken.update({
    where: {
      id: transactionTokenId,
    },

    data: {
      status: "EXPIRED",
    },
  });
};

export const generateTransactionId = (length: number): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const findTransactionToken = async (transactionId: string) => {
  const transactionToken = await prisma.transactionToken.findUnique({
    where: {
      transactionId: transactionId,
    },
  });

  return transactionToken;
};

export const invalidateToken = async (transactionTokenId: string) => {
  await prisma.transactionToken.update({
    where: {
      id: transactionTokenId,
    },

    data: {
      invalidated: true,
    },
  });
};

export const adjustAmount = (
  amount: number,
  side: "DATABASE" | "APPLICATION"
) => {
  if (side === "DATABASE") {
    return amount * 100;
  } else {
    return amount / 100;
  }
};
