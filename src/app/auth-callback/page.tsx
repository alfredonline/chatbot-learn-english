import React from "react";
import { verifyUser } from "./actions";
import { redirect } from "next/navigation";

const Page = async () => {
  const { success } = await verifyUser();
  if (success) {
    redirect("/dashboard");
  }

  return (
    <div>
      {!success && "An error occured with the account creation process."}
    </div>
  );
};

export default Page;
