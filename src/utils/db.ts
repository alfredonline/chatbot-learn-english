"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import db from "../../db";
import { Message } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function sendMessageToDB(
  message: string,
  conversationId: string,
  role: string
): Promise<Message | undefined> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId, userId: user.id },
    });

    if (!conversation) {
      throw new Error("Conversation Not Found");
    }

    const newMessage = await db.message.create({
      data: {
        content: message,
        conversationId: conversationId,
        role: role,
      },
    });

    return newMessage;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function saveGrammarImprovements(
  messageId: string,
  correction: {
    original: string;
    corrected: string;
    focus: string;
  }
) {
  try {
    const { getUser } = await getKindeServerSession();
    const user = await getUser();

    if (!user) {
      throw new Error("User not found");
    }

    const message = await db.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    const createCorrection = await db.correction.create({
      data: {
        ...correction,
        messageId,
      },
    });

    const updatedMessage = await db.message.update({
      where: {
        id: messageId,
      },
      data: {
        improvements: {
          connect: {
            id: createCorrection.id,
          },
        },
      },
    });

    if (!updatedMessage) {
      throw new Error("Message failed to update");
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        weaknesses: {
          push: correction.focus,
        },
      },
    });

    revalidatePath(`/chat/${updatedMessage.conversationId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}

export async function deleteGrammarImprovement(
  messageId: string,
  conversationId: string
) {
  try {
    await db.correction.delete({
      where: {
        id: messageId,
      },
    });

    revalidatePath(`/chat/${conversationId}`);
  } catch (error) {
    console.error("error deleting grammar improvement", error);
    return undefined;
  }
}
