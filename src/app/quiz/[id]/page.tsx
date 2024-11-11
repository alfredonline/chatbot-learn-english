import React from "react";
import db from "../../../../db";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Quiz from "@/components/Quiz";
import { notFound } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const page = async ({ params }: { params: { id: string } }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { id } = await params;

  const quiz = await db.quiz.findUnique({
    where: {
      id: id,
      userId: user.id,
    },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  if (!quiz) {
    return notFound();
  }

  return (
    <MaxWidthWrapper>
      <Quiz quiz={quiz} />
    </MaxWidthWrapper>
  );
};

export default page;
