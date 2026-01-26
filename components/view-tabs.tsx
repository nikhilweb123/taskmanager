'use client';

import { Columns, List, GanttChart, Calendar, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const views = [
  { id: 'board', label: 'Board', icon: Columns },
  { id: 'list', label: 'List', icon: List },
  { id: 'gantt', label: 'Gantt', icon: GanttChart },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'table', label: 'Table', icon: Table },
];

export function ViewTabs() {
  const activeView = 'board';

  return (
    <div className="flex items-center gap-1 border-b">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <Button
            key={view.id}
            variant="ghost"
            size="sm"
            className={cn(
              'h-9 text-xs font-normal rounded-none border-b-2 border-transparent',
              activeView === view.id
                ? 'border-primary text-foreground bg-transparent'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-3.5 w-3.5 mr-1.5" />
            {view.label}
          </Button>
        );
      })}
    </div>
  );
}
