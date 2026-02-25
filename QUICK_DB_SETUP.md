# Quick Database Setup Guide

## Option 1: Use the Batch File (Works in CMD)

I created a `.bat` file that works in Command Prompt:

```cmd
setup-database-simple.bat
```

Just double-click it or run it in CMD. It will:
- Find PostgreSQL
- Ask for your password
- Create the database
- Run the migration

## Option 2: Use PowerShell (Recommended)

1. **Open PowerShell** (not CMD):
   - Press `Win + X`
   - Select "Windows PowerShell" or "Terminal"
   - Or search for "PowerShell" in Start Menu

2. **Navigate to your project**:
   ```powershell
   cd C:\Users\vienn\techtap
   ```

3. **Enable script execution** (if needed):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   (Type `Y` when prompted)

4. **Run the script**:
   ```powershell
   .\setup-database.ps1
   ```

## Option 3: Manual Setup (pgAdmin - Easiest GUI)

1. **Open pgAdmin** from Start Menu
2. **Connect** to PostgreSQL (enter your password)
3. **Create Database**:
   - Right-click "Databases" → Create → Database
   - Name: `swipeshare`
   - Click Save
4. **Run Migration**:
   - Right-click `swipeshare` database → Query Tool
   - Open file: `database/migrations/001_initial_schema.sql`
   - Copy all contents
   - Paste into Query Tool
   - Click Execute (▶)

## Option 4: Manual Command Line

### Find PostgreSQL Path

PostgreSQL is usually installed at:
- `C:\Program Files\PostgreSQL\15\bin\psql.exe`
- `C:\Program Files\PostgreSQL\14\bin\psql.exe`

### Create Database

```cmd
REM Replace 15 with your version number
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE DATABASE swipeshare;"
```

Enter your password when prompted.

### Run Migration

```cmd
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d swipeshare -f database\migrations\001_initial_schema.sql
```

## After Setup

1. **Update `.env` file**:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/swipeshare
   ```

2. **Test connection**:
   ```cmd
   npm install
   npm run dev
   ```

## Troubleshooting

### "psql is not recognized"
- Use the full path: `"C:\Program Files\PostgreSQL\15\bin\psql.exe"`
- Or add PostgreSQL to your PATH

### "Password authentication failed"
- Check the password you set during PostgreSQL installation
- Try resetting it in pgAdmin

### "Database already exists"
- That's okay! The migration will still run
- Or drop it first: `DROP DATABASE swipeshare;`

### "Permission denied" in PowerShell
- Run PowerShell as Administrator
- Or use: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

