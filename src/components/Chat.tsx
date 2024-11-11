"use client";
import { Message } from "@prisma/client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { sendMessageToDB, saveGrammarImprovements } from "@/utils/db";
import { continueConversation } from "@/utils/open-ai";
import { findGrammarImprovements } from "@/utils/open-ai";
import { useToast } from "@/hooks/use-toast";

const Chat = ({
  initialMessages,
  conversationId,
}: {
  initialMessages: Message[];
  conversationId: string;
}) => {
  const {toast} = useToast();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim()) {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isProcessing) return;
    setIsProcessing(true);
    setIsTyping(true);
    const currentMessage = message.trim();
    setMessage("");

    try {
      const userMessage = {
        content: currentMessage,
        role: "user",
        id: `temp-${Date.now()}`,
        conversationId,
        createdAt: new Date(),
      } as Message;

      setMessages((prev) => [...prev, userMessage]);

      if (isTyping) {
        setMessages((prev) => [
          ...prev,
          {
            content: "...",
            role: "assistant",
            id: "typing-indicator",
            conversationId,
            createdAt: new Date(),
          } as Message,
        ]);
      }

      const [newMessage, correction] = await Promise.all([
        sendMessageToDB(currentMessage, conversationId, "user"),
        findGrammarImprovements(currentMessage),
      ]);

      if (!newMessage) return;

      

      if (
        correction &&
        newMessage &&
        correction.focus !== "No grammar mistakes found"
      ) {
        await saveGrammarImprovements(newMessage.id, correction);
      }

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== userMessage.id);
        return [...filtered, newMessage];
      });

      const aiResponse = await continueConversation(
        [...messages, newMessage],
        currentMessage
      );
      if (!aiResponse) return;

      const newAiMessage = await sendMessageToDB(
        aiResponse.content,
        conversationId,
        "assistant"
      );

      if (!newAiMessage) return;

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== "typing-indicator");
        return [...filtered, newAiMessage];
      });
    } catch {
      // logic later on

      toast({
        title: "An error occurred!",
        description: "Rest assurred, our team has been notified.",
      });

      console.error("Error sending message");
      setMessages((prev) => prev.filter((m) => m.id !== "typing-indicator"));
    } finally {
      setIsProcessing(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Badge variant={"default"} className="w-32 flex justify-center">
          English Practice
        </Badge>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Conversation
        </h1>
        <p className="text-muted-foreground">
          Practice your English with our AI language partner
        </p>
      </motion.div>
      <Card className="mb-4">
        <CardContent className="p-6">
          <motion.div
            className="space-y-4 mb-6 min-h-[300px] max-h-[350px] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  layout
                  key={msg.id}
                  layoutId={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "flex items-start gap-3",
                    msg.role === "user" && "flex-row-reverse"
                  )}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        msg.role === "assistant"
                          ? "/ai-avatar.png"
                          : "/user-avatar.png"
                      }
                    />
                    <AvatarFallback>
                      {msg.role === "assistant" ? "AI" : "ME"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-lg p-3 max-w-[80%]",
                      msg.role === "assistant"
                        ? "bg-accent/10 text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p>{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <Separator className="my-4" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <div className="flex-1 flex gap-3">
              <Input
                placeholder={
                  isProcessing
                    ? "Waiting for response..."
                    : "Type your message.."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
                disabled={isProcessing}
              />
              <Button
                className="shrink-0"
                onClick={sendMessage}
                disabled={!message.trim() || isProcessing}
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-5 w-5"
                  >
                    ⭮
                  </motion.div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
