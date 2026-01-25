'use client';

import { useState, useTransition, useEffect } from 'react';
import { deleteTask, toggleTaskStatus, updateTask } from '@/app/actions';
import { formatUTCTimestamp } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Trash2, Edit2, Save, X, Check } from 'lucide-react';
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

export function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'toggle' | 'update' | 'delete' | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Format date on client side only to avoid hydration mismatch
    // Use utility function to ensure proper UTC to local timezone conversion
    setFormattedDate(formatUTCTimestamp(task.created_at));
  }, [task.created_at]);

  const handleToggleStatus = () => {
    setActionError(null);
    setActionType('toggle');
    startTransition(async () => {
      const result = await toggleTaskStatus(task.id, task.status);

      if (!result.success) {
        const errorMsg = result.error || 'Failed to update task status';
        setActionError(errorMsg);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMsg,
        });
      } else {
        toast({
          title: 'Success',
          description: `Task marked as ${task.status === 'pending' ? 'completed' : 'pending'}`,
        });
        router.refresh();
      }
      setActionType(null);
    });
  };

  const handleDelete = () => {
    setActionError(null);
    setActionType('delete');
    startTransition(async () => {
      const result = await deleteTask(task.id);

      if (!result.success) {
        const errorMsg = result.error || 'Failed to delete task';
        setActionError(errorMsg);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMsg,
        });
      } else {
        toast({
          title: 'Success',
          description: 'Task deleted successfully',
        });
        router.refresh();
      }
      setActionType(null);
    });
  };

  const handleSave = () => {
    setActionError(null);

    if (!editTitle.trim()) {
      const errorMsg = 'Task title is required';
      setActionError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: errorMsg,
      });
      return;
    }

    setActionType('update');
    startTransition(async () => {
      const result = await updateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });

      if (!result.success) {
        const errorMsg = result.error || 'Failed to update task';
        setActionError(errorMsg);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMsg,
        });
      } else {
        toast({
          title: 'Success',
          description: 'Task updated successfully',
        });
        setIsEditing(false);
        router.refresh();
      }
      setActionType(null);
    });
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor={`edit-title-${task.id}`} className="text-sm font-medium">
                Title
              </label>
              <Input
                id={`edit-title-${task.id}`}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={`edit-description-${task.id}`} className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id={`edit-description-${task.id}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                disabled={isPending}
                rows={3}
              />
            </div>
            {actionError && actionType === 'update' && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-2 text-sm text-destructive">
                {actionError}
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isPending} size="sm">
                {isPending && actionType === 'update' ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button onClick={handleCancel} disabled={isPending} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                    {task.status}
                  </Badge>
                </div>
                {task.description && (
                  <p className={`text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                    {task.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Created: {formattedDate || 'Loading...'}
                </p>
              </div>
            </div>
            {actionError && actionType === 'toggle' && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-2 text-sm text-destructive mb-2">
                {actionError}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleToggleStatus}
                disabled={isPending}
                variant={task.status === 'completed' ? 'outline' : 'default'}
                size="sm"
              >
                {isPending && actionType === 'toggle' ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(true);
                  setActionError(null);
                }}
                disabled={isPending}
                variant="outline"
                size="sm"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isPending} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the task.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending && actionType === 'delete'}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isPending && actionType === 'delete'}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isPending && actionType === 'delete' ? (
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
