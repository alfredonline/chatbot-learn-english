"use client";
import { Correction } from "@prisma/client";
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { BookOpen, Loader2, Trash } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { useState } from "react";
import { deleteGrammarImprovement } from "@/utils/db";
import { useRouter } from "next/navigation";
import { generateQuizQuestions } from "@/utils/open-ai";
import { cn } from "@/lib/utils";

const GrammarImprovements = ({
  improvements,
}: {
  improvements: Correction[];
}) => {
  const router = useRouter();

  const [itemToDelete, setItemToDelete] = useState<string>("");
  const [quizToGenerate, setQuizToGenerate] = useState<string>("");

  const handleDelete = async (id: string, conversationId: string) => {
    setItemToDelete(id);

    try {
      await deleteGrammarImprovement(id, conversationId);
    } catch (error) {
      console.error("failed to delete improvement", error);
    } finally {
      setItemToDelete("");
    }
  };

  const handleQuizGeneration = async (original: string, focus: string) => {
    try {
      setQuizToGenerate(original);
      const data = await generateQuizQuestions(focus);
      router.push(`/quiz/${data.id}`);
    } catch (error) {
      console.error("an error occurred", error);
      setQuizToGenerate("");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{ opacity: 1, y: 0 }}
        className={"mb-8"}
      >
        <Badge variant="default">Language Analysis</Badge>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Improvements
        </h1>
        <p className="text-muted-foreground">
          Track your grammar and vocabulary progress.
        </p>
      </motion.div>
      <Card className="mb-4">
        <CardContent className="p-6">
          {improvements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <BookOpen className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                You will start to see suggestions once you have a sent messages.
              </p>
            </motion.div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {improvements?.map((improvement) => (
                <AccordionItem
                  key={improvement.id}
                  value={improvement.id}
                  className="border border-border/40 bg-accent/10 rounded-lg"
                >
                  <div className="flex items-center justify-between px-4">
                    <AccordionTrigger className="flex-1 hover:no-underline py-4">
                      <div className="flex items-center w-full">
                        <Badge
                          variant={"outline"}
                          className="text-primary shrink-0"
                        >
                          {improvement.focus}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(improvement.id, improvement.messageId);
                      }}
                      disabled={itemToDelete === improvement.id}
                    >
                      {itemToDelete === improvement.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <Button
                        className={cn(
                          "w-full",
                          quizToGenerate === improvement.original &&
                            "bg-primary/10"
                        )}
                        variant={"outline"}
                        disabled={
                          quizToGenerate === improvement.original ||
                          quizToGenerate.length !== 0
                        }
                        onClick={() => {
                          handleQuizGeneration(
                            improvement.original,
                            improvement.focus
                          );
                        }}
                      >
                        {" "}
                        {quizToGenerate === improvement.original
                          ? "Creating Quiz"
                          : "Create quiz"}
                      </Button>
                      <div className="rounded-lg bg-muted/30 p-4 border-l-4 border-primary/50">
                        <h3 className="font-semibold text-foreground/80 mb-2">
                          Original
                        </h3>
                        <p className="text-muted-foreground">
                          {improvement.original}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4 border border-border/50 border-l-4">
                        <div className="flex flex-col gap-2 mb-2">
                          <h3 className="font-semibold text-foreground/80 mb-2">
                            Corrected
                          </h3>
                          <p className="text-muted-foreground">
                            {improvement.corrected}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GrammarImprovements;
