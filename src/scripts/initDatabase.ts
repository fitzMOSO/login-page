import { initializeDatabase } from '../services/database';

/**
 * Initialize the database with required tables
 * Run this script once to set up the database schema
 */
async function initDatabase() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initDatabase();
}

export { initDatabase };

