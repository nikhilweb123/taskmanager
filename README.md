# Task Manager - Full-Stack CRUD Application

A modern, full-stack task management application built with **Next.js 14+**, **Supabase**, and **TypeScript**. This project demonstrates complete CRUD operations with a beautiful, responsive UI.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3+-38B2AC?logo=tailwind-css)

## Features

✅ **Full CRUD Operations**
- Create new tasks with title and description
- Read and display all tasks with filtering
- Update task details and status
- Delete tasks with confirmation dialog

✅ **Task Management**
- Toggle task status (Pending/Completed)
- Edit tasks inline
- Real-time UI updates
- Task statistics dashboard

✅ **Modern UI/UX**
- Clean, responsive design
- Tab-based filtering (All, Pending, Completed)
- Toast notifications for all actions
- Loading states and error handling
- Gradient backgrounds and smooth animations

✅ **Technical Excellence**
- Next.js App Router (Server Components)
- TypeScript for type safety
- Supabase for backend and database
- Server Actions for mutations
- Row Level Security (RLS) policies
- Optimistic UI updates

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Supabase** | Backend as a Service (PostgreSQL) |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Pre-built UI components |
| **Lucide React** | Icon library |

## Database Schema

### Tasks Table

```sql
CREATE TABLE tasks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text DEFAULT '',
  status        text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

**Indexes:**
- `tasks_created_at_idx` - For efficient sorting by creation date
- `tasks_status_idx` - For filtering by status

**Triggers:**
- Auto-update `updated_at` timestamp on record modification

**Row Level Security (RLS):**
- Public access policies for demo purposes
- In production, restrict based on user authentication

## Project Structure

```
task-manager/
├── app/
│   ├── actions.ts          # Server actions for CRUD operations
│   ├── layout.tsx          # Root layout with Toaster
│   ├── page.tsx            # Main page (Server Component)
│   └── globals.css         # Global styles
├── components/
│   ├── task-form.tsx       # Client component for adding tasks
│   ├── task-item.tsx       # Client component for task display/edit
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── .env.local              # Environment variables
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- npm or yarn package manager

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd task-manager

# Install dependencies
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key

### 3. Set Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Setup

The database migration has been applied automatically. If you need to run it manually:

1. Go to Supabase Dashboard > SQL Editor
2. Run the migration from `supabase/migrations/create_tasks_table.sql`

Or use the Supabase CLI:

```bash
supabase db reset
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding a Task

1. Fill in the task title (required)
2. Optionally add a description
3. Click "Add Task"

### Managing Tasks

- **View Tasks**: Use tabs to filter by All, Pending, or Completed
- **Complete Task**: Click "Mark Complete" button
- **Edit Task**: Click "Edit" button, modify details, and save
- **Delete Task**: Click "Delete" button and confirm

### Task Statistics

The dashboard shows:
- Total number of tasks
- Number of pending tasks
- Number of completed tasks

## API Routes (Server Actions)

All mutations are handled through Next.js Server Actions:

### `createTask(formData)`
Creates a new task with title and description.

### `updateTask(id, data)`
Updates task title, description, or status.

### `deleteTask(id)`
Permanently deletes a task.

### `toggleTaskStatus(id, currentStatus)`
Toggles task between pending and completed status.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Deploy to Netlify

1. Connect your repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables
4. Deploy

## Development Challenges

### Challenge 1: Server vs Client Components
**Issue**: Mixing server and client component logic
**Solution**: Used Server Components for data fetching and Client Components for interactivity

### Challenge 2: Real-time Updates
**Issue**: UI not updating after mutations
**Solution**: Implemented `revalidatePath('/')` in Server Actions

### Challenge 3: Type Safety
**Issue**: Ensuring type safety across client and server
**Solution**: Created shared TypeScript types in `lib/supabase.ts`

### Challenge 4: Error Handling
**Issue**: Providing user feedback for errors
**Solution**: Implemented toast notifications with proper error messages

## Future Improvements

### Short-term
- [ ] Add task priorities (Low, Medium, High)
- [ ] Implement task categories/tags
- [ ] Add due dates and reminders
- [ ] Search and advanced filtering
- [ ] Pagination for large task lists

### Medium-term
- [ ] User authentication with Supabase Auth
- [ ] User-specific tasks (multi-tenant)
- [ ] Task sharing and collaboration
- [ ] Dark/light mode toggle
- [ ] Mobile app with React Native

### Long-term
- [ ] Real-time collaboration with Supabase Realtime
- [ ] Task comments and attachments
- [ ] Activity log and analytics
- [ ] Email notifications
- [ ] Integration with calendar apps
- [ ] AI-powered task suggestions

## Performance Optimizations

- **Server Components**: Reduced client-side JavaScript bundle
- **Database Indexing**: Fast queries on created_at and status
- **Optimistic Updates**: Instant UI feedback using transitions
- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component (ready for images)

## Security Features

- **Row Level Security**: Supabase RLS policies protect data
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: React's built-in escaping
- **Environment Variables**: Sensitive data not exposed
- **HTTPS Only**: Enforced in production

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## Support

If you have any questions or run into issues:

1. Check the [Next.js Documentation](https://nextjs.org/docs)
2. Review [Supabase Guides](https://supabase.com/docs/guides)
3. Open an issue on GitHub

---

**Built with ❤️ using Next.js and Supabase**
