import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching bookings for admin:', admin.username);

    // Use CAST function for type conversion
    const bookings = await sql`
      SELECT 
        b.*,
        u.full_name as user_name,
        u.phone as user_phone
      FROM bookings b
      LEFT JOIN users u ON CAST(b.user_id AS INTEGER) = u.id
      ORDER BY b.created_at DESC
    `;

    console.log(`Found ${bookings.length} bookings`);

    return NextResponse.json({ 
      success: true,
      orders: bookings.map(booking => ({
        id: booking.id,
        user_id: booking.user_id,
        car_id: booking.car_id,
        car_name: booking.car_name,
        car_license_plate: booking.car_number,
        start_date: booking.pickup_date,
        end_date: booking.dropoff_date,
        total_price: parseFloat(booking.total_amount),
        status: booking.payment_status === 'success' ? 'confirmed' : 'pending',
        payment_status: booking.payment_status === 'success' ? 'paid' : booking.payment_status === 'failed' ? 'failed' : 'pending',
        razorpay_order_id: booking.order_id,
        razorpay_payment_id: booking.payment_id,
        created_at: booking.created_at,
        user_name: booking.user_name || 'N/A',
        user_email: booking.email || 'N/A',
        user_phone: booking.user_phone,
        pickup_location: booking.pickup_location,
        dropoff_location: booking.dropoff_location,
        rental_days: booking.rental_days,
      }))
    });
    
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch bookings',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
