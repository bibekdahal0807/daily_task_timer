# Supabase Integration - Fixed!

## ✅ What Was Fixed:

1. **Column Names**: Changed `totalTime` → `total_time` (snake_case for PostgreSQL)
2. **Data Conversion**: 
   - Save: Convert milliseconds → seconds (`totalTime / 1000`)
   - Load: Convert seconds → milliseconds (`total_time * 1000`)
3. **Error Logging**: Added detailed console logs for all operations
4. **Removed localStorage**: Now uses Supabase only
5. **UUID**: Using `crypto.randomUUID()` for task IDs

## 🔧 Setup Steps:

### 1. Run SQL in Supabase SQL Editor:

```sql
DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  total_time BIGINT DEFAULT 0,
  cycles JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_date ON tasks(date);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
CREATE POLICY "Allow all operations on tasks" 
ON tasks 
FOR ALL 
USING (true) 
WITH CHECK (true);
```

### 2. Verify Table:
- Go to **Table Editor**
- Check `tasks` table exists
- Verify columns: `id`, `name`, `date`, `total_time`, `cycles`, `created_at`

### 3. Run App:
```bash
npm start
```

### 4. Test:
1. Add a task
2. Start timer
3. Stop timer
4. Check Supabase **Table Editor** → `tasks` table
5. You should see your data!

## 🐛 Debugging:

### Check Console Logs:
- "Fetching tasks from Supabase..." - On load
- "Upserting tasks to Supabase..." - On save
- "Upsert result:" - After each save

### If No Data Appears:

1. **Check RLS Policy**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'tasks';
   ```
   Should show policy with `permissive = true`

2. **Test Direct Insert**:
   ```sql
   INSERT INTO tasks (id, name, date, total_time, cycles)
   VALUES (
     gen_random_uuid(),
     'Test Task',
     '2024-01-25',
     120,
     '[]'::jsonb
   );
   ```

3. **Check Errors**:
   - Open browser console (F12)
   - Look for red error messages
   - Check "Supabase upsert error:" logs

### Common Errors:

**"new row violates row-level security policy"**
→ RLS policy not set correctly. Run the policy SQL again.

**"column 'totalTime' does not exist"**
→ Using wrong column name. Should be `total_time`.

**"Failed to fetch"**
→ Check Supabase URL and anon key in `supabase.js`.

## 📊 Data Structure:

### In App (JavaScript):
```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Daily task timer",
  date: "2024-01-25",
  totalTime: 33000, // milliseconds
  cycles: [
    {
      startTime: 1706174160000,
      endTime: 1706174181000,
      duration: 21 // seconds
    }
  ]
}
```

### In Supabase (PostgreSQL):
```sql
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Daily task timer",
  date: "2024-01-25",
  total_time: 33, -- seconds
  cycles: [
    {
      "startTime": 1706174160000,
      "endTime": 1706174181000,
      "duration": 21
    }
  ],
  created_at: "2024-01-25T09:36:00Z"
}
```

## ✅ Verification:

After adding a task and running timer:

1. **Console should show**:
   ```
   Upserting tasks to Supabase: [...]
   Upsert result: [...]
   ```

2. **Supabase Table Editor should show**:
   - Row with your task
   - `total_time` with seconds value
   - `cycles` with JSON array

3. **Analytics should display**:
   - Total Time: HH:MM:SS
   - Cycles count
   - Cycle history with timestamps

## 🎯 Success Criteria:

✅ Task appears in Supabase Table Editor immediately after creation
✅ Timer updates save to database
✅ Cycles array populates with each start/stop
✅ Data persists after page refresh
✅ Analytics shows correct totals
✅ Past dates show historical data

If all checks pass, your integration is working correctly!
