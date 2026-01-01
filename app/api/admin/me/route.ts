import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminAuth';

export async function GET() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({
    admin: {
      username: admin.username,
      role: admin.role,
    },
  });
}
