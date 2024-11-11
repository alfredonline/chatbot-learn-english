"use server";
import db from "../../../db";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function verifyUser() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return { success: false };
    }

    const dbUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.given_name + " " + user.family_name,
        },
      });
      return { success: true };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false}
  }
}
