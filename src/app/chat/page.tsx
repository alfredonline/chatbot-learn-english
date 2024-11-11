import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import db from "../../../db";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback");
  }

  const createdChat = await db.conversation.create({
    data: {
      userId: dbUser?.id,
    },
  });

  if (createdChat.id) {
    redirect(`/chat/${createdChat.id}`);
  }

  return <div>Creating chat session.</div>;
};

export default Page;
