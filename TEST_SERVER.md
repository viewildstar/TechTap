# Testing Your Server

## Quick Start

1. **Make sure `.env` is configured:**
   - `DATABASE_URL` has your PostgreSQL password
   - `JWT_SECRET` is set (can use a simple string for testing like `dev-secret-key`)

2. **Start the server:**
   ```powershell
   npm run dev
   ```

3. **You should see:**
   ```
   ✅ Database connected
   🚀 Server running on port 3000
   📱 Environment: development
   🔄 Starting matching service...
   ```

4. **Test in browser:**
   - Open: http://localhost:3000/health
   - Should see: `{"status":"ok","timestamp":"..."}`

## If You Get Errors

### "Cannot connect to database"
- Check PostgreSQL is running: `Get-Service postgresql*`
- Verify password in `.env` matches your PostgreSQL password
- Test connection manually:
  ```powershell
  # Find psql.exe path, then:
  & "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -d swipeshare -c "SELECT 1;"
  ```

### "Port 3000 already in use"
- Change `PORT=3001` in `.env`
- Or find and kill the process using port 3000

### "Module not found"
- Delete `node_modules` folder
- Run `npm install` again

## Test API Endpoints

Once server is running:

### Health Check
```powershell
curl http://localhost:3000/health
```

### Get Nearby Dining Halls
```powershell
curl "http://localhost:3000/api/dining-halls/nearby?latitude=42.3601&longitude=-71.0942"
```

### Or use browser:
- http://localhost:3000/health
- http://localhost:3000/api/dining-halls/nearby?latitude=42.3601&longitude=-71.0942

## Next Steps After Server Starts

✅ Server running = Backend is ready!
- ✅ Database connected
- ✅ API endpoints available
- ✅ Matching service running

Next:
- Set up Stripe keys (optional for now)
- Test the "Find Host Now" endpoint
- Start building iOS app

