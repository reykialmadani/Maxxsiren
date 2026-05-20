# Web-Based Inventory Information System (Maxxsiren)

A web application for inventory management at **Maxxsiren**, a distribution business for warning equipment (sirens & strobe lights). This system is designed to replace manual record-keeping with a centralized, accurate, and real-time digital system.

## Overview

This project is developed as part of a Final Year Thesis research using the **Waterfall** method as the system development approach. The system supports two main user roles: **Inventory Staff** and **Manager/Business Owner**, each with different access rights.

### Key Features

- **Authentication & Authorization**: Login with Role-Based Access Control (RBAC) for Inventory Staff and Manager.
- **Item Data Management**: Complete CRUD operations for master item data and item categories.
- **Transaction Recording**: Systematic and integrated recording of incoming and outgoing items.
- **Real-Time Stock Monitoring**: Available stock quantity information updated automatically with each transaction.
- **Low Stock Alert**: Automatic warning notifications when item stock approaches the minimum threshold.
- **Transaction History**: Complete display of incoming and outgoing item movement history.
- **Search & Filter**: Item data search by name, category, or item code.
- **Automated Inventory Reports**: Generate reports based on specific periods and export to **PDF** or **Excel** format.
- **Dashboard**: Inventory information summary including total items, critical stock, and recent transactions.
- **User Management**: Manage system user accounts (add, edit, deactivate).

## Tech Stack

| Category | Technology |
|---|---|
| **Core Framework** | [Next.js 15.2.6](https://nextjs.org/) |
| **Database** | [PostgreSQL via Supabase](https://supabase.com/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Auth** | [Supabase Auth](https://supabase.com/docs/guides/auth) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Forms** | [react-hook-form](https://react-hook-form.com/) |
| **Icons** | [lucide-react](https://lucide.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **PDF Export** | [jsPDF](https://github.com/parallax/jsPDF) |
| **Excel Export** | [SheetJS (xlsx)](https://shejs.rocketsoftware.com/) |

## Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)**: Developer onboarding guide, Git workflow, and coding standards.
- **[AGENTS.md](AGENTS.md)**: Guidelines for AI Agents in system development.
- **[DESIGN.md](docs/DESIGN.md)**: Single source of truth for UI/Visual decisions — color tokens, component hierarchy, spacing, layout, and page templates.
- **[PRODUCT_PACKAGE_STRUCTURE.md](docs/PRODUCT_PACKAGE_STRUCTURE.md)**: Complete project directory structure and architecture.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0
- [Supabase](https://supabase.com/) account (for database and authentication)

### Installation

```powershell
pnpm install
```

### Environment Configuration

Create a `.env.local` file in the project root directory and fill in the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (Prisma)
DATABASE_URL=your_supabase_postgresql_connection_string
DIRECT_URL=your_supabase_direct_connection_string
```

> **Note**: `DATABASE_URL` uses a connection string with *connection pooling* (port 6543), while `DIRECT_URL` uses a direct connection (port 5432) which is required for Prisma migrations.

### Database Setup

```powershell
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev
```

### Running the Development Server

```powershell
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```powershell
pnpm build
```

## Architecture

This project follows the **Feature-Sliced Design (FSD)** principle, where all business logic is organized by domain within the `src/features/` directory. See [PRODUCT_PACKAGE_STRUCTURE.md](docs/PRODUCT_PACKAGE_STRUCTURE.md) for the complete directory structure.

The data flow uses the **Server Components + Server Actions** pattern from the Next.js App Router, with Prisma as the query layer to PostgreSQL hosted on Supabase.

## About the Research

This system is developed as a Final Year Thesis research product with the title:

> **"Design and Development of a Web-Based Inventory System Application Using the Waterfall Method (Case Study: Maxxsiren)"**

The development method used is **Waterfall**, covering the stages of Requirements Analysis, System Design (UML), Implementation, Testing (*Black Box Testing*), and Maintenance.
