'use client';

import { useState, useEffect } from 'react';
import { supabase, Task } from '@/lib/supabase';
import { TaskItem } from '@/components/task-item';
import { TaskListSkeleton } from '@/components/task-list-skeleton';
import { ErrorMessage } from '@/components/error-message';
import { EmptyState } from '@/components/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckSquare, ListTodo } from 'lucide-react';

interface TasksContainerProps {
  initialTasks: Task[];
}

export function TasksContainer({ initialTasks }: TasksContainerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with initialTasks when they change (from router.refresh())
  useEffect(() => {
    setTasks(initialTasks);
    setError(null);
  }, [initialTasks]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setTasks(data || []);
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err?.message?.includes('fetch') || err?.message?.includes('network')
          ? 'Unable to load tasks. Check your connection and try again.'
          : err?.message || 'Failed to load tasks. Please try again.';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  if (isLoading && tasks.length === 0) {
    return <TaskListSkeleton count={3} />;
  }

  if (error && tasks.length === 0) {
    return (
      <ErrorMessage
        title="Unable to load tasks"
        message={error}
        onRetry={fetchTasks}
      />
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4">
          <ErrorMessage
            title="Error loading tasks"
            message={error}
            onRetry={fetchTasks}
          />
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="pending">
            <ListTodo className="h-4 w-4 mr-2" />
            Pending ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckSquare className="h-4 w-4 mr-2" />
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {tasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="No tasks yet"
              description="Create your first task to get started! Click the form above to add a new task."
            />
          ) : (
            tasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingTasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No pending tasks"
              description="Great job! All your tasks are completed. Create a new task to get started."
            />
          ) : (
            pendingTasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedTasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="No completed tasks yet"
              description="Start completing your tasks to see them here!"
            />
          ) : (
            completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
