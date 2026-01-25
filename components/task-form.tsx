'use client';

import { useState, useTransition } from 'react';
import { createTask } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function TaskForm() {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
        setError(null);
        // Refresh the page to show the new task
        router.refresh();
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
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
              className={error ? 'border-destructive' : ''}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              disabled={isPending}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Adding Task...
              </>
            ) : (
              'Add Task'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
