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

    // Log all public IDs for debugging
    console.log('All image public IDs:');
    result.resources.forEach((img: any, idx: number) => {
      console.log(`${idx + 1}. ${img.public_id}`);
    });

    // Try multiple filter strategies
    const aboutImages = result.resources
      .filter((img: any) => {
        const publicId = img.public_id.toLowerCase();
        // Check if it's in about folder OR looks like a car image we want to use
        return (
          publicId.includes('about') ||
          publicId.startsWith('about/') ||
          // Add WhatsApp images as fallback for about section
          (publicId.startsWith('whatsapp_image') && 
           result.resources.indexOf(img) < 4) // Take first 4 WhatsApp images
        );
      })
      .slice(0, 4) // Limit to 4 images
      .map((img: any) => ({
        publicId: img.public_id,
        url: img.secure_url,
        width: img.width,
        height: img.height,
      }));

    console.log(`Found ${aboutImages.length} about images:`, aboutImages.map((img: any) => img.publicId));

    return NextResponse.json({ 
      success: true, 
      images: aboutImages,
      total: aboutImages.length,
      debug: {
        totalImages: result.resources.length,
        allPublicIds: result.resources.map((r: any) => r.public_id)
      }
    });
  } catch (error: any) {
    console.error('Cloudinary API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
