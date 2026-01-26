'use client';

import { useState, useTransition } from 'react';
import { createTask } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Task } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  onSuccess?: () => void;
  showCard?: boolean;
  defaultStatus?: Task['status'];
}

export function TaskForm({ onSuccess, showCard = true, defaultStatus = 'pending' }: TaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>(defaultStatus);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      const errorMsg = 'Task title is required';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: errorMsg,
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);

    startTransition(async () => {
      const result = await createTask(formData);

      if (!result.success) {
        const errorMsg = result.error || 'Failed to create task';
        setError(errorMsg);
        toast({
          variant: 'destructive',
          title: 'Error Creating Task',
          description: errorMsg,
        });
      } else {
        toast({
          title: 'Success',
          description: 'Task created successfully',
        });
        setTitle('');
        setDescription('');
        setStatus(defaultStatus);
        setError(null);
        // Refresh the page to show the new task
        router.refresh();
        // Call onSuccess callback if provided (e.g., to close dialog)
        onSuccess?.();
      }
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="title" className="text-xs font-normal text-muted-foreground">
          Title <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          placeholder="Enter task title"
          disabled={isPending}
          required
          className={cn(
            "text-sm font-normal",
            error && 'border-destructive'
          )}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-xs font-normal text-muted-foreground">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          disabled={isPending}
          rows={3}
          className="text-sm font-normal resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="status" className="text-xs font-normal text-muted-foreground">
          Status
        </label>
        <Select value={status} onValueChange={(value: Task['status']) => setStatus(value)} disabled={isPending}>
          <SelectTrigger id="status" className="text-sm font-normal">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">To-do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onSuccess?.()} 
          disabled={isPending}
          className="flex-1 text-sm font-normal"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isPending} 
          className="flex-1 text-sm font-normal"
        >
          {isPending ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Adding...
            </>
          ) : (
            'Add Task'
          )}
        </Button>
      </div>
    </form>
  );

  if (!showCard) {
    return formContent;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
}
