@echo off
echo Real Estate Website - Database Tools
echo ==================================
echo.

:menu
cls
echo Database Management Menu:
echo -----------------------
echo 1. Show database statistics
echo 2. Add sample data
echo 3. Export database to JSON
echo 4. Import database from JSON
echo 5. Reset database (WARNING: Deletes all properties)
echo 6. Exit
echo.

set /p CHOICE=Enter your choice (1-6): 

if "%CHOICE%"=="1" goto stats
if "%CHOICE%"=="2" goto sample
if "%CHOICE%"=="3" goto export
if "%CHOICE%"=="4" goto import
if "%CHOICE%"=="5" goto reset
if "%CHOICE%"=="6" goto end

echo Invalid choice. Please try again.
ping -n 2 127.0.0.1 > nul
goto menu

:stats
echo.
echo Showing database statistics...
node db-tools.js stats
echo.
echo Press any key to return to menu...
pause > nul
goto menu

:sample
echo.
echo Adding sample data to database...
node db-tools.js sample
echo.
echo Press any key to return to menu...
pause > nul
goto menu

:export
echo.
echo Exporting database to JSON file...
node db-tools.js export
echo.
echo Press any key to return to menu...
pause > nul
goto menu

:import
echo.
echo Available backup files:
echo.

if not exist backups\ (
  echo No backup directory found.
  echo.
  echo Press any key to return to menu...
  pause > nul
  goto menu
)

dir /b backups\*.json
echo.

set /p FILENAME=Enter filename to import (or press Enter to cancel): 

if "%FILENAME%"=="" goto menu

if not exist backups\%FILENAME% (
  echo File not found: backups\%FILENAME%
  echo.
  echo Press any key to return to menu...
  pause > nul
  goto menu
)

echo.
echo Importing database from backups\%FILENAME%...
node db-tools.js import backups\%FILENAME%
echo.
echo Press any key to return to menu...
pause > nul
goto menu

:reset
echo.
echo WARNING: This will delete all properties in the database.
set /p CONFIRM=Are you sure you want to continue? (y/n): 

if /i "%CONFIRM%"=="y" (
  echo.
  echo Resetting database...
  node db-tools.js reset --confirm
) else (
  echo.
  echo Database reset cancelled.
)

echo.
echo Press any key to return to menu...
pause > nul
goto menu

:end
echo.
echo Exiting Database Tools...
echo.