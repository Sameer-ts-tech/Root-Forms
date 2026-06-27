# Chai Forms Platform

This repository is a full-stack, monorepo-based platform for building, managing, and interacting with dynamic forms. It uses a modern web stack to provide a robust, type-safe, and scalable architecture.

## Overview

Root Forms allows users to:
- **Create Forms**: Build complex forms with multiple fields and custom themes.
- **Collect Submissions**: Share forms and gather user responses.
- **Analyze Data**: View and manage form submissions through a dedicated dashboard.

## 🏗️ Architecture & How It Works

This project is structured as a **Turborepo** monorepo, separating concerns into individual applications and packages. This ensures modularity, reusability, and end-to-end type safety.

### 1. The Frontend App (`apps/web`)
- **Technology**: Built with **Next.js** (App Router), React, and Tailwind CSS.
- **Role**: This is the main user interface. It contains the form builder, the dashboard for viewing responses, explore pages, and the publicly accessible pages for filling out forms.
- **How it works**: The frontend uses `@trpc/client` to make strictly-typed API calls to the backend. It also utilizes custom hooks to manage form state and UI components.

### 2. The API Layer (`packages/trpc`)
- **Technology**: Built with **tRPC** and **Zod**.
- **Role**: Serves as the bridge between the frontend and the business logic. It defines the API contracts (routes, inputs, and outputs).
- **How it works**: 
  - A frontend component requests data (e.g., "get form by ID").
  - The request hits a tRPC route defined here.
  - The route validates the incoming data using Zod schemas.
  - If valid, it delegates the actual work to the **Services Layer**.

### 3. The Business Logic (`packages/services`)
- **Technology**: Pure TypeScript.
- **Role**: Contains the core business rules of the application. 
- **How it works**: Instead of putting database calls directly in the API layer, all core logic (e.g., validating a form submission, checking permissions, formatting data) lives here. The services use the Database package to read/write data.

### 4. The Database Layer (`packages/database`)
- **Technology**: **Drizzle ORM** and PostgreSQL.
- **Role**: Manages all data persistence. 
- **How it works**: Defines the database schema using Drizzle (Users, Forms, FormFields, FormSubmissions, FormThemes). It provides a typed client to the Services layer for executing SQL queries safely.

### 🔄 The End-to-End Flow (Example: Submitting a form)
1. A user clicks "Submit" on the Next.js `web` app.
2. The `web` app calls the `submitForm` tRPC mutation.
3. The `trpc` package validates the payload against a Zod schema.
4. The `trpc` package calls the `createSubmission` function in the `services` package.
5. The `services` package runs any necessary business logic, then uses the `database` package's Drizzle client to insert the record into PostgreSQL.
6. The result is returned all the way back up the chain to the frontend, with complete type safety at every step.

---

## 🚀 Getting Started

This project uses [pnpm](https://pnpm.io/) for dependency management.

### Prerequisites
- Node.js (v18+)
- pnpm (v9+)
- Docker (for local PostgreSQL database)

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the local database:**
   This will spin up a PostgreSQL instance via Docker Compose.
   ```bash
   pnpm db:up
   ```

3. **Initialize the database:**
   Generate the Drizzle ORM client and run migrations to create the tables.
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```
   *(Optional)* To visualize and manage your database data locally, you can use Drizzle Studio:
   ```bash
   pnpm db:studio
   ```

4. **Start the development server:**
   Launch the Next.js frontend and tRPC backend in development mode.
   ```bash
   pnpm dev
   ```

## 🛠️ Available Scripts (Root)
- `pnpm dev`: Starts the development servers.
- `pnpm build`: Builds all apps and packages for production.
- `pnpm lint`: Runs ESLint checks across the repository.
- `pnpm format`: Formats code using Prettier.
- `pnpm check-types`: Runs TypeScript type checking.
