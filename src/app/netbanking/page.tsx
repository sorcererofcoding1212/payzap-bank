import { NetBankingForm } from "@/components/NetBankingForm";
import {
  checkTransactionTokenExpiry,
  findTransactionToken,
  invalidateToken,
  markTransactionTokenExpired,
  parseToken,
} from "@/lib/utils";
import { redirect } from "next/navigation";

interface NetbankingPageProps {
  searchParams: Promise<{ token: string }>;
}

const NetbankingPage = async ({ searchParams }: NetbankingPageProps) => {
  const { token } = await searchParams;

  const parsedTokenData = parseToken(token);

  if (!parsedTokenData) {
    redirect("/netbanking/error");
  }

  const transactionToken = await findTransactionToken(
    parsedTokenData.transactionId
  );

  if (
    !transactionToken ||
    transactionToken.status === "EXPIRED" ||
    transactionToken.status === "COMPLETED" ||
    transactionToken.invalidated
  ) {
    redirect("/netbanking/error");
  }

  const validTransactionToken = checkTransactionTokenExpiry(transactionToken);

  if (!validTransactionToken) {
    await markTransactionTokenExpired(transactionToken.id);
    redirect("/netbanking/error");
  }

  const {
    user_identifier,
    transactionId,
    amount,
    provider,
    id: transactionTokenId,
  } = transactionToken;

  await invalidateToken(transactionTokenId);

  return (
    <div className="w-[95%] lg:w-[60%] bg-white py-6">
      <NetBankingForm
        user_identifier={user_identifier}
        amount={amount}
        provider={provider}
        transactionId={transactionId}
        transactionTokenId={transactionTokenId}
      />
    </div>
  );
};

export default NetbankingPage;
