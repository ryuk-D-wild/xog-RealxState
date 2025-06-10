# Real Estate Website

A modern real estate website built with Next.js, MongoDB, and Cloudinary for property listings and management.

## Features

### Client-Side Features
- Property listings with search and filter functionality
- Property details page with image gallery
- Contact form for property inquiries
- Responsive design for all devices

### Admin Features
- Admin dashboard with property statistics
- Property management (add, edit, delete)
- Image upload with Cloudinary integration
- Property status management (active, pending, sold)

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Image Storage**: Cloudinary
- **Authentication**: Simple cookie-based auth (can be extended with NextAuth)

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account

### Installation

1. Clone the repository or download the source code

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Run the setup script:
     ```
     setup-env.bat
     ```
   - Or manually create a `.env.local` file with the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

### Development

Start the development server:
```
npm run dev
```

The application will be available at http://localhost:3000

### Production Build

Create a production build:
```
build.bat
```
Or manually:
```
npm run build
```

Start the production server:
```
npm start
```

## Admin Access

Access the admin panel at http://localhost:3000/admin

Default credentials:
- Username: adminu
- Password: 1234

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/lib` - Utility functions, database models, and configurations
- `/public` - Static assets

## API Routes

- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create a new property
- `GET /api/properties/:id` - Get a specific property
- `PUT /api/properties/:id` - Update a property
- `DELETE /api/properties/:id` - Delete a property

## Future Improvements

- Implement NextAuth.js for more robust authentication
- Add user roles and permissions
- Create a user registration system
- Add property favorites/bookmarking
- Implement real-time notifications
- Add analytics dashboard