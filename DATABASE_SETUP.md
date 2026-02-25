# PostgreSQL Setup Guide for Windows

## Step 1: Find PostgreSQL Installation

PostgreSQL is usually installed in:
- `C:\Program Files\PostgreSQL\15\` (or version number)
- `C:\Program Files (x86)\PostgreSQL\15\`

## Step 2: Create Database

### Option A: Using pgAdmin (GUI - Recommended for Windows)

1. **Open pgAdmin** (should be in Start Menu)
2. **Connect to server**:
   - Enter password you set during installation
   - Default port: 5432
3. **Create database**:
   - Right-click "Databases" → Create → Database
   - Name: `swipeshare`
   - Owner: `postgres` (or your user)
   - Click Save

### Option B: Using Command Line

1. **Add PostgreSQL to PATH** (one-time setup):
   ```powershell
   # Find your PostgreSQL bin folder (usually):
   # C:\Program Files\PostgreSQL\15\bin
   
   # Add to PATH temporarily for this session:
   $env:Path += ";C:\Program Files\PostgreSQL\15\bin"
   
   # Or add permanently:
   # System Properties → Environment Variables → Add to PATH
   ```

2. **Create database**:
   ```powershell
   # Connect to PostgreSQL
   psql -U postgres
   
   # Enter your password when prompted
   
   # Create database
   CREATE DATABASE swipeshare;
   
   # Exit
   \q
   ```

### Option C: Using SQL Command Directly

```powershell
# Find your PostgreSQL bin folder and run:
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE DATABASE swipeshare;"
```

## Step 3: Update .env File

Open `.env` and update the `DATABASE_URL`:

```bash
# Default format (if you used default settings):
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/swipeshare

# Replace YOUR_PASSWORD with the password you set during installation
```

## Step 4: Run Database Migration

Run the SQL migration file to create all tables:

```powershell
# Using psql
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d swipeshare -f database/migrations/001_initial_schema.sql

# Or if psql is in PATH:
psql -U postgres -d swipeshare -f database/migrations/001_initial_schema.sql
```

## Step 5: Test Connection

Test if everything works:

```powershell
# Install Node.js dependencies first
npm install

# Try to start the server (will test database connection)
npm run dev
```

## Troubleshooting

### "psql is not recognized"
- Add PostgreSQL bin folder to PATH
- Or use full path: `"C:\Program Files\PostgreSQL\15\bin\psql.exe"`

### "Password authentication failed"
- Check the password you set during installation
- Try resetting password in pgAdmin

### "Database does not exist"
- Make sure you created the database first
- Check database name matches in `.env`

### "Connection refused"
- Make sure PostgreSQL service is running
- Check port 5432 is not blocked by firewall

### Find PostgreSQL Service
```powershell
# Check if service is running
Get-Service -Name postgresql*

# Start service if stopped
Start-Service postgresql-x64-15  # (adjust version number)
```

## Quick Setup Script

Save this as `setup-db.ps1` and run it:

```powershell
# Setup Database Script
$pgPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"

# Create database
& $pgPath -U postgres -c "CREATE DATABASE swipeshare;"

# Run migration
& $pgPath -U postgres -d swipeshare -f database/migrations/001_initial_schema.sql

Write-Host "✅ Database setup complete!"
```

