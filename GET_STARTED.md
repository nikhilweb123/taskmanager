# Get Started in 5 Minutes

## Your Task Manager is Ready!

Everything is built and configured. You just need to connect it to your Supabase database.

## Database Status ✅

Your Supabase database is already configured with:

- **Tasks Table**: Created with id, title, description, status, created_at, updated_at
- **Row Level Security**: Enabled with public access policies
- **Indexes**: Performance indexes on created_at and status
- **Triggers**: Auto-updating timestamps

## Step 1: Get Your Supabase Credentials

### If you already have a Supabase project:

1. Go to https://app.supabase.com
2. Open your project
3. Click the **Settings** icon (gear) in the sidebar
4. Click **API** in the settings menu
5. Copy these two values:
   - **Project URL** (under "Config" section)
   - **anon public key** (under "Project API keys" section)

### If you need to create a new Supabase project:

1. Go to https://supabase.com
2. Click **Start your project**
3. Sign in with GitHub
4. Click **New Project**
5. Fill in:
   - Project name: task-manager
   - Database password: (create a strong password)
   - Region: (choose closest to you)
6. Click **Create new project**
7. Wait 2-3 minutes for setup to complete
8. Once ready, follow the steps above to get your credentials

## Step 2: Configure Your App

Create a file named `.env.local` in the project root:

```bash
# Copy this template and replace with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx.xxxxx
```

**Important**:
- The URL must start with `https://` and end with `.supabase.co`
- The anon key is a long JWT token that starts with `eyJ`

## Step 3: Run the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 4: Test the Features

1. **Create a task**: Fill in the form and click "Add Task"
2. **View tasks**: See your task appear in the list
3. **Mark complete**: Click "Mark Complete" to toggle status
4. **Edit task**: Click "Edit", modify details, and save
5. **Filter tasks**: Use tabs to filter by All/Pending/Completed
6. **Delete task**: Click "Delete" and confirm

## Troubleshooting

### "Missing Supabase environment variables"

**Problem**: The `.env.local` file doesn't exist or is empty.

**Solution**: Create the file with your credentials from Step 2.

### "Failed to fetch tasks"

**Problem**: Supabase credentials are incorrect or project is paused.

**Solution**:
1. Double-check your credentials match exactly (no extra spaces)
2. Verify your Supabase project is active (free projects pause after 1 week of inactivity)
3. Check the browser console for detailed error messages

### Build fails with Supabase error

**Problem**: Environment variables aren't loaded during build.

**Solution**: Make sure `.env.local` exists before running `npm run build`.

## What's Next?

Once you have the app running:

1. **Customize the UI**: Edit components in `components/` folder
2. **Add authentication**: Implement Supabase Auth for user accounts
3. **Add features**: Check `README.md` for ideas
4. **Deploy**: Follow deployment guide in `README.md`

## Quick Reference

### File Structure
```
app/
  actions.ts       - Server actions for CRUD operations
  page.tsx         - Main page (Server Component)
  layout.tsx       - Root layout
components/
  task-form.tsx    - Create task form
  task-item.tsx    - Task display/edit
lib/
  supabase.ts      - Supabase client config
```

### Database Schema
```typescript
type Task = {
  id: string;                      // UUID, auto-generated
  title: string;                   // Required
  description: string;             // Optional, default ''
  status: 'pending' | 'completed'; // Default 'pending'
  created_at: string;              // Auto-generated timestamp
  updated_at: string;              // Auto-updated timestamp
}
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Need Help?

- **Full Documentation**: See `README.md`
- **Setup Guide**: See `SETUP.md`
- **Project Overview**: See `PROJECT_SUMMARY.md`
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Your Database is Ready!

The migration has already been applied to your Supabase database with this structure:

**Table: tasks**
- id: uuid (primary key, auto-generated)
- title: text (required)
- description: text (optional)
- status: text (pending/completed, default: pending)
- created_at: timestamptz (auto-generated)
- updated_at: timestamptz (auto-updated)

**Security**: Row Level Security (RLS) enabled with public access policies

**Performance**: Indexes on created_at and status columns

All you need to do is add your credentials and start using it!
