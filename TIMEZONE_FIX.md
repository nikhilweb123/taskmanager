# Timezone Fix Documentation

This document describes the comprehensive timezone fix applied to ensure all timestamps are stored in UTC and displayed correctly in the user's local timezone.

## Problem

Timestamps were showing 20-30 minutes off from the current local time. This was caused by:
1. Potential use of `timestamp` instead of `timestamptz` in the database
2. Timezone conversion issues in the frontend
3. Missing explicit UTC handling

## Solution

### 1. Database Migration

**File**: `supabase/migrations/20260126000000_ensure_all_timestamps_are_timestamptz.sql`

This migration:
- Ensures database timezone is set to UTC
- Checks all tables for `timestamp` columns and converts them to `timestamptz`
- Updates all timestamp defaults to use `now()` (which returns UTC `timestamptz`)
- Updates the trigger function to explicitly use UTC
- Safely converts existing data using `USING column::timestamptz`

**To apply the migration:**
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration SQL
4. Run the query

**To verify the migration worked:**
Run this query in Supabase SQL Editor:
```sql
SELECT 
  table_name,
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE data_type IN ('timestamp without time zone', 'timestamp with time zone')
ORDER BY table_name, column_name;
```

All timestamp columns should show `timestamp with time zone`.

### 2. Frontend Date Formatting

**File**: `lib/date-utils.ts`

Created utility functions for consistent date formatting:
- `formatUTCTimestamp()` - Formats UTC timestamps to local timezone
- `formatRelativeTime()` - Formats timestamps as relative time (e.g., "2 hours ago")

**File**: `components/task-item.tsx`

Updated to use the new utility function for consistent timezone handling.

### 3. Backend/API

No changes needed - the backend correctly relies on database defaults:
- `created_at` and `updated_at` are set automatically by the database
- The trigger function `update_updated_at_column()` uses `now()` which returns UTC
- No manual timestamp manipulation in `app/actions.ts`

## How It Works

1. **Database Storage**: All timestamps are stored as `timestamptz` in UTC
2. **Database Defaults**: `now()` returns UTC timestamptz
3. **API Response**: Supabase returns timestamps as ISO 8601 strings (e.g., `2026-01-26T12:00:00.000Z`)
4. **Frontend Display**: `parseISO()` from `date-fns` correctly parses UTC timestamps and converts them to the user's local timezone when formatting

## Testing

After applying the migration:

1. **Check Database**:
   ```sql
   -- Verify column types
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'tasks' 
   AND column_name IN ('created_at', 'updated_at');
   ```

2. **Test Timestamp Creation**:
   - Create a new task
   - Check the `created_at` value in Supabase dashboard
   - Verify it matches the current UTC time

3. **Test Frontend Display**:
   - View a task in the UI
   - Verify the displayed time matches your local timezone
   - The time should be correct (not 20-30 minutes off)

## Key Points

- ✅ All timestamps stored in UTC (`timestamptz`)
- ✅ Database defaults use `now()` (UTC)
- ✅ Frontend correctly converts UTC to local timezone
- ✅ No manual timezone offsets in code
- ✅ Consistent date formatting across the app

## Troubleshooting

If timestamps are still incorrect:

1. **Verify Migration Applied**:
   - Check that all timestamp columns are `timestamptz`
   - Verify database timezone is UTC

2. **Check Supabase Settings**:
   - Go to Project Settings → Database
   - Verify timezone is set to UTC

3. **Test with a New Record**:
   - Create a new task
   - Check both database value and frontend display
   - Database should show UTC, frontend should show local time

4. **Browser Timezone**:
   - Ensure your browser/system timezone is correct
   - The frontend uses the browser's timezone for display

## Additional Notes

- The migration is idempotent - it's safe to run multiple times
- Existing data is preserved during the conversion
- The `USING column::timestamptz` clause safely converts existing `timestamp` values to `timestamptz`
