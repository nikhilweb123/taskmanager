/*
  # Fix Timestamps to use TIMESTAMPTZ

  1. Changes
    - Alter `created_at` and `updated_at` columns in `tasks` table to use `TIMESTAMPTZ` type.
    - This ensures dates are stored in UTC and retrieved with timezone information.
    
  2. Notes
    - Using `USING column::timestamptz` to convert existing data.
    - Setting default to `now()` which returns `timestamptz`.
*/

ALTER TABLE tasks 
ALTER COLUMN created_at TYPE timestamptz USING created_at::timestamptz,
ALTER COLUMN updated_at TYPE timestamptz USING updated_at::timestamptz;

ALTER TABLE tasks ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE tasks ALTER COLUMN updated_at SET DEFAULT now();
