import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary
 * @param {string} imagePath - The path to the image file
 * @returns {Promise<Object>} - The Cloudinary upload response
 */
export const uploadImage = async (imageFile) => {
  try {
    // Convert the file to base64 string for upload
    const base64Data = Buffer.from(await imageFile.arrayBuffer()).toString('base64');
    const dataURI = `data:${imageFile.type};base64,${base64Data}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'realestate',
      resource_type: 'image',
    });
    
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - The public ID of the image
 * @returns {Promise<Object>} - The Cloudinary deletion response
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
};

export default cloudinary;