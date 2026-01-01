import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, generateAdminToken, setAdminAuthCookie } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials
    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateAdminToken({
      username,
      role: 'admin',
    });

    // Set cookie
    await setAdminAuthCookie(token);

    return NextResponse.json({
      message: 'Login successful',
      admin: {
        username,
        role: 'admin',
      },
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
