"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

export const authenticateUser = async (
  customerId: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      customerId: customerId,
    },
  });

  if (!user) {
    return {
      msg: "Invalid credentials provided",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return {
      msg: "Invalid credentials provided",
    };
  }

  return {
    msg: "User authenticated",
    ownerId: user.id,
  };
};
