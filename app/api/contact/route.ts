import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // Validation
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Save to database
    const result = await sql`
      INSERT INTO contact_submissions (name, email, phone, service, message, status, created_at, updated_at)
      VALUES (
        ${name.trim()},
        ${email.toLowerCase().trim()},
        ${phone?.trim() || null},
        ${service},
        ${message.trim()},
        'pending',
        NOW(),
        NOW()
      )
      RETURNING id, name, email, service, created_at
    `;

    const submission = result[0];

    console.log('✅ Contact form submission saved:', {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      service: submission.service,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you within 2 hours.',
      submissionId: submission.id,
    });

  } catch (error: any) {
    console.error('❌ Contact form error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit form. Please try again or contact us directly.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch submissions (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');

    let submissions;

    if (status) {
      submissions = await sql`
        SELECT id, name, email, phone, service, message, status, created_at, updated_at
        FROM contact_submissions
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      submissions = await sql`
        SELECT id, name, email, phone, service, message, status, created_at, updated_at
        FROM contact_submissions
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }

    return NextResponse.json({
      success: true,
      submissions,
      total: submissions.length,
    });

  } catch (error: any) {
    console.error('❌ Failed to fetch submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
