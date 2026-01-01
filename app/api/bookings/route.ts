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

    // Fetch all bookings for the user
    const bookings = await sql`
      SELECT 
        id,
        car_id,
        car_name,
        car_number,
        pickup_location,
        pickup_date,
        pickup_time,
        dropoff_location,
        dropoff_date,
        dropoff_time,
        rental_days,
        daily_rate,
        subtotal,
        discount,
        tax,
        total_amount,
        payment_id,
        order_id,
        payment_status,
        payment_method,
        created_at,
        updated_at
      FROM bookings
      WHERE user_id = ${decoded.id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      bookings: bookings.map(booking => ({
        id: booking.id,
        carId: booking.car_id,
        carName: booking.car_name,
        carNumber: booking.car_number,
        pickupLocation: booking.pickup_location,
        pickupDate: booking.pickup_date,
        pickupTime: booking.pickup_time,
        dropoffLocation: booking.dropoff_location,
        dropoffDate: booking.dropoff_date,
        dropoffTime: booking.dropoff_time,
        rentalDays: booking.rental_days,
        dailyRate: booking.daily_rate,
        subtotal: booking.subtotal,
        discount: booking.discount,
        tax: booking.tax,
        totalAmount: booking.total_amount,
        paymentId: booking.payment_id,
        orderId: booking.order_id,
        paymentStatus: booking.payment_status,
        paymentMethod: booking.payment_method,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at,
      })),
    });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
