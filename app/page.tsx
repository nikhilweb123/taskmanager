import { supabase, Task } from '@/lib/supabase';
import { TaskForm } from '@/components/task-form';
import { TasksContainer } from '@/components/tasks-container';
import { Suspense } from 'react';
import { TaskListSkeleton } from '@/components/task-list-skeleton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTasks(): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      // Return empty array on error - client component will handle error display
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching tasks:', error);
    return [];
  }
}

async function TaskStats() {
  const tasks = await getTasks();
  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="bg-card rounded-lg p-4 border">
        <div className="text-2xl font-bold">{tasks.length}</div>
        <div className="text-xs text-muted-foreground">Total Tasks</div>
      </div>
      <div className="bg-card rounded-lg p-4 border">
        <div className="text-2xl font-bold text-orange-600">
          {pendingTasks.length}
        </div>
        <div className="text-xs text-muted-foreground">Pending</div>
      </div>
      <div className="bg-card rounded-lg p-4 border">
        <div className="text-2xl font-bold text-green-600">
          {completedTasks.length}
        </div>
        <div className="text-xs text-muted-foreground">Completed</div>
      </div>
    </div>
  );
}

export default async function Home() {
  const initialTasks = await getTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Task Manager</h1>
            <p className="text-muted-foreground">
              A full-stack CRUD application built with Next.js and Supabase
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <TaskForm />

            <div className="space-y-4">
              <Suspense
                fallback={
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-card rounded-lg p-4 border animate-pulse"
                      >
                        <div className="h-8 w-12 bg-muted rounded mx-auto mb-2" />
                        <div className="h-4 w-16 bg-muted rounded mx-auto" />
                      </div>
                    ))}
                  </div>
                }
              >
                <TaskStats />
              </Suspense>
            </div>
          </div>

          <Suspense fallback={<TaskListSkeleton count={3} />}>
            <TasksContainer initialTasks={initialTasks} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
