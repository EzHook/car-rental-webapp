import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/adminAuth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET single car
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params here
    
    const car = await sql`
      SELECT * FROM cars WHERE id = ${id}
    `;

    if (car.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ car: car[0] });
  } catch (error: any) {
    console.error('Fetch car error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car' },
      { status: 500 }
    );
  }
}

// UPDATE car
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // Await params here
    const body = await request.json();
    const {
      name,
      type,
      imageUrl,
      fuelCapacity,
      transmission,
      capacity,
      price,
      originalPrice,
      licensePlate,
      description,
      isAvailable,
    } = body;

    const result = await sql`
      UPDATE cars SET
        name = ${name},
        type = ${type},
        image_url = ${imageUrl},
        fuel_capacity = ${fuelCapacity},
        transmission = ${transmission},
        capacity = ${capacity},
        price = ${price},
        original_price = ${originalPrice || null},
        license_plate = ${licensePlate},
        description = ${description || null},
        is_available = ${isAvailable !== undefined ? isAvailable : true},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      car: result[0],
      message: 'Car updated successfully',
    });
  } catch (error: any) {
    console.error('Update car error:', error);
    return NextResponse.json(
      { error: 'Failed to update car', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE car
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // Await params here

    // Get car details to delete image from Cloudinary
    const carResult = await sql`
      SELECT image_url FROM cars WHERE id = ${id}
    `;

    if (carResult.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    // Extract public_id from Cloudinary URL and delete image
    const imageUrl = carResult[0].image_url;
    if (imageUrl && imageUrl.includes('cloudinary.com')) {
      try {
        // Extract public_id from URL like: https://res.cloudinary.com/xxx/image/upload/v123/morent/cars/xyz.jpg
        const matches = imageUrl.match(/\/morent\/cars\/[^.]+/);
        if (matches) {
          const publicId = matches[0].substring(1); // Remove leading slash
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    // Delete car from database
    await sql`
      DELETE FROM cars WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: 'Car deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete car error:', error);
    return NextResponse.json(
      { error: 'Failed to delete car', details: error.message },
      { status: 500 }
    );
  }
}
