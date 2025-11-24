# Vercel Deployment Setup Guide

## 🚨 IMPORTANT: Database Setup Required

This application **requires a PostgreSQL database**. SQLite doesn't work on Vercel because Vercel's serverless functions have read-only file systems.

## Step-by-Step Setup

### 1. Create Vercel Postgres Database

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project (or create one if you haven't)
3. Navigate to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a database name (e.g., `client-management-db`)
7. Select your region (choose closest to your users)
8. Click **Create**

### 2. Get Database Connection Strings

After creating the database:

1. Click on your newly created database
2. Go to the **`.env.local`** tab
3. You'll see environment variables like:
   ```
   POSTGRES_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
   ```

### 3. Add Environment Variables to Vercel

1. Go to your project settings: **Settings → Environment Variables**
2. Add these two variables:

   **DATABASE_URL**
   - Value: Copy the `POSTGRES_URL` value (with pooling)
   - Environments: Production, Preview, Development

   **DIRECT_URL**
   - Value: Copy the `POSTGRES_URL_NON_POOLING` value
   - Environments: Production, Preview, Development

3. Click **Save**

### 4. Deploy

Once you've added the environment variables:

1. Trigger a new deployment:
   ```bash
   git push
   ```
   Or manually redeploy from the Vercel dashboard.

2. The build script will automatically:
   - Generate Prisma Client
   - Push the database schema to your Postgres database
   - Build the Next.js application

## What Happens During Build

The build script (`package.json`) runs:
```bash
prisma generate && prisma db push --accept-data-loss && next build
```

This ensures:
- ✅ Prisma Client is generated
- ✅ Database tables are created
- ✅ All columns are added
- ✅ Application is built and ready

## Local Development (Optional)

For local development, you can:

**Option A: Use the same Vercel Postgres database**
1. Copy `.env.example` to `.env.local`
2. Add your Vercel Postgres credentials
3. Run `npm run dev`

**Option B: Use a local PostgreSQL database**
1. Install PostgreSQL locally
2. Create a database
3. Update `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   DIRECT_URL="postgresql://user:password@localhost:5432/mydb"
   ```
4. Run `npm run db:push` to create tables
5. Run `npm run dev`

## Troubleshooting

### Error: "unable to open database file"
- **Cause**: SQLite configuration still in use
- **Fix**: Make sure you've updated `prisma/schema.prisma` to use `postgresql`

### Error: "Invalid connection string"
- **Cause**: Environment variables not set correctly
- **Fix**: Double-check DATABASE_URL and DIRECT_URL in Vercel dashboard

### Error: "Failed to save client"
- **Cause**: Database schema not synced
- **Fix**: Redeploy to trigger `prisma db push`

## Schema Updates

Whenever you modify `prisma/schema.prisma`:

1. Locally test with: `npm run db:push`
2. Commit and push changes
3. Vercel will auto-sync the schema during deployment

## Need Help?

Check your deployment logs in Vercel dashboard to see if:
- ✅ Prisma Client generated successfully
- ✅ Database schema pushed successfully
- ✅ Build completed without errors

## Database Costs

Vercel Postgres pricing:
- **Free**: 256 MB storage, 60 hours compute/month
- **Pro**: 512 MB storage, more compute time
- Perfect for small to medium client management systems

For more details: https://vercel.com/docs/storage/vercel-postgres
