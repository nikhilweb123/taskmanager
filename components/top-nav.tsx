'use client';

import { useState, useEffect } from 'react';
import { Plus, Filter, ChevronDown, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { TaskForm } from '@/components/task-form';
import { Task } from '@/lib/supabase';
import { useFilter } from '@/components/filter-provider';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const filterLabels: Record<Task['status'], string> = {
  pending: 'To-do',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const filterColors: Record<Task['status'], string> = {
  pending: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800',
  completed: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800',
};

export function TopNav() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [numberOfMonths, setNumberOfMonths] = useState(2);
  const { filters, toggleFilter, removeFilter, dateRange, setDateRange } = useFilter();

  useEffect(() => {
    const updateMonths = () => {
      setNumberOfMonths(window.innerWidth >= 768 ? 2 : 1);
    };
    updateMonths();
    window.addEventListener('resize', updateMonths);
    return () => window.removeEventListener('resize', updateMonths);
  }, []);

  const formatDateRange = () => {
    if (!dateRange?.from) return null;
    if (dateRange.from && !dateRange.to) {
      return format(dateRange.from, 'MMM d');
    }
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`;
    }
    return null;
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex items-center justify-between h-14 px-3 sm:px-4 lg:px-6">
        {/* Left side - Logo */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden sm:inline">Workspace</span>
          <span className="text-sm font-medium sm:hidden">WS</span>
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Selected Filters as Badges - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex items-center gap-2 mr-2 flex-wrap max-w-md overflow-x-auto">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant="outline"
                className={cn(
                  "rounded-full text-xs font-normal border flex items-center gap-1.5",
                  filterColors[filter]
                )}
              >
                {filterLabels[filter]}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter(filter);
                  }}
                  className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            
            {/* Date Range Badge */}
            {dateRange?.from && (
              <Badge
                variant="outline"
                className="rounded-full text-xs font-normal border flex items-center gap-1.5 bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800"
              >
                <Calendar className="h-3 w-3" />
                {formatDateRange()}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateRange(undefined);
                  }}
                  className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
          
          {/* Date Range Picker - Icon only on mobile */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 flex items-center text-[13px] font-normal">
                <Calendar className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Filter by date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range?.from && range?.to) {
                    setDatePickerOpen(false);
                  }
                }}
                numberOfMonths={numberOfMonths}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(23, 59, 59, 999);
                  return date > today;
                }}
              />
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-[13px] font-normal">
                <Filter className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className="h-3 w-3 sm:ml-1.5 hidden sm:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={filters.includes('pending')}
                onCheckedChange={() => toggleFilter('pending')}
              >
                To-do
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.includes('in_progress')}
                onCheckedChange={() => toggleFilter('in_progress')}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.includes('completed')}
                onCheckedChange={() => toggleFilter('completed')}
              >
                Completed
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 text-xs font-normal bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] mx-4">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-base font-normal">Create New Task</DialogTitle>
                <DialogDescription className="text-xs font-normal text-muted-foreground">
                  Add a new task to your Kanban board
                </DialogDescription>
              </DialogHeader>
              <TaskForm onSuccess={() => setDialogOpen(false)} showCard={false} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Mobile Filter Badges - Shown below nav on mobile */}
      {(filters.length > 0 || dateRange?.from) && (
        <div className="md:hidden px-3 py-2 border-t flex items-center gap-2 overflow-x-auto">
          {filters.map((filter) => (
            <Badge
              key={filter}
              variant="outline"
              className={cn(
                "rounded-full text-xs font-normal border flex items-center gap-1.5 flex-shrink-0",
                filterColors[filter]
              )}
            >
              {filterLabels[filter]}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter(filter);
                }}
                className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {dateRange?.from && (
            <Badge
              variant="outline"
              className="rounded-full text-xs font-normal border flex items-center gap-1.5 bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800 flex-shrink-0"
            >
              <Calendar className="h-3 w-3" />
              {formatDateRange()}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDateRange(undefined);
                }}
                className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </nav>
  );
}
