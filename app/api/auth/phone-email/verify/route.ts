import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token, client_id } = body;

    if (!access_token || !client_id) {
      return NextResponse.json(
        { error: 'Access token and client ID are required' },
        { status: 400 }
      );
    }

    if (client_id !== process.env.NEXT_PUBLIC_PHONE_EMAIL_CLIENT_ID) {
      return NextResponse.json(
        { error: 'Invalid client ID' },
        { status: 400 }
      );
    }

    // Fetch user details from Phone.Email API
    const params = new URLSearchParams();
    params.append('access_token', access_token);
    params.append('client_id', client_id);

    const phoneEmailResponse = await fetch('https://eapi.phone.email/getuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!phoneEmailResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to verify with Phone.Email' },
        { status: 400 }
      );
    }

    const userData = await phoneEmailResponse.json();
    const { country_code, phone_no } = userData;

    if (!phone_no) {
      return NextResponse.json(
        { error: 'Phone number not found' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await sql`
      SELECT * FROM users WHERE phone = ${phone_no}
    `;

    let user;
    let isNewUser = false;

    if (existingUser.length > 0) {
      // Existing user
      user = existingUser[0];
      await sql`
        UPDATE users 
        SET updated_at = NOW() 
        WHERE id = ${user.id}
      `;
    } else {
      // New user
      isNewUser = true;
      const result = await sql`
        INSERT INTO users (phone, country_code)
        VALUES (${phone_no}, ${country_code || ''})
        RETURNING *
      `;
      user = result[0];
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      phone: user.phone,
      countryCode: user.country_code,
      fullName: user.full_name,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: user.id,
        phone: user.phone,
        countryCode: user.country_code,
        fullName: user.full_name,
      },
      isNewUser,
      needsProfileCompletion: !user.full_name,
    });
  } catch (error: any) {
    console.error('Phone.Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
