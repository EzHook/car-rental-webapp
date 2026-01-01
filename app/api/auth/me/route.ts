import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch user from database with document URLs
    const users = await sql`
      SELECT 
        id, 
        phone, 
        country_code, 
        full_name,
        aadhar_card_url,
        pan_card_url,
        aadhar_number,
        pan_number
      FROM users
      WHERE id = ${decoded.id}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];

    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        countryCode: user.country_code,
        fullName: user.full_name,
        aadharCardUrl: user.aadhar_card_url,
        panCardUrl: user.pan_card_url,
        aadharNumber: user.aadhar_number,
        panNumber: user.pan_number,
      },
    });
  } catch (error) {
    console.error('Auth check failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
