import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { fullName } = await request.json();

    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    // Update user profile
    await sql`
      UPDATE users 
      SET full_name = ${fullName.trim()}, updated_at = NOW()
      WHERE id = ${currentUser.id}
    `;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        ...currentUser,
        fullName: fullName.trim(),
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
