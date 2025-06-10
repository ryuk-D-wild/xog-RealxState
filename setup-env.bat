@echo off
echo Real Estate Website - Environment Setup
echo ======================================
echo.

set ENV_FILE=.env.local

:: Check if .env.local already exists
if exist %ENV_FILE% (
  echo WARNING: %ENV_FILE% already exists.
  set /p OVERWRITE=Do you want to overwrite it? (y/n): 
  if /i "%OVERWRITE%"=="y" (
    echo Creating new %ENV_FILE% file...
  ) else (
    echo Setup cancelled. Existing %ENV_FILE% file was not modified.
    exit /b 0
  )
) else (
  echo Creating new %ENV_FILE% file...
)

:: Get MongoDB connection string
echo.
echo Please enter your MongoDB connection string
echo Example: mongodb+srv://username:password@cluster.mongodb.net/real-estate
set /p MONGODB_URI=MongoDB URI: 

:: Get Cloudinary credentials
echo.
echo Please enter your Cloudinary credentials
set /p CLOUDINARY_CLOUD_NAME=Cloudinary Cloud Name: 
set /p CLOUDINARY_API_KEY=Cloudinary API Key: 
set /p CLOUDINARY_API_SECRET=Cloudinary API Secret: 

:: Create or overwrite .env.local file
(
  echo MONGODB_URI=%MONGODB_URI%
  echo CLOUDINARY_CLOUD_NAME=%CLOUDINARY_CLOUD_NAME%
  echo CLOUDINARY_API_KEY=%CLOUDINARY_API_KEY%
  echo CLOUDINARY_API_SECRET=%CLOUDINARY_API_SECRET%
) > %ENV_FILE%

echo.
echo Environment file created successfully!
echo File location: %CD%\%ENV_FILE%
echo.
echo Next steps:
echo 1. Run 'npm run dev' to start the development server
echo 2. Or run 'build.bat' to create a production build
echo.