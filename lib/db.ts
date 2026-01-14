import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

// Initialize database tables
export async function initDB() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        country_code VARCHAR(10) DEFAULT '',
        full_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Create index (separate query)
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)
    `;
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// 👇 ADD THIS - Type definition for contact submissions
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
