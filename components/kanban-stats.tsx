'use client';

import { Task } from '@/lib/supabase';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KanbanStatsProps {
  tasks: Task[];
}

export function KanbanStats({ tasks }: KanbanStatsProps) {
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const total = tasks.length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold mt-1">{total}</p>
            </div>
            <Circle className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">To Do</p>
              <p className="text-2xl font-bold mt-1 text-slate-600 dark:text-slate-400">
                {pending}
              </p>
            </div>
            <Circle className="h-8 w-8 text-slate-500 opacity-50" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {inProgress}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {completed}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
