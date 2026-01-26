'use client';

import { useState } from 'react';
import { Task } from '@/lib/supabase';
import { KanbanCard } from './kanban-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateTask } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TaskForm } from '@/components/task-form';

interface KanbanColumnProps {
  column: {
    id: Task['status'];
    title: string;
    color: string;
  };
  tasks: Task[];
  onTaskUpdate: () => void;
}

export function KanbanColumn({ column, tasks, onTaskUpdate }: KanbanColumnProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
  const [isProcessingDrop, setIsProcessingDrop] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const taskData = e.dataTransfer.getData('application/json');
    if (!taskData) return;

    try {
      const task: Task = JSON.parse(taskData);
      
      if (task.status === column.id) {
        return; // Task is already in this column
      }

      setIsProcessingDrop(true);
      setMovingTaskId(task.id);

      const result = await updateTask(task.id, { status: column.id });

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to move task',
        });
        setMovingTaskId(null);
        setIsProcessingDrop(false);
      } else {
        toast({
          title: 'Success',
          description: `Task moved to ${column.title}`,
        });
        router.refresh();
        onTaskUpdate();
        // Small delay to show the loading state
        setTimeout(() => {
          setMovingTaskId(null);
          setIsProcessingDrop(false);
        }, 300);
      }
    } catch (error) {
      console.error('Error parsing task data:', error);
      setMovingTaskId(null);
      setIsProcessingDrop(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col flex-1 w-full xl:min-w-0 transition-all bg-[#f8f9fa] dark:bg-slate-900/50 p-3 sm:p-4 rounded-lg min-h-[400px] xl:min-h-[calc(100vh-10rem)]",
      isDraggingOver && "bg-muted/30"
    )}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground">
            {column.title}
          </h2>
          <span className="text-xs border border-border p-1 rounded-full bg-white h-6 w-6 flex items-center justify-center">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Tasks */}
      <div 
        className={cn(
          "flex-1 space-y-3 overflow-y-auto px-2 pb-4 transition-colors min-h-0 relative",
          isProcessingDrop && "opacity-75"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessingDrop && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm rounded-lg flex items-center justify-center z-20 pointer-events-none">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full border-3 border-primary/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium text-foreground">Moving task</span>
                <span className="text-xs text-muted-foreground animate-pulse">Please wait...</span>
              </div>
            </div>
          </div>
        )}
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-4">
              <p className="text-xs text-muted-foreground">
                No tasks currently
              </p>
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard 
              key={task.id} 
              task={task} 
              onUpdate={onTaskUpdate}
              isMoving={movingTaskId === task.id}
            />
          ))
        )}
        
        {/* Create Task Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-dashed border-border rounded-md"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-base">Create New Task</DialogTitle>
              <DialogDescription className="text-xs">
                Add a new task to {column.title}
              </DialogDescription>
            </DialogHeader>
            <TaskForm 
              onSuccess={() => {
                setDialogOpen(false);
                onTaskUpdate();
              }} 
              showCard={false}
              defaultStatus={column.id}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
