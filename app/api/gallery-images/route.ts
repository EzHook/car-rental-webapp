import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Fetch all images
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      resource_type: 'image',
    });

    // Filter only WhatsApp images (your gallery images)
    const galleryImages = result.resources
      .filter((img: any) => img.public_id.startsWith('WhatsApp_Image'))
      .map((img: any) => ({
        publicId: img.public_id,
        url: img.secure_url,
        width: img.width,
        height: img.height,
      }));

    return NextResponse.json({ 
      success: true, 
      images: galleryImages,
      total: galleryImages.length 
    });
  } catch (error: any) {
    console.error('Cloudinary API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
