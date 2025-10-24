import Database from 'better-sqlite3';
import path from 'path';

// Create database instance
const dbPath = path.join(__dirname, '..', 'users.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create users table if it doesn't exist
const createUsersTable = () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.exec(createTableSQL);
  console.log('Users table created/verified');
};

// Initialize database
createUsersTable();

export class DatabaseService {
  // Register a new user
  static registerUser(credentials: { name: string; email: string; password: string }) {
    try {
      // Check if user already exists
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(credentials.email);
      
      if (existingUser) {
        return {
          success: false,
          error: 'Email already exists'
        };
      }

      // Hash password (in production, use bcrypt)
      const hashedPassword = this.hashPassword(credentials.password);

      // Insert new user
      const insertUser = db.prepare(`
        INSERT INTO users (name, email, password, created_at, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);

      const result = insertUser.run(
        credentials.name,
        credentials.email,
        hashedPassword
      );

      const newUser = {
        id: result.lastInsertRowid.toString(),
        name: credentials.name,
        email: credentials.email,
        createdAt: new Date()
      };

      return {
        success: true,
        user: newUser,
        token: 'sqlite-session-token'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }

  // Authenticate user login
  static authenticateUser(credentials: { email: string; password: string }) {
    try {
      // Find user by email
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(credentials.email) as any;
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Verify password (in production, use bcrypt.compare)
      const isValidPassword = this.verifyPassword(credentials.password, user.password);
      
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      const userObj = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        createdAt: new Date(user.created_at)
      };

      return {
        success: true,
        user: userObj,
        token: 'sqlite-session-token'
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  // Get user by ID
  static getUserById(id: string) {
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(parseInt(id)) as any;
      
      if (!user) {
        return null;
      }

      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        createdAt: new Date(user.created_at)
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Simple password hashing (in production, use bcrypt)
  private static hashPassword(password: string): string {
    // This is a simple hash for demo purposes
    // In production, use: bcrypt.hash(password, 10)
    return Buffer.from(password).toString('base64');
  }

  // Simple password verification (in production, use bcrypt.compare)
  private static verifyPassword(password: string, hashedPassword: string): boolean {
    // This is a simple verification for demo purposes
    // In production, use: bcrypt.compare(password, hashedPassword)
    return Buffer.from(password).toString('base64') === hashedPassword;
  }

  // Close database connection
  static close() {
    db.close();
  }
}

export default DatabaseService;