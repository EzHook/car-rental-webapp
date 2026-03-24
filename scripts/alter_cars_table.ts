import { neon } from '@neondatabase/serverless';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Altering cars table...');
    await sql`ALTER TABLE cars ALTER COLUMN license_plate DROP NOT NULL`;
    console.log('Successfully dropped NOT NULL constraint on license_plate');
  } catch (error) {
    console.error('Failed to alter table:', error);
    process.exit(1);
  }
}

main();
