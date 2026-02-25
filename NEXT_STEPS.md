# Next Steps After Database Setup

## ✅ Step 1: Update .env File

Open your `.env` file and update the database password:

```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/swipeshare
```

Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

**Quick edit:**
- Open `.env` in Notepad or VS Code
- Find the line: `DATABASE_URL=postgresql://postgres:password@localhost:5432/swipeshare`
- Replace `password` with your actual PostgreSQL password
- Save the file

## ✅ Step 2: Install Dependencies

Run in PowerShell or CMD:

```powershell
npm install
```

This will install all Node.js packages needed for the backend.

## ✅ Step 3: Test Database Connection

Start the development server:

```powershell
npm run dev
```

You should see:
```
✅ Database connected
🚀 Server running on port 3000
📱 Environment: development
🔄 Starting matching service...
```

If you see errors, check:
- Database password in `.env` is correct
- PostgreSQL service is running
- Database `swipeshare` exists

## ✅ Step 4: Test API Endpoint

Open a browser or use curl:

```powershell
# Health check
curl http://localhost:3000/health

# Or in browser:
# http://localhost:3000/health
```

You should see:
```json
{"status":"ok","timestamp":"2024-..."}
```

## ✅ Step 5: Set Up Stripe (Optional for now)

1. Sign up at https://stripe.com
2. Get test keys from Dashboard → API Keys
3. Update `.env`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

## ✅ Step 6: Generate JWT Secret

Generate a secure random string:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and update `.env`:
```bash
JWT_SECRET=your-generated-hex-string-here
```

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running: `Get-Service postgresql*`
- Verify password in `.env` is correct
- Test connection: `psql -U postgres -d swipeshare`

### "Module not found"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

### "Port 3000 already in use"
- Change `PORT=3001` in `.env`
- Or kill the process using port 3000

## What's Next?

Once the server is running:
- ✅ Backend API is ready
- ✅ Database is set up
- ✅ You can test API endpoints
- ⏭️ Next: Set up Stripe keys (optional)
- ⏭️ Next: Test the "Find Host Now" endpoint

## Quick Test Commands

```powershell
# Test health endpoint
curl http://localhost:3000/health

# Test dining halls endpoint (after server is running)
curl "http://localhost:3000/api/dining-halls/nearby?latitude=42.3601&longitude=-71.0942"
```

