'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; code?: string };

/**
 * Converts Supabase errors to user-friendly messages
 */
function getErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';

  // Network/connection errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Database constraint errors
  if (error.code === '23505') {
    return 'This task already exists.';
  }

  if (error.code === '23503') {
    return 'Invalid reference. The task may have been deleted.';
  }

  // Permission errors
  if (error.code === '42501' || error.message?.includes('permission')) {
    return 'You do not have permission to perform this action.';
  }

  // Not found errors
  if (error.code === 'PGRST116' || error.message?.includes('not found')) {
    return 'Task not found. It may have been deleted.';
  }

  // Rate limiting
  if (error.code === 'PGRST301' || error.message?.includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  // Generic Supabase errors
  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = (formData.get('status') as 'pending' | 'in_progress' | 'completed') || 'pending';

    if (!title || title.trim().length === 0) {
      return {
        success: false,
        error: 'Task title is required',
        code: 'VALIDATION_ERROR',
      };
    }

    const { error } = await supabase
      .from('tasks')
      .insert([{ title: title.trim(), description: description?.trim() || '', status }]);

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        code: error.code,
      };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function updateTask(
  id: string,
  data: { title?: string; description?: string; status?: string }
): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Task ID is required',
        code: 'VALIDATION_ERROR',
      };
    }

    const { error } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', id);

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        code: error.code,
      };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteTask(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Task ID is required',
        code: 'VALIDATION_ERROR',
      };
    }

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        code: error.code,
      };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function toggleTaskStatus(
  id: string,
  currentStatus: string
): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Task ID is required',
        code: 'VALIDATION_ERROR',
      };
    }

    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        code: error.code,
      };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
