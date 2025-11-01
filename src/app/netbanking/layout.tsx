import hdfcLogo from "@/logos/hdfc.svg";
import Image from "next/image";
import { ReactNode } from "react";

interface NetbankingLayoutProps {
  children: ReactNode;
}

const NetbankingLayout = ({ children }: NetbankingLayoutProps) => {
  return (
    <div className="bg-neutral-200/60 min-h-screen">
      <div className="py-8 flex bg-white flex-col justify-center items-center">
        <h1 className="text-lg w-[70%] text-center lg:text-xl opacity-80">
          Welcome to HDFC Bank NetBanking
        </h1>
        <div className="flex items-center gap-x-2 lg:gap-x-3 mt-3 lg:mt-2">
          <div className="text-xs font-medium text-blue-900">
            MADE DIGITAL BY
          </div>
          <div>
            <Image
              src={hdfcLogo}
              alt="logo"
              width={80}
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full mt-6 lg:mt-10">{children}</div>
    </div>
  );
};

export default NetbankingLayout;
