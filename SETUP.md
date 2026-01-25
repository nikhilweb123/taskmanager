# Quick Setup Guide

## Prerequisites

1. Node.js 18+ installed
2. A Supabase account ([sign up free](https://supabase.com))

## Step-by-Step Setup

### 1. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (2-3 minutes)
3. Navigate to **Project Settings** > **API**
4. Copy the following:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Database Setup

The database schema has been automatically created when you cloned this project. If you need to set it up manually:

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy and paste the migration SQL from the README
5. Click **Run**

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Test the Application

1. Add a new task using the form
2. Mark it as completed
3. Edit the task details
4. Delete the task

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

## Troubleshooting

### Build Errors

**Error: Missing Supabase environment variables**

Solution: Make sure `.env.local` exists and contains valid Supabase credentials.

**Error: Invalid supabaseUrl**

Solution: Check that your Supabase URL is properly formatted (should start with `https://` and end with `.supabase.co`)

### Runtime Errors

**Error: Failed to fetch tasks**

Solution:
1. Check that your Supabase project is running
2. Verify RLS policies are correctly set up
3. Check the browser console for detailed error messages

**Error: Cannot connect to database**

Solution:
1. Verify your environment variables are correct
2. Make sure your Supabase project isn't paused (free tier projects pause after inactivity)
3. Check your internet connection

## Support

For issues or questions:
- Check the main [README.md](./README.md)
- Visit [Supabase Documentation](https://supabase.com/docs)
- Visit [Next.js Documentation](https://nextjs.org/docs)
