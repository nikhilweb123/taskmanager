'use client';

import { useFilter } from '@/components/filter-provider';
import { TopNav } from '@/components/top-nav';
import { KanbanBoard } from '@/components/kanban-board';
import { Task } from '@/lib/supabase';

export function FilteredTopNav() {
  return <TopNav />;
}

export function FilteredKanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const { filters, dateRange } = useFilter();
  return <KanbanBoard initialTasks={initialTasks} filters={filters} dateRange={dateRange} />;
}
