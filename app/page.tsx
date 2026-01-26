import { supabase, Task } from '@/lib/supabase';
import { Sidebar } from '@/components/sidebar';
import { FilterProvider } from '@/components/filter-provider';
import { Suspense } from 'react';
import { TaskListSkeleton } from '@/components/task-list-skeleton';
import { FilteredTopNav, FilteredKanbanBoard } from '@/components/filtered-components';

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
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching tasks:', error);
    return [];
  }
}

export default async function Home() {
  const initialTasks = await getTasks();

  return (
    <FilterProvider>
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-64">
          <FilteredTopNav />
          <main className="flex-1 overflow-hidden">
            <Suspense fallback={<TaskListSkeleton count={3} />}>
              <FilteredKanbanBoard initialTasks={initialTasks} />
            </Suspense>
          </main>
        </div>
      </div>
    </FilterProvider>
  );
}

