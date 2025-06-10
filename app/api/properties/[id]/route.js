import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Property from '@/lib/models/Property';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

// GET a single property by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const property = await Property.findById(params.id);
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    // Increment view count
    property.views += 1;
    await property.save();
    
    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

// PUT (update) a property by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    // Check if property exists
    const existingProperty = await Property.findById(params.id);
    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
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
    const status = formData.get('status') || existingProperty.status;
    
    // Handle image uploads
    const keepExistingImages = formData.get('keepExistingImages') === 'true';
    const imageFiles = formData.getAll('images');
    let imageUrls = [];
    
    // Keep existing images if specified
    if (keepExistingImages) {
      imageUrls = [...existingProperty.images];
    }
    
    // Upload new images to Cloudinary
    for (const imageFile of imageFiles) {
      if (imageFile instanceof File) {
        const result = await uploadImage(imageFile);
        imageUrls.push(result.secure_url);
      }
    }
    
    // Create property object with updated data
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
      },
      status
    };
    
    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      params.id,
      propertyData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property', details: error.message }, { status: 500 });
  }
}

// DELETE a property by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    // Find the property
    const property = await Property.findById(params.id);
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    // Delete the property
    await Property.findByIdAndDelete(params.id);
    
    // Extract public IDs from image URLs and delete from Cloudinary
    // This assumes your Cloudinary URLs contain '/realestate/' folder
    for (const imageUrl of property.images) {
      try {
        // Extract the public ID from the URL
        const urlParts = imageUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `realestate/${publicIdWithExtension.split('.')[0]}`;
        
        // Delete from Cloudinary
        await deleteImage(publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with other images even if one fails
      }
    }
    
    return NextResponse.json({ success: true, message: 'Property deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}