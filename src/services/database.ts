import { neon } from '@netlify/neon';

// Initialize Neon database connection
// Priority: VITE_NEON_DATABASE_URL > NETLIFY_DATABASE_URL > NETLIFY_DATABASE_URL_UNPOOLED
const databaseUrl = process.env.VITE_NEON_DATABASE_URL || 
                   process.env.NETLIFY_DATABASE_URL || 
                   process.env.NETLIFY_DATABASE_URL_UNPOOLED;

if (!databaseUrl) {
  throw new Error('Database URL not found. Please set VITE_NEON_DATABASE_URL, NETLIFY_DATABASE_URL, or NETLIFY_DATABASE_URL_UNPOOLED environment variable.');
}

const sql = neon(databaseUrl);

export interface User {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUserData {
    name: string;
    email: string;
    password_hash: string;
}

export interface LoginData {
    email: string;
    password_hash: string;
}

/**
 * Database service for user authentication operations
 */
export class DatabaseService {
    /**
     * Create a new user in the database
     * @param userData - User data to create
     * @returns Created user (without password hash)
     */
    static async createUser(userData: CreateUserData): Promise<Omit<User, 'password_hash'>> {
        try {
            const [user] = await sql`
                INSERT INTO users (name, email, password_hash, created_at, updated_at)
                VALUES (${userData.name}, ${userData.email}, ${userData.password_hash}, NOW(), NOW())
                RETURNING id, name, email, created_at, updated_at
            `;
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }

    /**
     * Find user by email
     * @param email - User email
     * @returns User data (including password hash for verification)
     */
    static async findUserByEmail(email: string): Promise<User | null> {
        try {
            const [user] = await sql`
                SELECT * FROM users 
                WHERE email = ${email}
                LIMIT 1
            `;
            return user || null;
        } catch (error) {
            console.error('Error finding user:', error);
            throw new Error('Failed to find user');
        }
    }

    /**
     * Check if user exists by email
     * @param email - User email
     * @returns Boolean indicating if user exists
     */
    static async userExists(email: string): Promise<boolean> {
        try {
            const [result] = await sql`
                SELECT EXISTS(SELECT 1 FROM users WHERE email = ${email}) as exists
            `;
            return result.exists;
        } catch (error) {
            console.error('Error checking user existence:', error);
            throw new Error('Failed to check user existence');
        }
    }

    /**
     * Update user's last login time
     * @param userId - User ID
     */
    static async updateLastLogin(userId: string): Promise<void> {
        try {
            await sql`
                UPDATE users 
                SET updated_at = NOW() 
                WHERE id = ${userId}
            `;
        } catch (error) {
            console.error('Error updating last login:', error);
            throw new Error('Failed to update last login');
        }
    }

    /**
     * Get user by ID (without password hash)
     * @param userId - User ID
     * @returns User data (without password hash)
     */
    static async getUserById(userId: string): Promise<Omit<User, 'password_hash'> | null> {
        try {
            const [user] = await sql`
                SELECT id, name, email, created_at, updated_at 
                FROM users 
                WHERE id = ${userId}
                LIMIT 1
            `;
            return user || null;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw new Error('Failed to get user');
        }
    }
}

/**
 * Initialize database tables (run this once to set up the schema)
 */
export async function initializeDatabase(): Promise<void> {
    try {
        // Create users table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        `;

        // Create index on email for faster lookups
        await sql`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
        `;

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw new Error('Failed to initialize database');
    }
}
