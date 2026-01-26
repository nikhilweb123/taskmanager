# Task Management App

**Live Demo:** [https://taskmanager-zeta-gilt.vercel.app/](https://taskmanager-zeta-gilt.vercel.app/)

## 1. Project Overview
This is a full-stack Task Management CRUD (Create, Read, Update, Delete) application designed to help users organize their daily tasks efficiently.

The project was built using **Next.js (App Router)** and **Supabase** to demonstrate a modern, serverless architecture. Next.js was chosen for its powerful server-side rendering and routing capabilities, while Supabase provides a scalable, real-time backend-as-a-service (BaaS) that simplifies database management and API integration. This combination allows for a performant, maintainable, and rapid development workflow.

## 2. Tech Stack

- **Next.js (App Router):** A React framework that enables server-side rendering, static site generation, and robust routing using the latest App Router architecture.
- **Supabase:** An open-source Firebase alternative providing a PostgreSQL database, instant APIs, and real-time capabilities.
- **Vercel:** A cloud platform for static sites and Serverless Functions, used for seamless deployment of the Next.js application.

## 3. Setup Instructions

### Prerequisites
- **Node.js**: Version 18 or higher is recommended.
- **npm** or **yarn**: Package manager for installing dependencies.
- **Supabase account**: To create the backend project and database.

### Steps to Run Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskmanager-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env.local` file**
   Create a file named `.env.local` in the root directory of the project.

4. **Add required environment variables**
   Copy the keys from your Supabase project settings and add them to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: The unique URL for your Supabase project's API.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The public API key that allows the client to interact with the Supabase database safely (respecting Row Level Security policies).

## 4. Database Design

### Table: `tasks`

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key. Unique identifier for each task. |
| `title` | `text` | The main heading or name of the task. |
| `description` | `text` | Detailed information about the task. |
| `status` | `text` | Current state of the task (e.g., 'Pending', 'Completed'). |
| `created_at` | `timestamp` | The date and time when the task was created. |

## 5. Features Implemented

- **Add new tasks:** Users can create tasks with a title and description.
- **View all tasks:** Displays a list of all tasks, categorized or ordered by creation time.
- **Edit task title and status:** Users can update the details of an existing task.
- **Delete tasks:** Remove tasks that are no longer needed.
- **Mark tasks as completed or pending:** Quick toggle to update task status.
- **Basic validation:** Ensures required fields (like title) are not empty before submission.
- **Responsive UI:** The application is mobile-friendly and adapts to different screen sizes.

## 6. Challenges Faced

- **Supabase environment variable issues:** Initially, there were challenges in ensuring the environment variables were correctly exposed to the browser. This was resolved by prefixing them with `NEXT_PUBLIC_` so Next.js knows to inline them during the build process.
- **Handling client-side and server-side logic:** Using the App Router required a clear distinction between Server Components and Client Components. This was managed by adding the `'use client'` directive to components that require interactivity (like forms and buttons) while keeping data fetching efficient on the server where possible.
- **Managing async data fetching:** Ensuring the UI stays responsive while waiting for database operations involved using proper `async/await` patterns and loading states to provide feedback to the user.
- **Deployment Build Errors:** Encountered "Module not found: Can't resolve 'bufferutil'" errors during Vercel deployment due to optional dependencies in the `ws` library used by Supabase. This was resolved by configuring `next.config.js` to ignore these Node.js-specific modules on the client-side build and installing them for the server-side.

## 7. Improvements (Optional)

- **Authentication:** Implement Supabase Auth to allow users to have private task lists.
- **Pagination or filtering:** Add features to sort tasks by date, status, or search by keyword.
- **Better UI/UX:** Add animations, drag-and-drop reordering, and dark mode support.
- **Row Level Security (RLS):** Secure the database so users can only access their own data (requires Auth).
- **Optimistic updates:** Update the UI immediately before the server response to make the app feel faster.
