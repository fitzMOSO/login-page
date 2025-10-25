# Database Setup with Neon

This project now includes real database integration using Neon (Netlify's PostgreSQL database service).

## Setup Instructions

### 1. Create a Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in to your account
3. Create a new project
4. Copy your database connection string

### 2. Configure Environment Variables

1. Copy `env.example` to `.env` in your project root
2. Add your Neon database URL:

```bash
VITE_NEON_DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

### 3. Initialize the Database

Run the database initialization script to create the required tables:

```bash
npm run init-db
```

This will create:
- `users` table with proper schema
- Indexes for performance
- UUID primary keys

### 4. Update Your Authentication

To use the real database instead of mock authentication, update your components to use the database auth hook:

```typescript
// Instead of useAuth, use:
import { useAuthDatabase } from '../hooks/useAuthDatabase';

const { login, signup, logout, user, isAuthenticated, isLoading, error } = useAuthDatabase();
```

## Database Schema

### Users Table

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

## Features

- ✅ **Real Database Storage**: User data persisted in PostgreSQL
- ✅ **Password Hashing**: Secure bcrypt password hashing
- ✅ **Email Validation**: Unique email constraints
- ✅ **User Authentication**: Real login/signup with database
- ✅ **Session Management**: Token-based authentication
- ✅ **Error Handling**: Comprehensive error handling
- ✅ **Type Safety**: Full TypeScript support

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 12
- Email addresses are validated and must be unique
- SQL injection protection through parameterized queries
- Secure token generation for sessions

## API Endpoints

The database service provides these methods:

- `AuthService.signup(credentials)` - Create new user
- `AuthService.login(credentials)` - Authenticate user
- `AuthService.getUserById(userId)` - Get user by ID
- `DatabaseService.userExists(email)` - Check if user exists
- `DatabaseService.updateLastLogin(userId)` - Update login time

## Development

### Local Development

1. Set up your Neon database
2. Add environment variables
3. Run `npm run init-db` to create tables
4. Start development: `npm run dev`

### Production Deployment

1. Set up production Neon database
2. Configure environment variables in your deployment platform
3. Run database initialization
4. Deploy your application

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Check your `VITE_NEON_DATABASE_URL`
2. **Table Not Found**: Run `npm run init-db` to create tables
3. **Authentication Fails**: Check if user exists in database
4. **Password Issues**: Ensure bcryptjs is installed

### Debug Mode

Enable debug logging by adding to your environment:

```bash
DEBUG=true
```

This will show detailed database queries and authentication flow.

