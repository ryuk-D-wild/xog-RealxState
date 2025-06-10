@echo off
echo Building production version of the application...

:: Check if .env.local exists and has valid values
echo Checking environment variables...
if not exist .env.local (
  echo ERROR: .env.local file not found.
  echo Please create a .env.local file with the following variables:
  echo MONGODB_URI=your_mongodb_connection_string
  echo CLOUDINARY_CLOUD_NAME=your_cloud_name
  echo CLOUDINARY_API_KEY=your_api_key
  echo CLOUDINARY_API_SECRET=your_api_secret
  exit /b 1
)

:: Check for placeholder values in .env.local
findstr /C:"your_mongodb_connection_string" .env.local >nul
if not errorlevel 1 (
  echo ERROR: Please update MONGODB_URI in .env.local with your actual MongoDB connection string.
  exit /b 1
)

findstr /C:"your_cloud_name" .env.local >nul
if not errorlevel 1 (
  echo ERROR: Please update CLOUDINARY_CLOUD_NAME in .env.local with your actual Cloudinary cloud name.
  exit /b 1
)

findstr /C:"your_api_key" .env.local >nul
if not errorlevel 1 (
  echo ERROR: Please update CLOUDINARY_API_KEY in .env.local with your actual Cloudinary API key.
  exit /b 1
)

findstr /C:"your_api_secret" .env.local >nul
if not errorlevel 1 (
  echo ERROR: Please update CLOUDINARY_API_SECRET in .env.local with your actual Cloudinary API secret.
  exit /b 1
)

echo Environment variables look good!

:: Build the production version
echo Running production build...
npm run build

if errorlevel 1 (
  echo Build failed. Please check the errors above.
  exit /b 1
) else (
  echo Build completed successfully!
  echo.
  echo To start the production server, run: npm start
  echo.
)