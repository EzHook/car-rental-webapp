import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Static admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin@morent.com',
  password: 'Admin@12345',
};

export interface AdminPayload {
  username: string;
  role: 'admin';
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

export function generateAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function setAdminAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function getAdminAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('admin-token')?.value;
}

export async function removeAdminAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-token');
}

export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  const token = await getAdminAuthToken();
  if (!token) return null;
  return verifyAdminToken(token);
}
