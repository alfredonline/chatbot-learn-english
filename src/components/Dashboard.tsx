import { Conversation, Message, Quiz, Question, Answer } from "@prisma/client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { ClipboardList, ExternalLink } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface ConversationWithMessages extends Conversation {
  message: Message[];
}

interface QuizWithRelations extends Quiz {
  questions: Question[];
}

const Dashboard = ({
  quizzes,
  conversations,
}: {
  quizzes: QuizWithRelations[];
  conversations: ConversationWithMessages[];
}) => {
  if (!quizzes || !conversations) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ClipboardList className="h-16 w-16 text-muted-foreground mb-6" />
          <p className="text-xl font-semibold text-foreground">
            No data available.
          </p>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Create your first quiz to get started!
          </p>
          <Link href={"/chat"} className={buttonVariants()}>
            Start Chatting
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 py-8 mt-24">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your quizzes and conversations
          </p>
        </div>
        <Link href={"/chat"} className={buttonVariants()}>
          New chat
        </Link>
      </div>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Your quizzes
          </h2>
        </div>
        <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="bg-card hover:shadow-lg transition-all duration-300 border hover:border-primary/20"
            >
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg text-card-foreground">
                  {quiz.topic || "Untitled Quiz"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {quiz.questions.length}{" "}
                    {quiz.questions.length === 1 ? "question" : "questions"}{" "}
                    available
                  </p>
                  <Link
                    href={`/quiz/${quiz.id}`}
                    className={buttonVariants({
                      variant: "default",
                      className: "w-full justify-center",
                    })}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Take Quiz
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="pt-4">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Recent Conversations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conversations.map((conversation) => (
            <Card 
              key={conversation.id}
              className="hover:shadow-md transition-all duration-300 border hover:border-primary/20"
            >
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">
                  {new Date(conversation.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {conversation.message.length} {conversation.message.length === 1 ? 'message' : 'messages'}
                  </p>
                  <Link
                    href={`/chat/${conversation.id}`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    View Chat
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
