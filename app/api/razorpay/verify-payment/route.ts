import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingDetails,
    } = await request.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Calculate rental days
    const pickupDate = new Date(bookingDetails.pickupDate);
    const dropoffDate = new Date(bookingDetails.dropoffDate);
    const rentalDays = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate pricing
    const dailyRate = bookingDetails.dailyRate;
    const subtotal = dailyRate * rentalDays;
    const discount = bookingDetails.discount || 0;
    const tax = bookingDetails.tax || 0;
    const totalAmount = subtotal - discount + tax;

    // Save booking to database
    const booking = await sql`
      INSERT INTO bookings (
        user_id,
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
        payment_method
      ) VALUES (
        ${user.id},
        ${bookingDetails.carId},
        ${bookingDetails.carName},
        ${bookingDetails.carNumber || 'TBD'},
        ${bookingDetails.pickupLocation},
        ${bookingDetails.pickupDate},
        ${bookingDetails.pickupTime},
        ${bookingDetails.dropoffLocation},
        ${bookingDetails.dropoffDate},
        ${bookingDetails.dropoffTime},
        ${rentalDays},
        ${dailyRate},
        ${subtotal},
        ${discount},
        ${tax},
        ${totalAmount},
        ${razorpay_payment_id},
        ${razorpay_order_id},
        'success',
        'razorpay'
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      booking: booking[0],
      message: 'Payment verified and booking confirmed',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed', details: error.message },
      { status: 500 }
    );
  }
}
