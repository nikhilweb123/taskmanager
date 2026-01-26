/*
  # Add In Progress Status
  
  Updates the tasks table to support 'in_progress' status in addition to 'pending' and 'completed'
*/

-- Drop the existing check constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;

-- Add new check constraint with in_progress status
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
  CHECK (status IN ('pending', 'in_progress', 'completed'));
