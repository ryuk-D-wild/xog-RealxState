@echo off
echo Real Estate Website - API Testing Tool
echo =====================================
echo.

set BASE_URL=http://localhost:3000/api
set CURL_OPTIONS=--silent -H "Content-Type: application/json"

:menu
cls
echo API Testing Menu:
echo ----------------
echo 1. Get all properties
echo 2. Get property by ID
echo 3. Create new property (sample data)
echo 4. Update property
echo 5. Delete property
echo 6. Exit
echo.

set /p CHOICE=Enter your choice (1-6): 

if "%CHOICE%"=="1" goto get_all
if "%CHOICE%"=="2" goto get_by_id
if "%CHOICE%"=="3" goto create
if "%CHOICE%"=="4" goto update
if "%CHOICE%"=="5" goto delete
if "%CHOICE%"=="6" goto end

echo Invalid choice. Please try again.
ping -n 2 127.0.0.1 > nul
goto menu

:get_all
echo.
echo Fetching all properties...
echo.
curl %CURL_OPTIONS% %BASE_URL%/properties
echo.
echo.
echo Press any key to return to menu...
pause > nul
goto menu

:get_by_id
echo.
set /p PROPERTY_ID=Enter property ID: 
echo.
echo Fetching property with ID: %PROPERTY_ID%
echo.
curl %CURL_OPTIONS% %BASE_URL%/properties/%PROPERTY_ID%
echo.
echo.
echo Press any key to return to menu...
pause > nul
goto menu

:create
echo.
echo Creating a new property with sample data...
echo.

set JSON_DATA={
  "title": "Sample Property",
  "description": "This is a sample property created via the API testing tool.",
  "location": "Sample Location",
  "type": "house",
  "transaction": "sale",
  "price": 250000,
  "area": 150,
  "bedrooms": 3,
  "bathrooms": 2,
  "features": ["parking", "garden"],
  "agent": {
    "name": "Sample Agent",
    "phone": "123-456-7890",
    "email": "agent@example.com"
  },
  "status": "active"
}

curl %CURL_OPTIONS% -X POST -d "%JSON_DATA%" %BASE_URL%/properties
echo.
echo.
echo Note: This is a simplified test. Actual property creation requires image uploads.
echo Press any key to return to menu...
pause > nul
goto menu

:update
echo.
set /p PROPERTY_ID=Enter property ID to update: 
echo.
echo Updating property with ID: %PROPERTY_ID%
echo.

set JSON_DATA={
  "title": "Updated Sample Property",
  "price": 275000,
  "status": "pending"
}

curl %CURL_OPTIONS% -X PUT -d "%JSON_DATA%" %BASE_URL%/properties/%PROPERTY_ID%
echo.
echo.
echo Press any key to return to menu...
pause > nul
goto menu

:delete
echo.
set /p PROPERTY_ID=Enter property ID to delete: 
echo.
echo Deleting property with ID: %PROPERTY_ID%
echo.

curl %CURL_OPTIONS% -X DELETE %BASE_URL%/properties/%PROPERTY_ID%
echo.
echo.
echo Press any key to return to menu...
pause > nul
goto menu

:end
echo.
echo Exiting API Testing Tool...
echo.