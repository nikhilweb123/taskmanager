# Task Management App

**Live Demo:** [https://taskmanager-zeta-gilt.vercel.app/](https://taskmanager-zeta-gilt.vercel.app/)

## 1. Project Overview
This is a professional, full-stack Task Management Dashboard designed to help users organize their daily tasks efficiently with a modern, responsive user interface.

The project was built using **Next.js (App Router)** and **Supabase** to demonstrate a scalable, serverless architecture. The UI has been significantly enhanced using **Shadcn UI** and **Tailwind CSS**, providing a polished, accessible, and interactive experience.

## 2. Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (based on [Radix UI](https://www.radix-ui.com/))
- **Icons:** [Lucide React](https://lucide.dev/)
- **Date Handling:** [date-fns](https://date-fns.org/)
- **Deployment:** [Vercel](https://vercel.com/)

## 3. Setup Instructions

### Prerequisites
- **Node.js**: Version 18 or higher.
- **npm**: Package manager.
- **Supabase account**: For the backend database.

### Steps to Run Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskmanager-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env.local` file**
   Create a file named `.env.local` in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 4. Database Design

### Table: `tasks`

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key. Unique identifier. |
| `title` | `text` | The task name (Required). |
| `description` | `text` | Detailed info (Optional). |
| `status` | `text` | 'pending' or 'completed'. |
| `created_at` | `timestamp` | Creation timestamp (default: now()). |

## 5. Features Implemented

### 🎯 Dashboard & Task Management
- **Modern Dashboard Layout:** A clean, single-page interface with a sticky header and consolidated task view.
- **Create Task Modal:** Add tasks quickly via a dialog popup without losing context or page reloads.
- **CRUD Operations:** Full capability to Create, Read, Update, and Delete tasks.

### 🔍 Filtering, Sorting & Search
- **Status Filtering:** Tab-based filtering for **All**, **Pending**, and **Completed** tasks with live counts.
- **Time-Based Filtering:** Filter tasks by **All Time**, **Today**, or **Last 7 Days** using `date-fns`.
- **Sorting:** Toggle between **Newest First** and **Oldest First**.
- **Live Search:** Filter tasks instantly by title or description keyword.

### 🎨 UI/UX Enhancements
- **Shadcn UI Integration:** Utilizes robust components like `Select`, `Tabs`, `Dialog`, `Card`, and `Input`.
- **Visual Feedback:** 
  - Loading skeletons for smooth initial page loads.
  - Informative empty states when no tasks match filters.
  - Toast notifications for success/error actions.
  - Status badges (Green for Completed, Orange for Pending).
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop screens.

## 6. Challenges Faced

- **Supabase Environment Variables:** Ensuring variables were correctly exposed to the browser (`NEXT_PUBLIC_` prefix) for client-side connection.
- **Component Architecture:** Integrating Shadcn UI components required careful setup of `tailwind.config.ts` and utility functions (`cn`) to ensure styles merged correctly without conflicts.
- **Client vs. Server Components:** managing state for filters/search on the client side (`use client`) while keeping the initial data fetch efficient on the server.
- **Deployment Build Errors:** Resolved "Module not found: Can't resolve 'bufferutil'" errors on Vercel by configuring `next.config.js` to handle optional dependencies in the `ws` library.

## 7. Future Improvements

- **Authentication:** Implement Supabase Auth for user-specific task lists.
- **Drag & Drop:** Allow users to reorder tasks manually.
- **Dark Mode Toggle:** A user-facing switch to toggle between light and dark themes (codebase supports it).
- **Categories/Tags:** Add a tagging system for better organization.
