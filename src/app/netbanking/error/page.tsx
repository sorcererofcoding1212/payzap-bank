import React from "react";

const ErrorPage = () => {
  return (
    <div className="w-[95%] lg:w-[60%] bg-white py-6">
      <div className="text-red-500 text-center text-xl lg:text-2xl font-semibold">
        Token expired or invalid
      </div>
    </div>
  );
};

export default ErrorPage;
