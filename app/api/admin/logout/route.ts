import { NextResponse } from 'next/server';
import { removeAdminAuthCookie } from '@/lib/adminAuth';

export async function POST() {
  await removeAdminAuthCookie();
  return NextResponse.json({ message: 'Logged out successfully' });
}
