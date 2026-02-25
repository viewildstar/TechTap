# How to Open the SQL Migration File

## Location
The SQL file is located at:
```
database\migrations\001_initial_schema.sql
```

## Method 1: Open in File Explorer

1. Open **File Explorer** (Windows key + E)
2. Navigate to: `C:\Users\vienn\techtap`
3. Go to folder: `database` → `migrations`
4. Double-click: `001_initial_schema.sql`
5. It will open in Notepad or your default text editor
6. **Select All** (Ctrl+A) and **Copy** (Ctrl+C)

## Method 2: Open in VS Code (if you have it)

1. Open VS Code
2. File → Open Folder → Select `C:\Users\vienn\techtap`
3. Navigate to: `database/migrations/001_initial_schema.sql`
4. Click the file to open it
5. **Select All** (Ctrl+A) and **Copy** (Ctrl+C)

## Method 3: Direct Path

The full path is:
```
C:\Users\vienn\techtap\database\migrations\001_initial_schema.sql
```

You can:
- Copy this path
- Press `Win + R`
- Paste the path
- Press Enter
- File will open in Notepad

## Method 4: Quick Open Command

In PowerShell or CMD, run:
```powershell
notepad database\migrations\001_initial_schema.sql
```

Or:
```powershell
code database\migrations\001_initial_schema.sql
```
(if you have VS Code)

## Then in pgAdmin:

1. Open pgAdmin
2. Connect to PostgreSQL
3. Right-click `swipeshare` database → **Query Tool**
4. **Paste** the SQL (Ctrl+V)
5. Click **Execute** (▶ button) or press F5

## Quick Copy Command

I can also create a file with just the SQL content if that's easier!

