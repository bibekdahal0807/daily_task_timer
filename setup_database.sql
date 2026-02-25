-- Run this SQL in Supabase SQL Editor
-- Go to: https://app.supabase.com/project/_/sql/new

-- Drop existing table if it exists (to start fresh)
DROP TABLE IF EXISTS tasks CASCADE;

-- Create tasks table with correct column names
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  total_time BIGINT DEFAULT 0,
  cycles JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster date queries
CREATE INDEX idx_tasks_date ON tasks(date);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
CREATE POLICY "Allow all operations on tasks" 
ON tasks 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Verify table was created
SELECT * FROM tasks;
