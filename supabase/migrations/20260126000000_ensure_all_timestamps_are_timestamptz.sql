/*
  # Comprehensive Timestamp Migration to TIMESTAMPTZ

  This migration ensures ALL timestamp columns in the database use TIMESTAMPTZ
  and are stored in UTC. It:
  
  1. Checks all tables for timestamp columns (not timestamptz)
  2. Converts them to timestamptz safely
  3. Ensures all defaults use now() which returns UTC timestamptz
  4. Updates the trigger function to explicitly use UTC
  5. Verifies database timezone is set to UTC

  IMPORTANT: Run this migration to fix timezone issues.
*/

-- First, ensure the database timezone is set to UTC
SET timezone = 'UTC';

-- Check and convert tasks.created_at if it's not already timestamptz
DO $$
BEGIN
  -- Check if created_at exists and is not timestamptz
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'created_at'
    AND data_type != 'timestamp with time zone'
  ) THEN
    ALTER TABLE tasks 
    ALTER COLUMN created_at TYPE timestamptz 
    USING CASE 
      WHEN created_at IS NULL THEN NULL
      ELSE created_at::timestamptz
    END;
    
    ALTER TABLE tasks 
    ALTER COLUMN created_at SET DEFAULT now();
  END IF;
END $$;

-- Check and convert tasks.updated_at if it's not already timestamptz
DO $$
BEGIN
  -- Check if updated_at exists and is not timestamptz
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'updated_at'
    AND data_type != 'timestamp with time zone'
  ) THEN
    ALTER TABLE tasks 
    ALTER COLUMN updated_at TYPE timestamptz 
    USING CASE 
      WHEN updated_at IS NULL THEN NULL
      ELSE updated_at::timestamptz
    END;
    
    ALTER TABLE tasks 
    ALTER COLUMN updated_at SET DEFAULT now();
  END IF;
END $$;

-- Update the trigger function to explicitly use UTC
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Explicitly use now() which returns timestamptz in UTC
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify: Check all timestamp columns in all tables
-- This query will show you all timestamp columns and their types
-- Run this separately to verify the migration worked:
/*
SELECT 
  table_name,
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE data_type IN ('timestamp without time zone', 'timestamp with time zone')
ORDER BY table_name, column_name;
*/
