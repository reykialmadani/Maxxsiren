# Chat Conversation

Note: _This is purely the output of the chat conversation and does not contain any raw data, codebase snippets, etc. used to generate the output._

### User Input

Please read and analyze all `.md` files in this project, especially files related to workflows and development rules such as `make-plan`, `init-learn`, project rules, architecture guide, coding standards, folder structure, development flow, task management, and other documentation used in the project development process. After that: 1. Identify the patterns, concepts, workflows, and documentation structures used in this project. 2. Explain the purpose of each file/documentation in the development process. 3. Create an analysis of how this documentation helps maintain consistency, scalability, maintainability, and communication between developers. Next, I want to use the same concepts and work structure to build a new website project. However, before starting to code, I want to first prepare all `.md` documentation so that the project has a clear foundation, rules, workflow, and development standards like the reference project. Based on the analysis of this project: * Determine which `.md` documentation must be created at the beginning of the new project. * Explain the function and purpose of each documentation. * Arrange the order of documentation creation from the initial stage to when development begins. * Determine the recommended development workflow. * Determine the coding rules, folder structure, architecture pattern, branching strategy, naming convention, and documentation standard that should be applied. * Determine what things need to be learned first before starting development of a new project with this concept. * If possible, create a template or starter structure for ideal project documentation for use in modern web-based projects. Main focus: * Project scalability * Clean architecture * Developer experience * Maintainability * Team collaboration * Long-term project management * AI-friendly development workflow * Structured documentation system

*User accepted the command `Get-ChildItem -Path . -Recurse -Filter *.md | Select-Object FullName`*

*User accepted the command `Get-ChildItem -Path . -Recurse -Filter *.md | Where-Object { $_.FullName -notmatch '\\node_modules\\' } | Select-Object FullName`*

*Viewed [CONTRIBUTING.md](file:///C:/Partai/sistem-informasi-kelola-anggota/CONTRIBUTING.md) *

*Viewed [PRODUCT_PACKAGE_STRUCTURE.md](file:///C:/Partai/sistem-informasi-kelola-anggota/docs/PRODUCT_PACKAGE_STRUCTURE.md) *

*Viewed [AI_GUIDE.md](file:///C:/Partai/sistem-informasi-kelola-anggota/docs/AI_GUIDE.md) *

*Viewed [make-plan.md](file:///C:/Partai/sistem-informasi-kelola-anggota/.opencode/commands/make-plan.md) *

*Viewed [initial-learn.md](file:///C:/Partai/sistem-informasi-kelola-anggota/.opencode/commands/initial-learn.md) *

*Viewed [resume-plan.md](file:///C:/Partai/sistem-informasi-kelola-anggota/.opencode/commands/resume-plan.md) *

*Viewed [DESIGN.MD](file:///C:/Partai/sistem-informasi-kelola-anggota/docs/DESIGN.MD) *

*Viewed [README.md](file:///C:/Partai/sistem-informasi-kelola-anggota/.opencode/README.md) *

### Planner Response

Based on an in-depth analysis of all `.md` documentation files in the `sistem-informasi-kelola-anggota` project, this project uses a highly structured **AI-Driven Development** approach. The documentation here serves not only as a guide for human developers, but also as **"System Prompts" and "Guardrails" for AI Agents** (OpenCode).

Below are the analysis results and a complete guide for implementing a similar concept in your new modern web project.

---

### 1. Reference Project Analysis (PPP Information System)

#### A. Patterns, Concepts, and Workflows
*   **Architecture Pattern:** Uses **Feature-Sliced Design (FSD)**. Code is not grouped by technical type (such as global `components/`, `hooks/`, `pages/` folders), but rather by *Business Domain* (e.g., `features/members/`, `features/roles/`).
*   **Contract-First & Mock-Driven API:** Frontend does not wait for backend. API is defined via `openapi.yaml`, then hooks are generated using **Orval**, and simulated in the browser using **MSW (Mock Service Worker)**.
*   **Strict Design System (Token-Based):** Uses Tailwind v4 CSS variables (`--primary`, `--surface`) defined strictly. Using *hardcoded colors* like `text-emerald-600` is strictly prohibited.
*   **AI-First Workflow:** Uses a system of *slash commands* (`/make-plan`, `/run-checks`) and *Specialist Agents* (`@fe-react-specialist`, `@fe-ui-specialist`) to delegate technical tasks.
*   **Enforcement via Plugins/Skills:** Rules are not just written, but enforced by the AI system (e.g., blocking access to `.env` files, blocking edits to Orval-*generated* files, prohibiting the use of Redux/MUI).

#### B. Purpose of Each Main Documentation File
1.  **`docs/PRODUCT_PACKAGE_STRUCTURE.md`**: *Single Source of Truth* (SSOT) for FSD architecture. Determines import hierarchy and prohibits incorrect file placement.
2.  **`docs/DESIGN.MD`**: SSOT for UI/UX. Contains design philosophy, spacing rules, typography, component hierarchy (Shadcn vs Custom), and color tokens.
3.  **`docs/AI_GUIDE.md`**: Guide on how to interact with AI, how to use *commands*, *sub-agents*, and how to perform documentation synchronization (using `/update-docs`).
4.  **`CONTRIBUTING.md`**: Standards for *human developers*: local setup, run/build scripts, branching strategy, and *commit* standardization.
5.  **`AGENTS.md` & `.opencode/README.md`**: Basic rules for the AI System. Determines environment constraints (using PowerShell, pnpm), *tech stack* rules, and *specialist agents* definitions.
6.  **`.opencode/commands/*.md` (such as `make-plan.md`)**: Procedural prompts that tell AI how to respond to *slash commands* for *scaffolding* or *planning*.

#### C. Impact on Scalability, Maintainability, and Collaboration
*   **Scalability:** With FSD architecture, when the project grows from 5 features to 50 features, the code will not become disorganized because each feature is isolated in its own domain.
*   **Maintainability:** Strict standards (zero `any` policy, strict biome linter, generated API client) make code very *predictable*. If the backend API changes, just update `openapi.yaml` and regenerate.
*   **Human & AI Collaboration:** Prevents AI from "hallucinating" and creating its own patterns (e.g., suddenly using Material UI when the project uses Shadcn). Documentation acts as "legislation" that must be followed by both human developers and AI.

---

### 2. New Project Setup Guide (AI-Friendly & Modern Web)

To build a new project with standards this high, you need to prepare the documentation infrastructure **before the first line of code is written**.

#### A. Documentation Creation Order (Day 0 - Foundation)

1.  **`docs/DESIGN.md`**
    *   *Function:* Defines the UI system.
    *   *Contents:* Brand colors, font stack, spacing rules, radius, list of allowed UI components (e.g., Shadcn UI only, MUI prohibited).
2.  **`docs/ARCHITECTURE.md`** (or `PRODUCT_PACKAGE_STRUCTURE.md`)
    *   *Function:* Folder placement rules.
    *   *Contents:* Feature-Sliced Design explanation, architecture prohibitions (e.g., no `import` from higher to lower layers).
3.  **`AGENTS.md`** (or `CURSORRULES.md` / `WINDSURFRULES.md` depending on your AI IDE)
    *   *Function:* Global system prompt for your AI IDE.
    *   *Contents:* "Use pnpm only", "Do not delete comments", "Use Tailwind v4", "Do not guess API, read OpenAPI docs".
4.  **`CONTRIBUTING.md`**
    *   *Function:* Git workflow and project standardization.
    *   *Contents:* Branch naming (`feat/`, `fix/`), package.json scripts, PR rules.
5.  **`README.md`**
    *   *Function:* Project face (high-level overview).

#### B. Recommended Development Workflow

1.  **Plan Phase:** Use AI (e.g., *Chat/Composer*) to create a *Development Plan* per feature. Save in `docs/tasks/feature-x.md` containing `[ ]` checklists.
2.  **Contract-First Phase:** Do not create UI if the API is unclear. Write `openapi.yaml` first, then generate data types.
3.  **Mock Phase:** Create MSW Handlers so FE can be developed without waiting for Backend completion.
4.  **UI/UX Phase:** Create shell/layout and basic components based on `DESIGN.md`.
5.  **Integration Phase:** Connect UI with State Management (Zustand) and Server State (TanStack Query).
6.  **Validation Phase:** Always run Linter (`Biome` / `ESLint`) and TypeScript type-check before committing.

#### C. Recommended Standardization

*   **Folder Structure:** Feature-Sliced Design (FSD).
*   **Tech Stack:** React 19, Vite, TanStack Router (for Type-Safe routing), TanStack Query v5, Zustand (for Global State), Tailwind CSS v4, Shadcn UI, Zod (validation).
*   **Branching:** GitFlow/Trunk-Based (Main, `feat/feature-name`, `fix/bug-name`).
*   **Naming Convention:**
    *   Folder & non-component files: `kebab-case` (`user-profile.ts`).
    *   Component files: `PascalCase` (`UserProfile.tsx`).
    *   Hook functions: `camelCase` (`useFetchUsers.ts`).
*   **Coding Rules:**
    *   No `any`, use `unknown` and `zod.safeParse()`.
    *   No CSS hex colors in `.tsx`, must use variables (e.g., `text-primary`).
    *   No *business logic* inside *UI Components*. Logic goes in *Hooks* / *Stores*.

#### D. What Do You Need to Learn First?

Before starting, make sure you and your team understand the following concepts (as AI will generate code with these patterns):
1.  **Feature-Sliced Design (FSD):** Understand the difference between `layers`, `slices`, and `segments`.
2.  **Mock Service Worker (MSW):** How to intercept HTTP requests at the browser level.
3.  **TanStack Ecosystem:** Understand the *stale-while-revalidate* pattern in TanStack Query, and *file-based routing* in TanStack Router.
4.  **CSS Tokens (Tailwind v4):** Understand how Tailwind v4 uses CSS Variables `@theme inline` instead of `tailwind.config.js`.

---

### 3. Documentation Starter Structure Template (New Project)

Use this folder structure to initialize your project:

```text
my-new-project/
├── docs/
│   ├── ARCHITECTURE.md    # -> FSD rules, Tech Stack, & Layering priorities
│   ├── DESIGN.md          # -> Color palettes, Spacing, Typography, Shadcn rules
│   ├── API_WORKFLOW.md    # -> How to use MSW & OpenAPI Generator
│   └── TASKS/             # -> Folder to store checklists from AI (/make-plan)
│
├── .cursorrules           # (or AGENTS.md) -> Strict instructions for AI Assistant
├── CONTRIBUTING.md        # -> Branching, Commit Message, Git rules
├── README.md
│
├── src/
│   ├── api/               # [LAYER 1] Auto-generated API Client (Orval/OpenAPI)
│   ├── components/        # [LAYER 2] Shared/Global UI (Shadcn UI, Layouts)
│   ├── lib/               # [LAYER 3] Shared Utilities (cn, format-date)
│   ├── features/          # [LAYER 4] Business Domains (auth/, products/, users/)
│   │   └── {domain-name}/
│   │       ├── api/       # Domain-specific API wrapper
│   │       ├── components/# Domain-specific UI
│   │       ├── stores/    # Domain-local Zustand
│   │       ├── schemas/   # Zod form validation
│   │       └── index.ts   # Public API export (Strict Encapsulation)
│   ├── routes/            # TanStack Router Config
│   └── mocks/             # MSW Handlers & Mock Database
│
├── package.json
└── biome.json             # Linter & Formatter (ESLint + Prettier replacement)
```

**Suggested Next Steps:**
If you have already determined the project name and main *branding color*, I can help **create the initial draft** of the `AGENTS.md` and `docs/ARCHITECTURE.md` files customized specifically for your modern web *tech stack*, so you can start coding immediately with a foundation as strong as this reference project.