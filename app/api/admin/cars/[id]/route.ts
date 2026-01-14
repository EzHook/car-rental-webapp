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

/**
 * Helper function to extract public_id from Cloudinary URL
 */
function extractPublicId(url: string): string | null {
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
    return publicId;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

/**
 * Delete multiple images from Cloudinary
 */
async function deleteCloudinaryImages(imageUrls: string[]): Promise<void> {
  if (!imageUrls || imageUrls.length === 0) return;

  try {
    const deletePromises = imageUrls.map(async (url) => {
      const publicId = extractPublicId(url);
      if (!publicId) {
        console.warn(`Could not extract public_id from URL: ${url}`);
        return;
      }

      try {
        const result = await cloudinary.uploader.destroy(publicId, {
          invalidate: true,
        });
        console.log(`Deleted image ${publicId}:`, result);
      } catch (error) {
        console.error(`Failed to delete image ${publicId}:`, error);
      }
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
  }
}

/**
 * GET /api/admin/cars/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params in Next.js 15+
    const { id } = await params;
    const carId = parseInt(id);
    
    if (isNaN(carId)) {
      return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 });
    }
    
    const result = await sql`
      SELECT * FROM cars WHERE id = ${carId}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ car: result[0] });
  } catch (error: any) {
    console.error('Fetch car error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/cars/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params in Next.js 15+
    const { id } = await params;
    const carId = parseInt(id);
    
    if (isNaN(carId)) {
      return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      type,
      imageUrls,
      fuelCapacity,
      transmission,
      capacity,
      price,
      originalPrice,
      licensePlate,
      description,
      isAvailable,
    } = body;

    // Validate required fields
    if (!name || !type || !imageUrls || !Array.isArray(imageUrls) || 
        imageUrls.length === 0 || !fuelCapacity || !transmission || 
        !capacity || !price || !licensePlate) {
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

    // Check if license plate exists for a different car
    const existing = await sql`
      SELECT id FROM cars 
      WHERE license_plate = ${licensePlate} AND id != ${carId}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'License plate already exists for another car' },
        { status: 400 }
      );
    }

    // Update car in database
    const result = await sql`
      UPDATE cars
      SET
        name = ${name},
        type = ${type},
        image_urls = ${imageUrls},
        fuel_capacity = ${fuelCapacity},
        transmission = ${transmission},
        capacity = ${capacity},
        price = ${price},
        original_price = ${originalPrice || null},
        license_plate = ${licensePlate},
        description = ${description || null},
        is_available = ${isAvailable !== undefined ? isAvailable : true},
        updated_at = NOW()
      WHERE id = ${carId}
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

/**
 * DELETE /api/admin/cars/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params in Next.js 15+
    const { id } = await params;
    const carId = parseInt(id);
    
    if (isNaN(carId)) {
      return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 });
    }

    // First, fetch the car to get image URLs
    const carResult = await sql`
      SELECT image_urls FROM cars WHERE id = ${carId}
    `;

    if (carResult.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    const imageUrls = carResult[0].image_urls || [];

    // Delete images from Cloudinary (asynchronously, don't block deletion)
    if (imageUrls.length > 0) {
      deleteCloudinaryImages(imageUrls).catch((error) => {
        console.error('Background image deletion failed:', error);
      });
    }

    // Delete car from database
    const deleteResult = await sql`
      DELETE FROM cars WHERE id = ${carId}
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: 'Car deleted successfully',
      deletedCar: deleteResult[0],
    });
  } catch (error: any) {
    console.error('Delete car error:', error);
    return NextResponse.json(
      { error: 'Failed to delete car', details: error.message },
      { status: 500 }
    );
  }
}
