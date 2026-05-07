# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all Vitest tests
npm run setup        # Install deps + generate Prisma client + run migrations
npm run db:reset     # Force reset DB migrations
```

Run a single test file:
```bash
npx vitest run src/lib/file-system.test.ts
```

Environment: copy `.env` and set `ANTHROPIC_API_KEY`. Without it, the app falls back to a `MockLanguageModel` that generates static components.

## Architecture

UIGen is an AI-powered React component generator. Users describe components in a chat; Claude generates code using tools; the UI shows a live preview with no real files written to disk.

### Request flow

1. User sends a prompt → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. Server streams a Claude response via Vercel AI SDK (`streamText`)
3. Claude calls two tools to build a virtual filesystem:
   - `str_replace_editor` (`src/lib/tools/`) — create/edit file content
   - `file_manager` — rename/delete files
4. Tool results update the in-memory `VirtualFileSystem` (`src/lib/file-system.ts`)
5. On stream finish, the project is persisted to SQLite via Prisma (if authenticated)
6. `FileSystemContext` propagates changes to the editor and preview

### Virtual file system

`VirtualFileSystem` is the core data structure. It holds all generated files in memory and is serialised to JSON for DB storage (the `data` column of `Project`). There is no real filesystem I/O during component generation.

### Live preview

`PreviewFrame` (`src/components/preview/`) renders generated React components inside an iframe. `jsx-transformer.ts` (`src/lib/transform/`) uses Babel standalone to transpile JSX and resolves imports (React, shadcn, Tailwind) to CDN or bundled equivalents at runtime.

### LLM provider

`src/lib/provider.ts` selects the model:
- **Real**: `claude-3-7-sonnet-latest` with prompt caching (system message marked `ephemeral`)
- **Mock**: static counter/form/card components, no API key required

Max tool-call steps: 40 (real) / 4 (mock).

### Auth

Server Actions (`src/actions/`) handle sign-up, sign-in, sign-out. Sessions are JWT tokens in httpOnly cookies (7-day expiry, secret from `JWT_SECRET` env var). `src/middleware.ts` gates `/api/projects` and `/api/filesystem` routes. Password hashing uses bcrypt (cost 10).

### State management

Two React contexts (both in `src/lib/contexts/`):
- `FileSystemContext` — owns the `VirtualFileSystem` instance; selected file; file tree
- `ChatContext` — owns message history; streaming state; triggers the chat API call

### Database

SQLite via Prisma. Two models: `User` and `Project`. `Project.data` stores the serialised `VirtualFileSystem`; `Project.messages` stores JSON-serialised chat history. Schema lives in `prisma/schema.prisma`.

### Path alias

`@/*` maps to `src/*` throughout the project.
