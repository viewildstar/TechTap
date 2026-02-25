@echo off
REM Simple batch file to set up database
REM This will guide you through the setup

echo.
echo ========================================
echo SwipeShare Database Setup
echo ========================================
echo.

REM Try to find PostgreSQL
set PG_PATH=
if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" (
    set PG_PATH=C:\Program Files\PostgreSQL\15\bin\psql.exe
    goto found
)
if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" (
    set PG_PATH=C:\Program Files\PostgreSQL\14\bin\psql.exe
    goto found
)
if exist "C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe" (
    set PG_PATH=C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe
    goto found
)

:found
if "%PG_PATH%"=="" (
    echo ERROR: Could not find PostgreSQL installation.
    echo.
    echo Please provide the full path to psql.exe:
    set /p PG_PATH="Path: "
    if not exist "%PG_PATH%" (
        echo ERROR: Invalid path!
        pause
        exit /b 1
    )
)

echo Found PostgreSQL at: %PG_PATH%
echo.

REM Get password
set /p PGPASSWORD="Enter PostgreSQL password (for user 'postgres'): "

echo.
echo Creating database 'swipeshare'...
"%PG_PATH%" -U postgres -c "CREATE DATABASE swipeshare;" 2>nul
if errorlevel 1 (
    echo Database might already exist, continuing...
)

echo.
echo Running migration...
if exist "database\migrations\001_initial_schema.sql" (
    "%PG_PATH%" -U postgres -d swipeshare -f database\migrations\001_initial_schema.sql
    if errorlevel 1 (
        echo ERROR: Migration failed!
        pause
        exit /b 1
    )
    echo.
    echo ========================================
    echo SUCCESS! Database setup complete!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Update .env file with your password:
    echo    DATABASE_URL=postgresql://postgres:%PGPASSWORD%@localhost:5432/swipeshare
    echo 2. Run: npm install
    echo 3. Run: npm run dev
    echo.
) else (
    echo ERROR: Migration file not found!
    echo Expected: database\migrations\001_initial_schema.sql
)

pause

