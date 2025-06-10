import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Property from '@/lib/models/Property';
import { uploadImage } from '@/lib/cloudinary';

// GET all properties
export async function GET() {
  try {
    await connectDB();
    const properties = await Property.find().sort({ createdAt: -1 });
    
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// POST a new property
export async function POST(request) {
  try {
    await connectDB();
    
    // Use formData to handle file uploads
    const formData = await request.formData();
    
    // Extract property data
    const title = formData.get('title');
    const location = formData.get('location');
    const type = formData.get('type');
    const transaction = formData.get('transaction');
    const price = formData.get('price');
    const area = formData.get('area');
    const bedrooms = formData.get('bedrooms');
    const bathrooms = formData.get('bathrooms');
    const description = formData.get('description');
    const features = formData.getAll('features');
    const agentName = formData.get('agent-name');
    const agentPhone = formData.get('agent-phone');
    const agentEmail = formData.get('agent-email');
    
    // Handle image uploads
    const imageFiles = formData.getAll('images');
    const imageUrls = [];
    
    // Upload each image to Cloudinary
    for (const imageFile of imageFiles) {
      if (imageFile instanceof File) {
        const result = await uploadImage(imageFile);
        imageUrls.push(result.secure_url);
      }
    }
    
    // Create property object
    const propertyData = {
      title,
      location,
      type,
      transaction,
      price,
      area,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      description,
      images: imageUrls,
      features,
      agent: {
        name: agentName,
        phone: agentPhone,
        email: agentEmail
      }
    };
    
    // Create new property
    const property = await Property.create(propertyData);
    
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property', details: error.message }, { status: 500 });
  }
}