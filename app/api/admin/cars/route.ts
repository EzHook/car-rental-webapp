import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      type,
      imageUrls, // Changed from imageUrl to imageUrls (array)
      fuelCapacity,
      transmission,
      capacity,
      price,
      originalPrice,
      licensePlate,
      description,
    } = body;

    // Validate required fields
    if (!name || !type || !imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0 || 
        !fuelCapacity || !transmission || !capacity || !price || !licensePlate) {
      return NextResponse.json(
        { error: 'Missing required fields or invalid image data' },
        { status: 400 }
      );
    }

    // Validate image URLs array
    if (imageUrls.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 images allowed' },
        { status: 400 }
      );
    }

    // Check if license plate already exists
    const existing = await sql`
      SELECT id FROM cars WHERE license_plate = ${licensePlate}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'License plate already exists' },
        { status: 400 }
      );
    }

    // Insert car into database with array of image URLs
    const result = await sql`
      INSERT INTO cars (
        name,
        type,
        image_urls,
        fuel_capacity,
        transmission,
        capacity,
        price,
        original_price,
        license_plate,
        description
      ) VALUES (
        ${name},
        ${type},
        ${imageUrls}, -- PostgreSQL will automatically handle the array
        ${fuelCapacity},
        ${transmission},
        ${capacity},
        ${price},
        ${originalPrice || null},
        ${licensePlate},
        ${description || null}
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      car: result[0],
      message: 'Car added successfully',
    });
  } catch (error: any) {
    console.error('Add car error:', error);
    return NextResponse.json(
      { error: 'Failed to add car', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cars = await sql`
      SELECT * FROM cars ORDER BY created_at DESC
    `;

    return NextResponse.json({ cars });
  } catch (error: any) {
    console.error('Fetch cars error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}
