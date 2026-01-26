'use client';

import { useState, useTransition, useEffect } from 'react';
import { updateTask, deleteTask } from '@/app/actions';
import { formatUTCTimestamp } from '@/lib/date-utils';
import { parseISO, isValid } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import { 
  Trash2, 
  Edit2, 
  MoreVertical,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface KanbanCardProps {
  task: Task;
  onUpdate: () => void;
  isMoving?: boolean;
}

export function KanbanCard({ task, onUpdate, isMoving = false }: KanbanCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setFormattedDate(formatUTCTimestamp(task.created_at));
  }, [task.created_at]);

  const handleStatusChange = (newStatus: Task['status']) => {
    if (newStatus === task.status) return;

    startTransition(async () => {
      const result = await updateTask(task.id, { status: newStatus });

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to update task status',
        });
      } else {
        toast({
          title: 'Success',
          description: `Task moved to ${newStatus.replace('_', ' ')}`,
        });
        router.refresh();
        onUpdate();
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTask(task.id);

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to delete task',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Task deleted successfully',
        });
        router.refresh();
        onUpdate();
      }
    });
  };

  const handleSave = () => {
    if (!editTitle.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Task title is required',
      });
      return;
    }

    startTransition(async () => {
      const result = await updateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to update task',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Task updated successfully',
        });
        setIsEditing(false);
        router.refresh();
        onUpdate();
      }
    });
  };


  // Format date and time to show like "Nov 4, 2:30 PM" or "Today, 2:30 PM"
  const formatDateTime = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (!isValid(date)) return '';
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const diffTime = taskDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      // Format time (e.g., "2:30 PM")
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      const timeStr = `${displayHours}:${displayMinutes} ${ampm}`;
      
      if (diffDays === 0) {
        return `Today, ${timeStr}`;
      } else if (diffDays === -1) {
        return `Yesterday, ${timeStr}`;
      } else if (diffDays === 1) {
        return `Tomorrow, ${timeStr}`;
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${timeStr}`;
      }
    } catch {
      return '';
    }
  };

  const dateTimeStr = formatDateTime(task.created_at);

  const isCompleted = task.status === 'completed';

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.setData('application/json', JSON.stringify(task));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Card 
        draggable={!isMoving}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={cn(
          "group shadow-sm hover:shadow-md transition-all cursor-move bg-white dark:bg-card border border-border/50 hover:border-border relative overflow-hidden",
          isCompleted && "opacity-75",
          isDragging && "shadow-lg opacity-50 scale-95",
          isMoving && "opacity-70 pointer-events-none"
        )}
      >
        {isMoving && (
          <>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer z-10">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
            </div>
            {/* Loading overlay */}
            <div className="absolute inset-0 bg-background/75 backdrop-blur-sm rounded-lg flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-2.5">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full border-3 border-primary/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full border-3 border-primary border-t-transparent animate-spin" />
                  </div>
                </div>
                <span className="text-xs font-medium text-foreground animate-pulse">Moving...</span>
              </div>
            </div>
          </>
        )}
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium leading-tight text-foreground mb-1">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs">
                  <DropdownMenuItem onClick={() => setIsEditing(true)} className="text-xs">
                    <Edit2 className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs">
                          This action cannot be undone. This will permanently delete the task.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending} className="text-xs h-8">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={isPending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs h-8"
                        >
                          {isPending ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {dateTimeStr && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{dateTimeStr}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-xs font-normal">
                Title
              </label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-xs font-normal">
                Description
              </label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                disabled={isPending}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
