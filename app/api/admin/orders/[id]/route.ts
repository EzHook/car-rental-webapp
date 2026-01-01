import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/adminAuth';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// GET single booking with payment details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get booking directly without joins - all info is in bookings table
    const bookingResult = await sql`
      SELECT * FROM bookings
      WHERE id = ${id}
    `;

    if (bookingResult.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingResult[0];

    // Optionally get user details separately if needed
    let userName = 'N/A';
    let userPhone = null;
    if (booking.user_id) {
      try {
        const userResult = await sql`
          SELECT full_name, phone FROM users WHERE id = ${parseInt(booking.user_id)}
        `;
        if (userResult.length > 0) {
          userName = userResult[0].full_name;
          userPhone = userResult[0].phone;
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    }

    // Optionally get car image if car_id exists
    let carImageUrl = '/placeholder-car.jpg';
    let carType = 'SUV';
    if (booking.car_id) {
      try {
        const carResult = await sql`
          SELECT image_url, type FROM cars WHERE id = ${parseInt(booking.car_id)}
        `;
        if (carResult.length > 0) {
          carImageUrl = carResult[0].image_url;
          carType = carResult[0].type;
        }
      } catch (error) {
        console.error('Failed to fetch car details:', error);
      }
    }

    // Fetch payment details from Razorpay if payment ID exists
    let paymentDetails = null;
    if (booking.payment_id) {
      try {
        const payment = await razorpay.payments.fetch(booking.payment_id);
        paymentDetails = {
          method: payment.method,
          card_id: payment.card_id || null,
          bank: payment.bank || null,
          wallet: payment.wallet || null,
          vpa: payment.vpa || null,
          email: payment.email,
          contact: payment.contact,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          created_at: payment.created_at,
        };
      } catch (error) {
        console.error('Failed to fetch Razorpay payment details:', error);
      }
    }

    return NextResponse.json({ 
      order: {
        id: booking.id,
        user_id: booking.user_id,
        car_id: booking.car_id,
        start_date: booking.pickup_date,
        end_date: booking.dropoff_date,
        total_price: parseFloat(booking.total_amount),
        status: booking.payment_status === 'success' ? 'confirmed' : 'pending',
        payment_status: booking.payment_status === 'success' ? 'paid' : booking.payment_status === 'failed' ? 'failed' : 'pending',
        razorpay_order_id: booking.order_id,
        razorpay_payment_id: booking.payment_id,
        razorpay_signature: null,
        created_at: booking.created_at,
        updated_at: booking.created_at,
        user_name: userName,
        user_email: booking.email,
        user_phone: userPhone,
        car_name: booking.car_name,
        car_type: carType,
        car_license_plate: booking.car_number,
        car_image_url: carImageUrl,
        pickup_location: booking.pickup_location,
        dropoff_location: booking.dropoff_location,
        pickup_time: booking.pickup_time,
        dropoff_time: booking.dropoff_time,
        rental_days: booking.rental_days,
        daily_rate: parseFloat(booking.daily_rate),
        subtotal: parseFloat(booking.subtotal),
        discount: parseFloat(booking.discount),
        tax: parseFloat(booking.tax),
        payment_details: paymentDetails,
      }
    });
  } catch (error: any) {
    console.error('Fetch booking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Map status to payment_status in bookings table
    let paymentStatus = 'pending';
    if (status === 'confirmed' || status === 'ongoing' || status === 'completed') {
      paymentStatus = 'success';
    } else if (status === 'cancelled') {
      paymentStatus = 'failed';
    }

    const result = await sql`
      UPDATE bookings 
      SET payment_status = ${paymentStatus}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: result[0],
      message: 'Booking status updated successfully',
    });
  } catch (error: any) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking', details: error.message },
      { status: 500 }
    );
  }
}
