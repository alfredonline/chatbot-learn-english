# AI Language Learning Platform

A modern web application built with Next.js that helps users learn languages through AI-powered conversations, real-time grammar corrections, and interactive quizzes.

## Features

### 1. AI Conversations
- Real-time chat interface with AI language partner
- Natural language processing for authentic conversations
- Message history tracking and persistence

### 2. Grammar Analysis
- Real-time grammar correction
- Detailed explanations of grammar mistakes
- Focus areas identification for improvement

### 3. Interactive Quizzes
- Automatically generated quizzes based on user's weak areas
- Multiple choice questions with instant feedback
- Progress tracking and scoring

### 4. User Dashboard
- Overview of all conversations and quizzes
- Progress tracking
- Easy access to previous learning sessions

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Authentication**: Kinde Auth
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI GPT-4
- **Styling**: Tailwind CSS with Shadcn/UI
- **Animation**: Framer Motion

## Project Structure

src/
├── app/ # Next.js app router pages
├── components/ # React components
│ ├── common/ # Shared components
│ └── ui/ # UI components (shadcn/ui)
├── hooks/ # Custom React hooks
├── lib/ # Utility functions and configurations
└── utils/ # Helper functions


## Getting Started

1. Clone the repository
2. Install dependencies:

npm install


3. Set up environment variables:


DATABASE_URL="your_postgresql_url"


## Key Components

### Chat System
The chat system (`src/components/Chat.tsx`) handles real-time conversations with the AI, including:
- Message persistence
- Typing indicators
- Error handling
- Grammar improvement suggestions

### Dashboard
The dashboard component (`src/components/Dashboard.tsx`) provides:
- Overview of user's conversations
- Access to quizzes
- Progress tracking

### Quiz System
The quiz component (`src/components/Quiz.tsx`) offers:
- Multiple choice questions
- Score tracking
- Immediate feedback
- Review of incorrect answers

## Database Schema

The application uses a PostgreSQL database with the following main models:
- User
- Conversation
- Message
- Correction
- Quiz
- Question
- Answer

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Subscribe to AlfieWebDev on YouTube!