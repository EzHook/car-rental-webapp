import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch car details
    const carResult = await sql`
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
      WHERE id = ${id}
    `;

    if (carResult.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    const car = carResult[0];

    // Fetch reviews for this car
    const reviewsResult = await sql`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.full_name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.car_id = ${id}
      ORDER BY r.created_at DESC
      LIMIT 10
    `;

    // Calculate average rating
    const avgRatingResult = await sql`
      SELECT 
        COALESCE(AVG(rating), 0) as avg_rating,
        COUNT(*) as review_count
      FROM reviews
      WHERE car_id = ${id}
    `;

    return NextResponse.json({
      success: true,
      car: {
        ...car,
        price: parseFloat(car.price),
        original_price: car.original_price ? parseFloat(car.original_price) : null,
      },
      reviews: reviewsResult.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        user_name: review.user_name,
      })),
      avg_rating: parseFloat(avgRatingResult[0].avg_rating),
      review_count: parseInt(avgRatingResult[0].review_count),
    });
  } catch (error: any) {
    console.error('Fetch car error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car details', details: error.message },
      { status: 500 }
    );
  }
}
