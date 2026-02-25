# User Separation Setup

## Step 1: Add user_id Column in Supabase

Go to your Supabase SQL Editor and run:

```sql
ALTER TABLE tasks
ADD COLUMN user_id text;
```

## Step 2: How It Works

- **Public users**: Access the app normally at your Vercel URL
  - They all share the same data (user_id: "public-demo")
  
- **You (Owner)**: Access with your secret URL
  - Your URL: `https://your-app.vercel.app?owner=mySecretKey123`
  - Your data is separate (user_id: "murari-private-123")

## Step 3: Change Your Secret Key (Optional but Recommended)

In `src/App.jsx`, change this line:
```javascript
const isOwner = params.get("owner") === "mySecretKey123";
```

Replace `"mySecretKey123"` with your own secret key.

## Usage

- **For yourself**: Bookmark `https://your-app.vercel.app?owner=mySecretKey123`
- **For others**: Share `https://your-app.vercel.app` (without the owner parameter)

Your tasks will be completely separate from public users!
