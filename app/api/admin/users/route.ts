import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users using Neon serverless sql
    const users = await sql`
      SELECT 
        id, 
        phone, 
        country_code, 
        full_name, 
        created_at, 
        updated_at,
        aadhar_number,
        pan_number,
        documents_verified,
        aadhar_card_url,
        pan_card_url
      FROM users 
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      users: users,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}
