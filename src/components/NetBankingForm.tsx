"use client";

import { useState } from "react";
import { LabelledInput } from "./LabelledInput";
import { createDebitTransaction } from "@/actions/createTransaction";
import { authenticateUser } from "@/actions/authenticateUser";
import { redirect } from "next/navigation";

interface NetBankingFormProps {
  user_identifier: string;
  amount: number;
  provider: string;
  transactionId: string;
  transactionTokenId: string;
}

export const NetBankingForm = ({
  user_identifier,
  amount,
  provider,
  transactionId,
  transactionTokenId,
}: NetBankingFormProps) => {
  const [customerId, setCustomerId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [inTransaction, setInTransaction] = useState<boolean>(false);

  const handleFormSubmit = async () => {
    setInTransaction(true);
    const { ownerId, msg } = await authenticateUser(customerId, password);

    if (!ownerId) {
      setErrorMsg(msg);
      return;
    }

    const { success } = await createDebitTransaction(
      ownerId,
      amount,
      user_identifier,
      provider,
      transactionTokenId,
      transactionId
    );

    setInTransaction(false);

    if (success) {
      redirect("/netbanking/success");
    } else {
      redirect("/netbanking/transaction/error");
    }
  };
  return (
    <>
      <div className="w-full text-center text-xl opacity-80">
        Login to NetBanking
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        className="px-6 mt-8 w-full flex flex-col justify-center items-center gap-y-4"
      >
        <LabelledInput
          disabled={inTransaction}
          onChange={(e) => setCustomerId(e.target.value)}
          input_id="customer_id"
          label="Customer ID"
        />
        <LabelledInput
          disabled={inTransaction}
          onChange={(e) => setPassword(e.target.value)}
          input_id="password"
          label="Password"
          type="password"
        />
        <button
          disabled={inTransaction}
          className="text-sm lg:text-base bg-blue-500 px-6 py-2.5 mt-2 cursor-pointer text-white font-semibold rounded-md"
        >
          Continue
        </button>
        {errorMsg && (
          <div className="text-red-500 text-sm lg:text-base">{errorMsg}</div>
        )}
        <div className="opacity-80 text-xs mt-1 lg:mt-4 lg:text-sm">* Please do not refresh the page</div>
      </form>
    </>
  );
};
