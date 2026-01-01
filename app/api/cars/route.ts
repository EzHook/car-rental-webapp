import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Fetch only available cars for public display
    const cars = await sql`
      SELECT 
        id,
        name,
        type,
        image_url,
        fuel_capacity,
        transmission,
        capacity,
        price,
        original_price,
        license_plate,
        description,
        is_available
      FROM cars
      WHERE is_available = true
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      cars: cars,
    });
  } catch (error: any) {
    console.error('Fetch cars error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars', details: error.message },
      { status: 500 }
    );
  }
}
