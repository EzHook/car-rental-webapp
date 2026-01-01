import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id: carId } = await params;
    const body = await request.json();
    const { rating, comment } = body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json({ error: 'Comment must be at least 10 characters' }, { status: 400 });
    }

    // Check if user has already reviewed this car
    const existingReview = await sql`
      SELECT id FROM reviews 
      WHERE user_id = ${user.id} AND car_id = ${carId}
    `;

    if (existingReview.length > 0) {
      return NextResponse.json({ error: 'You have already reviewed this car' }, { status: 400 });
    }

    // Insert review
    const result = await sql`
      INSERT INTO reviews (user_id, car_id, rating, comment, created_at)
      VALUES (${user.id}, ${carId}, ${rating}, ${comment}, NOW())
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      review: result[0],
      message: 'Review submitted successfully',
    });
  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review', details: error.message },
      { status: 500 }
    );
  }
}
