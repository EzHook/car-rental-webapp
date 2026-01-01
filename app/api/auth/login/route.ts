import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const users = await sql`
      SELECT id, email, password, full_name
      FROM users
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    // const isValidPassword = await verifyPassword(password, user.password);

    // if (!isValidPassword) {
    //   return NextResponse.json(
    //     { error: 'Invalid email or password' },
    //     { status: 401 }
    //   );
    // }

    // Generate token
    // const token = generateToken({
    //   id: user.id,
    //   email: user.email,
    //   fullName: user.full_name,
    // });

    // Set cookie
    // await setAuthCookie(token);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
