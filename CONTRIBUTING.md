# Contributing Guidelines — Maxxsiren Inventory System

## Local Setup

1. **Clone repository**:
   ```powershell
   git clone <repo-url>
   cd maxxsiren-inventory
   ```

2. **Install dependencies**:
   ```powershell
   pnpm install
   ```

3. **Environment Variables**:
   Copy `.env.example` to `.env` and configure the Supabase & Prisma connections.

4. **Migrate & Seed Database**:
   ```powershell
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

5. **Run Development Server**:
   ```powershell
   pnpm dev
   ```

## Git Branching Strategy

- `main`: Stable production branch. Do not push directly to this branch.
- `feat/*`: For new feature development (e.g., `feat/dashboard-stats`).
- `fix/*`: For bug fixes (e.g., `fix/login-error`).

## Conventional Commits

Commit format must follow the conventional standard:
- `feat: [description]` for new features.
- `fix: [description]` for bug fixes.
- `docs: [description]` for documentation updates.
- `chore: [description]` for configuration, build, or tooling fixes without changing features.
