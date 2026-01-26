'use client';

import { useState, useEffect } from 'react';
import { supabase, Task } from '@/lib/supabase';
import { KanbanColumn } from './kanban-column';
import { TaskListSkeleton } from '@/components/task-list-skeleton';
import { ErrorMessage } from '@/components/error-message';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanBoardProps {
  initialTasks: Task[];
}

const columns = [
  { id: 'pending', title: 'To-do', color: 'bg-slate-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'completed', title: 'Completed', color: 'bg-green-500' },
] as const;

interface KanbanBoardWithFilterProps extends KanbanBoardProps {
  filters: Task['status'][];
  dateRange?: { from?: Date; to?: Date };
}

export function KanbanBoard({ initialTasks, filters = [], dateRange }: KanbanBoardWithFilterProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const getTasksByStatus = (status: Task['status']) => {
    let filteredTasks = tasks;

    // Filter by status
    if (filters.length > 0) {
      if (filters.includes(status)) {
        filteredTasks = filteredTasks.filter((task) => task.status === status);
      } else {
        return [];
      }
    } else {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }

    // Filter by date range
    if (dateRange?.from || dateRange?.to) {
      filteredTasks = filteredTasks.filter((task) => {
        const taskDate = new Date(task.created_at);
        taskDate.setHours(0, 0, 0, 0);
        
        if (dateRange.from && dateRange.to) {
          const fromDate = new Date(dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          return taskDate >= fromDate && taskDate <= toDate;
        } else if (dateRange.from) {
          const fromDate = new Date(dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          return taskDate >= fromDate;
        }
        return true;
      });
    }

    return filteredTasks;
  };

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
    <div className="w-full h-full flex flex-col">
      {error && (
        <div className="mb-4">
          <ErrorMessage
            title="Error loading tasks"
            message={error}
            onRetry={fetchTasks}
          />
        </div>
      )}

     
      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden bg-background">
        <div className="h-full w-full">
          <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 p-2 sm:p-4 h-full overflow-y-auto xl:overflow-y-auto xl:overflow-x-hidden">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={getTasksByStatus(column.id)}
                onTaskUpdate={fetchTasks}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
