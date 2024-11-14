# Copy paste list

Welcome to the copy paste file! This repository contains code snippets for the tutorial!

## Code Snippets

### `MaxWidthWrapper.tsx`

This component is a utility wrapper that adds a maximum width and centered alignment to its child elements:

```typescript
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
```

### Mapping Inside a Nav

Here's an example of how you can map over an array of navigation items and render links:

```typescript
{navigation.map((item) => (
  <Link
    key={item.name}
    href={item.href}
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    {item.name}
  </Link>
))}
```

### Prisma Connection Logic

This code sets up a Prisma client connection, using a cached instance in production to improve performance:

```typescript
import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}

export default prisma
```

## Prompts

Here are some example prompts you can use for various AI-related tasks:

### First Prompt

```
"You are a helpful assistant that has conversations to help people learn their target language. Maintain a natural and engaging conversation style. Do not correct grammar mistakes."
```

### Second Prompt

```
"You are an expert at correcting grammar. You will be given a message and you need to correct the grammar. You need to summarize the grammar issue as one phrase such as 'Past simple' or 'Present perfect' and then give a suggestion for improvement. Focus purely on grammar mistakes, not vocabulary or regional variations. If there are no grammar mistakes, return an string that simply says 'No grammar mistakes found'."
```

### Quiz Prompt

```
"You are an AI assistant that generates multiple choice quizzes. For each question, provide exactly 4 possible answers, with exactly one correct answer."
```

### Quiz Prompt 2

```
Generate a quiz on the topic of ${topicOfFocus}. The context is that the quiz is for someone learning English as a second language. Include 10 multiple choice questions. For each question, provide 4 answers and mark which one is correct.
```

## Quiz Mapping

Here's an example of how you can map over an array of quizzes and render them as cards:

```typescript
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
          {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'} available
        </p>
        <Link
          href={`/quiz/${quiz.id}`}
          className={buttonVariants({ 
            variant: "default",
            className: "w-full justify-center"
          })}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Take Quiz
        </Link>
      </div>
    </CardContent>
  </Card>
))}
```

## Recent Conversations

Finally, here's an example of how you can render a section for recent conversations:

```typescript
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
              {conversation.messages.length} {conversation.messages.length === 1 ? 'message' : 'messages'}
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
```

I hope these code snippets and examples help you create a beautiful and informative README file for your projects!
