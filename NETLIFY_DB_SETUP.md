# Netlify Database Local Setup Guide

## 🚀 **Quick Setup for Local Development**

### 1. **Get Your Database URLs from Netlify**

From your Netlify project settings (as shown in your screenshot), you need:

- **`NETLIFY_DATABASE_URL`** - Primary connection with pooling
- **`NETLIFY_DATABASE_URL_UNPOOLED`** - Direct connection without pooling

### 2. **Set Up Local Environment**

Create a `.env` file in your project root with your database URLs:

```bash
# Netlify Database URLs (from your Netlify project settings)
NETLIFY_DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
NETLIFY_DATABASE_URL_UNPOOLED=postgresql://username:password@hostname/database?sslmode=require

# Alternative: Vite environment variable (for client-side access)
VITE_NEON_DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

### 3. **Install Netlify CLI (Optional but Recommended)**

```bash
npm install -g netlify-cli
```

This allows you to use `netlify dev` which automatically injects your Netlify environment variables.

### 4. **Initialize Your Database**

```bash
# Initialize database tables
npm run init-db
```

### 5. **Start Development**

```bash
# Option 1: Using Netlify CLI (recommended)
netlify dev

# Option 2: Using Vite directly
npm run dev
```

## 🔧 **Environment Variable Priority**

The database service checks for environment variables in this order:

1. **`VITE_NEON_DATABASE_URL`** - For client-side access
2. **`NETLIFY_DATABASE_URL`** - Primary Netlify database URL
3. **`NETLIFY_DATABASE_URL_UNPOOLED`** - Direct connection URL

## 📋 **What You Need from Netlify**

Based on your screenshot, you need:

### From Netlify Project Settings:
- ✅ **`NETLIFY_DATABASE_URL`** - Already configured in your project
- ✅ **`NETLIFY_DATABASE_URL_UNPOOLED`** - Already configured in your project
- ✅ **Local development support** - Available for "Local development (Netlify CLI)"

### Steps to Get Your URLs:
1. Go to your Netlify project dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click the **eye icon** next to `NETLIFY_DATABASE_URL` to reveal the value
4. Copy the connection string
5. Repeat for `NETLIFY_DATABASE_URL_UNPOOLED`

## 🛠 **Development Workflow**

### Using Netlify CLI (Recommended):
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link your project
netlify link

# Start development with environment variables
netlify dev
```

### Using Vite Directly:
```bash
# Set environment variables in .env file
# Then run:
npm run dev
```

## 🔍 **Troubleshooting**

### Common Issues:

1. **"Database URL not found" error:**
   - Ensure your `.env` file has the correct database URLs
   - Check that the URLs are properly formatted

2. **Connection refused:**
   - Verify your database URLs are correct
   - Check if your Neon database is active

3. **Environment variables not loading:**
   - Restart your development server
   - Check `.env` file is in the project root
   - Use `netlify dev` for automatic environment injection

### Debug Commands:
```bash
# Check if environment variables are loaded
node -e "console.log(process.env.NETLIFY_DATABASE_URL)"

# Test database connection
npm run init-db
```

## 📊 **Database Schema**

Your database will be initialized with:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 **Production Deployment**

When deploying to Netlify:

1. Your environment variables are already configured in Netlify
2. The database will be automatically available
3. No additional setup required

## 📝 **Summary**

**For local development, you need:**

1. ✅ **Database URLs** from your Netlify project settings
2. ✅ **`.env` file** with the database URLs
3. ✅ **Database initialization** (`npm run init-db`)
4. ✅ **Development server** (`netlify dev` or `npm run dev`)

The setup is now ready for real database authentication with your Netlify PostgreSQL database!

