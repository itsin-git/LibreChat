# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup & Installation
```bash
npm ci                          # Install dependencies
npm run build:data-provider     # Build data provider package
npm run build:mcp              # Build MCP package  
npm run build:data-schemas     # Build data schemas package
```

### Development Servers
```bash
npm run backend:dev            # Start backend dev server
npm run frontend:dev           # Start frontend dev server (Vite)
```

### Building
```bash
npm run frontend              # Build frontend for production
npm run frontend:ci           # Build frontend for CI
```

### Testing
```bash
npm run test:api              # Run backend unit tests
npm run test:client           # Run frontend unit tests
npm run e2e                   # Run Playwright e2e tests
npm run e2e:headed            # Run e2e tests with browser UI
```

### Linting & Formatting
```bash
npm run lint                  # ESLint check
npm run lint:fix              # ESLint auto-fix
npm run format                # Prettier format
```

### User Management Scripts
```bash
npm run create-user           # Create new user
npm run add-balance           # Add user balance
npm run list-users            # List all users
npm run ban-user              # Ban user
```

### Docker Commands
```bash
npm run start:deployed        # Start with docker-compose
npm run stop:deployed         # Stop docker containers
```

## Architecture Overview

LibreChat is a full-stack AI chat platform with the following high-level architecture:

### Monorepo Structure
- **npm workspaces** with shared packages and cross-dependencies
- **Frontend**: React 18 + TypeScript, Vite build system, TailwindCSS
- **Backend**: Node.js/Express, MongoDB with Mongoose ODM
- **Data Layer**: Custom data provider packages for API abstraction

### Key Directories
- `/api/` - Express.js backend with clients, controllers, models, services
- `/client/` - React frontend with components, hooks, stores (Recoil)
- `/packages/` - Shared packages:
  - `data-provider` - API client and data services
  - `data-schemas` - Mongoose schemas and TypeScript types
  - `mcp` - Model Context Protocol implementation
- `/config/` - Administrative scripts and utilities
- `/e2e/` - Playwright end-to-end tests

### Backend Architecture (`/api/`)
- **app/clients/** - AI model clients (OpenAI, Anthropic, Google, etc.)
- **app/agents/** - Custom AI agent system with tools and memory
- **server/controllers/** - API endpoint handlers
- **server/services/** - Business logic and external integrations
- **server/middleware/** - Authentication, validation, rate limiting
- **models/** - MongoDB schemas and database operations

### Frontend Architecture (`/client/`)
- **React 18** with TypeScript, using Vite for build system
- **State Management**: Recoil for global state, Tanstack Query for server state
- **UI Components**: Radix UI primitives with Tailwind CSS
- **Routing**: React Router with protected routes
- **Internationalization**: i18next for 20+ languages

### AI Integration Pattern
- **Client Classes**: Each AI provider has a dedicated client class extending BaseClient
- **Streaming**: Server-sent events for real-time response streaming
- **Tools**: Plugin system for extending AI capabilities (search, image gen, etc.)
- **Memory**: Conversation memory management with summarization

### Data Flow
1. **Frontend** → API calls via data-provider package
2. **API Middleware** → Authentication, validation, rate limiting
3. **Controllers** → Route handlers that delegate to services
4. **Services** → Business logic, AI client orchestration
5. **Models** → MongoDB operations via Mongoose
6. **Streaming** → Real-time responses back to frontend

## Development Workflow

### Prerequisites
- Node.js 20.x
- MongoDB Community Edition
- Docker (for full stack development)

### Initial Setup
1. Copy `.env.example` to `.env` and configure required variables
2. Run `npm ci` to install all dependencies
3. Build shared packages: `npm run build:data-provider && npm run build:mcp && npm run build:data-schemas`
4. For testing: Copy `api/test/.env.test.example` to `api/test/.env.test`

### Code Standards
- **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)
- **File Naming**: camelCase for JS/TS files, PascalCase for React components
- **TypeScript**: Frontend is mostly converted, backend still uses JavaScript
- **Testing**: Unit tests required for new features, E2E tests for user flows

### Configuration Files
- `.env` - Environment variables for development
- `librechat.yaml` - Main application configuration (endpoints, models, etc.)
- `docker-compose.yml` - Multi-container development environment

### Key Environment Variables
```bash
# Database
MONGO_URI=mongodb://127.0.0.1:27017/LibreChat

# AI Providers (user_provided means users enter their own keys)
OPENAI_API_KEY=user_provided
ANTHROPIC_API_KEY=user_provided
GOOGLE_KEY=user_provided

# Search & Features
SEARCH=true
MEILI_HOST=http://0.0.0.0:7700

# Authentication
JWT_SECRET=<generated>
ALLOW_REGISTRATION=true
```

## Special Features & Patterns

### Artifacts System
- **Generative UI**: Creates React components, HTML, and Mermaid diagrams
- **Sandboxed Execution**: Safe code execution in isolated environment
- **Preview & Download**: Real-time preview with download capabilities

### Agent System
- **Custom Agents**: User-defined AI assistants with specific instructions
- **Tool Integration**: Extensible plugin system for external services
- **Memory Management**: Persistent conversation context and summarization

### File Handling
- **Multi-modal Support**: Image upload, analysis, and processing
- **Document Processing**: PDF, text, and other document types
- **Vector Storage**: RAG (Retrieval Augmented Generation) with embeddings
- **Storage Providers**: Local, S3, Azure, Firebase, Google Cloud

### Authentication & Security
- **JWT-based**: Stateless authentication with refresh tokens
- **OAuth2**: Google, GitHub, Discord, Facebook, Apple social login
- **LDAP**: Enterprise directory integration
- **Rate Limiting**: Per-user and per-IP request limiting
- **Content Moderation**: Text moderation with configurable policies

### Model Context Protocol (MCP)
- **Server Integration**: Connect external tools and data sources
- **Tool Calling**: Dynamic tool discovery and execution
- **Resource Access**: Secure access to external resources and APIs