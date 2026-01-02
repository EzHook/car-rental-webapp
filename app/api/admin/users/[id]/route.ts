import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/adminAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

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
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: users[0],
    });
  } catch (error: any) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await request.json();
    const { documents_verified } = body;

    if (typeof documents_verified !== 'boolean') {
      return NextResponse.json(
        { error: 'documents_verified must be a boolean' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE users 
      SET 
        documents_verified = ${documents_verified},
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING 
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
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: result[0],
      message: 'User verification status updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating user verification:', error);
    return NextResponse.json(
      { error: 'Failed to update user verification', details: error.message },
      { status: 500 }
    );
  }
}
