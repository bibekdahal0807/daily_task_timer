# Supabase Setup Instructions

## Step 1: Create Supabase Account & Project

1. Go to [Supabase](https://supabase.com/)
2. Click "Start your project" or "Sign In"
3. Sign up with GitHub, Google, or email
4. Click "New Project"
5. Fill in:
   - **Name**: `daily-task-timer`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free (includes 500MB database, 2GB bandwidth)
6. Click "Create new project"
7. Wait 2-3 minutes for project setup

## Step 2: Get API Credentials

1. In your project dashboard, go to **Settings** (gear icon) > **API**
2. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
3. **Copy both values!**

## Step 3: Update supabase.js

1. Open `src/supabase.js`
2. Replace the placeholder values:

```javascript
const supabaseUrl = 'https://xxxxxxxxxxxxx.supabase.co'; // Your Project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your anon public key
```

## Step 4: Create Database Table

1. In Supabase dashboard, go to **Table Editor** (left sidebar)
2. Click "Create a new table"
3. Fill in:
   - **Name**: `tasks`
   - **Description**: Task tracking data
   - **Enable Row Level Security (RLS)**: ✅ Check this
4. Add columns:

| Name | Type | Default Value | Primary | Nullable |
|------|------|---------------|---------|----------|
| id | int8 | - | ✅ Yes | ❌ No |
| name | text | - | ❌ No | ❌ No |
| date | text | - | ❌ No | ❌ No |
| totalTime | int8 | 0 | ❌ No | ✅ Yes |
| cycles | jsonb | [] | ❌ No | ✅ Yes |
| created_at | timestamptz | now() | ❌ No | ✅ Yes |

5. Click "Save"

## Step 5: Set Row Level Security (RLS) Policies

1. Go to **Authentication** > **Policies**
2. Find the `tasks` table
3. Click "New Policy"
4. Choose "Create a policy from scratch"
5. Fill in:
   - **Policy name**: `Allow all operations`
   - **Allowed operation**: All
   - **Target roles**: public
   - **USING expression**: `true`
   - **WITH CHECK expression**: `true`
6. Click "Review" then "Save policy"

**Alternative (Quick Setup):**
Click "Disable RLS" for development (NOT recommended for production)

## Step 6: Run Your App

```bash
npm start
```

## Verification

1. Open browser console (F12)
2. You should see: "Loaded tasks from Supabase: []"
3. Add a task
4. Go to Supabase dashboard > **Table Editor** > `tasks`
5. You should see your task data!

## Troubleshooting

### Error: "Failed to fetch"
- Check that you copied the correct URL and anon key
- Verify your internet connection

### Error: "new row violates row-level security policy"
- Make sure you created the RLS policy (Step 5)
- Or disable RLS for development

### Data not saving
- Check browser console for errors
- Verify Supabase credentials in `supabase.js`
- Check RLS policies allow insert/update

### Table doesn't exist
- Make sure you created the `tasks` table (Step 4)
- Check table name is exactly `tasks` (lowercase)

## What's Stored in Supabase

Each task row contains:
- `id`: Unique task ID (bigint)
- `name`: Task name (text)
- `date`: Date in YYYY-MM-DD format (text)
- `totalTime`: Total time in milliseconds (bigint)
- `cycles`: Array of cycle objects (jsonb)
- `created_at`: Timestamp when created (auto)

## Benefits

✅ **PostgreSQL database** - More powerful than Firebase
✅ **Free tier**: 500MB database, 2GB bandwidth, unlimited API requests
✅ **Real-time subscriptions** - Can add live updates later
✅ **SQL access** - Run custom queries
✅ **Auto backups** - Daily backups on paid plans
✅ **Open source** - Self-hostable if needed

## SQL Query Examples (Optional)

You can run these in **SQL Editor**:

```sql
-- View all tasks
SELECT * FROM tasks ORDER BY date DESC;

-- Get tasks for specific date
SELECT * FROM tasks WHERE date = '2024-01-25';

-- Get total time per date
SELECT date, SUM(totalTime) as total 
FROM tasks 
GROUP BY date 
ORDER BY date DESC;

-- Delete old tasks (older than 90 days)
DELETE FROM tasks 
WHERE date < CURRENT_DATE - INTERVAL '90 days';
```

## Next Steps (Optional)

- Add user authentication (Supabase Auth)
- Enable real-time sync across devices
- Add data export feature
- Set up automatic backups
- Deploy to Vercel/Netlify

## Important Notes

- **anon key is safe to expose** - It's meant for client-side use
- **RLS policies protect your data** - Even with public key
- **Free tier limits**: 500MB database, 2GB bandwidth/month
- **Data persists forever** on free tier (unless you delete project)
