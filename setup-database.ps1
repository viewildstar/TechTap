# SwipeShare Database Setup Script
# Run this script to set up your PostgreSQL database

Write-Host "🔧 Setting up SwipeShare database..." -ForegroundColor Cyan

# Try to find PostgreSQL installation
$pgPaths = @(
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\14\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $pgPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        Write-Host "✅ Found PostgreSQL at: $path" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "❌ PostgreSQL not found in standard locations." -ForegroundColor Red
    Write-Host "Please provide the path to psql.exe:" -ForegroundColor Yellow
    $psqlPath = Read-Host "Path to psql.exe"
    
    if (-not (Test-Path $psqlPath)) {
        Write-Host "❌ Invalid path. Please run setup manually using pgAdmin." -ForegroundColor Red
        exit 1
    }
}

# Get database password
Write-Host "`nEnter PostgreSQL password (for user 'postgres'):" -ForegroundColor Yellow
$password = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Set password as environment variable for psql
$env:PGPASSWORD = $plainPassword

try {
    # Check if database exists
    Write-Host "`n📊 Checking if database exists..." -ForegroundColor Cyan
    $dbExists = & $psqlPath -U postgres -lqt | Select-String -Pattern "swipeshare"
    
    if ($dbExists) {
        Write-Host "⚠️  Database 'swipeshare' already exists." -ForegroundColor Yellow
        $overwrite = Read-Host "Do you want to recreate it? (y/N)"
        if ($overwrite -eq "y" -or $overwrite -eq "Y") {
            Write-Host "🗑️  Dropping existing database..." -ForegroundColor Yellow
            & $psqlPath -U postgres -c "DROP DATABASE swipeshare;"
        } else {
            Write-Host "✅ Using existing database." -ForegroundColor Green
        }
    }
    
    # Create database
    if (-not $dbExists -or $overwrite -eq "y" -or $overwrite -eq "Y") {
        Write-Host "`n📦 Creating database 'swipeshare'..." -ForegroundColor Cyan
        & $psqlPath -U postgres -c "CREATE DATABASE swipeshare;"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database created successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to create database." -ForegroundColor Red
            exit 1
        }
    }
    
    # Run migration
    Write-Host "`n🔨 Running database migration..." -ForegroundColor Cyan
    $migrationFile = "database/migrations/001_initial_schema.sql"
    
    if (Test-Path $migrationFile) {
        & $psqlPath -U postgres -d swipeshare -f $migrationFile
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Migration failed." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Migration file not found: $migrationFile" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "`n✅ Database setup complete!" -ForegroundColor Green
    Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Update .env file with your database password:" -ForegroundColor White
    Write-Host "   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/swipeshare" -ForegroundColor Gray
    Write-Host "2. Run: npm install" -ForegroundColor White
    Write-Host "3. Run: npm run dev" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    exit 1
} finally {
    # Clear password from environment
    $env:PGPASSWORD = $null
}

