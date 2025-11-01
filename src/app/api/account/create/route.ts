export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adjustAmount, createAccountNumber } from "@/lib/utils";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  const { phoneNumber, name, password, balance, accountType } =
    await req.json();
  const customerId = `customer_${phoneNumber}`;
  const accountNumber = createAccountNumber();
  const encryptedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      customerId,
      phoneNumber,
      name,
      password: encryptedPassword,
      accounts: {
        create: {
          accountNumber,
          accountType,
          balance: adjustAmount(balance, "DATABASE"),
        },
      },
    },
  });

  return NextResponse.json({
    msg: "Account created",
    customerId,
  });
};
