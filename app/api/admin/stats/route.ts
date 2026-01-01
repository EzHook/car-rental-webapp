import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/adminAuth';
import { cars } from '@/utils/db';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get total bookings
    const bookingsResult = await sql`
      SELECT COUNT(*) as count FROM bookings
    `;
    const totalBookings = parseInt(bookingsResult[0].count);

    // Get total revenue
    const revenueResult = await sql`
      SELECT SUM(total_amount) as revenue FROM bookings WHERE payment_status = 'success'
    `;
    const totalRevenue = parseFloat(revenueResult[0].revenue || 0);

    // Get total users
    const usersResult = await sql`
      SELECT COUNT(*) as count FROM users
    `;
    const totalUsers = parseInt(usersResult[0].count);

    // Get active cars count
    const activeCars = cars.length;

    return NextResponse.json({
      totalBookings,
      totalRevenue,
      totalUsers,
      activeCars,
    });
  } catch (error: any) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
