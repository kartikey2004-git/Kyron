# AI Code Review

An AI-powered code review platform that automatically analyzes pull requests and provides intelligent feedback, suggestions, and security insights to help developers ship better code faster.

## Project Overview

AI Code Review is a web application that integrates with GitHub to provide automated AI analysis of pull requests. The platform uses multiple AI providers to generate comprehensive code reviews, including bug detection, security vulnerability identification, and code quality suggestions. It features a modern dashboard for tracking review history, contribution analytics, and repository management.

Target audience: Individual developers and development teams looking to accelerate their code review process and improve code quality through AI-powered automation.

## Features

- **AI PR Summaries**: Get instant, intelligent summaries of pull requests to understand changes at a glance
- **Inline Suggestions**: Receive contextual code suggestions directly in pull requests for better implementations
- **Security Detection**: Automatically identify security vulnerabilities and potential issues before they reach production
- **Auto Comments**: AI automatically adds meaningful comments explaining complex code changes and improvements
- **Faster Reviews**: Reduce review time by 80% with AI-powered analysis that catches issues humans might miss
- **Code Quality**: Ensure consistent code quality with automated checks for best practices and standards
- **GitHub Integration**: Seamless integration with GitHub repositories and pull requests
- **Dashboard Analytics**: Track review history, contribution patterns, and repository statistics
- **Multi-Provider AI**: Support for multiple AI providers including Google AI, Groq, and Hugging Face

## Tech Stack

### Frontend

- **Next.js 16.2.1** - React framework with App Router
- **React 19.2.4** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - Component library
- **Framer Motion** - Animation library
- **React Query** - Data fetching and state management
- **Zustand** - State management

### Backend

- **Next.js API Routes** - Server-side API
- **Prisma 7.5.0** - ORM for database operations
- **PostgreSQL** - Primary database
- **Better Auth** - Authentication solution
- **Inngest** - Background job processing

### AI & ML

- **AI SDK** - Multi-provider AI integration
- **Google Generative AI** - AI model provider
- **Groq** - AI model provider
- **Hugging Face Inference** - AI model provider
- **Pinecone** - Vector database for embeddings

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Prisma** - Database schema management
- **Bun** - Package manager and runtime

## Project Structure

```
ai-code-review/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── inngest/              # Background job endpoints
│   │   ├── repositories/         # Repository management
│   │   └── webhooks/             # GitHub webhooks
│   ├── dashboard/                # Main dashboard pages
│   │   ├── repository/           # Repository management
│   │   ├── reviews/              # Review history
│   │   └── settings/             # User settings
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                    # Reusable React components
│   ├── landing/                  # Landing page components
│   ├── providers/                # Context providers
│   └── ui/                       # Base UI components
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication configuration
│   ├── auth-client.ts            # Client-side auth
│   ├── db.ts                     # Database connection
│   └── utils.ts                  # General utilities
├── modules/                      # Feature modules
│   ├── ai/                       # AI integration logic
│   ├── auth/                     # Authentication features
│   ├── dashboard/                # Dashboard functionality
│   ├── github/                   # GitHub API integration
│   ├── repository/               # Repository management
│   ├── review/                   # Review processing
│   └── settings/                 # Settings management
├── prisma/                       # Database schema and migrations
│   └── schema.prisma             # Prisma schema definition
├── public/                       # Static assets
├── types/                        # TypeScript type definitions
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- PostgreSQL database
- GitHub OAuth application
- API keys for AI providers (Google AI, Groq, Hugging Face)
- Pinecone vector database (optional)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kartikey2004-git/AI-Code-Review.git
cd ai-code-review
```

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Configure the following environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google AI API key
- `GROQ_API_KEY` - Groq API key
- `HUGGINGFACE_API_KEY` - Hugging Face API key
- `PINECONE_API_KEY` - Pinecone API key (optional)

4. Set up the database:

```bash
bun run db:push
# or
npx prisma db push
```

5. Run the development server:

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Sign In**: Use GitHub OAuth to authenticate and connect your GitHub account
2. **Connect Repositories**: Authorize access to your GitHub repositories
3. **Create Pull Requests**: Open PRs as usual - the AI will automatically analyze them
4. **View Reviews**: Check your dashboard for AI-generated reviews and suggestions
5. **Track Analytics**: Monitor your review history and contribution patterns

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## Configuration

### Database Configuration

The application uses PostgreSQL as the primary database. The schema includes:

- Users and authentication data
- GitHub repository information
- Pull request reviews and analysis
- User sessions and accounts

Database configuration is managed through Prisma. See `prisma/schema.prisma` for the complete schema definition.

### AI Provider Configuration

The application supports multiple AI providers:

- **Google Generative AI**: For general code analysis and reviews
- **Groq**: For fast inference and suggestions
- **Hugging Face**: For specialized models and embeddings

Configure API keys in your environment variables to enable each provider.

### GitHub Integration

GitHub OAuth is required for authentication and repository access. Create a GitHub OAuth application with:

- Authorization callback URL: `http://localhost:3000/api/auth/callback/github` (development)
- Scope: `repo` (for repository access)

## Development & Contribution

### Code Style

The project uses:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Tailwind CSS** for styling
- **Prisma** for database operations

### Development Workflow

1. Create feature branches from `main`
2. Follow the existing code patterns and component structure
3. Use TypeScript for all new code
4. Test changes thoroughly before submitting PRs
5. Ensure all linting passes before committing

### Project Structure Guidelines

- Place new features in the `modules/` directory
- Use `components/` for reusable UI components
- Store utility functions in `lib/`
- Follow the existing naming conventions and file organization

## Support & Maintenance

For support:

- Create an issue in the GitHub repository
- Check existing documentation and FAQs
- Review the codebase for implementation details

The project is actively maintained. Updates and improvements are regularly released based on user feedback and technological advancements.

---

Built by [Kartikey](https://github.com/kartikey2004-git) - AI-powered code review for modern development teams.
