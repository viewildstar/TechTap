# Environment Variables Setup Guide

## Quick Setup

1. The `.env` file has been created with placeholder values
2. Update each section with your actual credentials
3. Never commit `.env` to git (it's in `.gitignore`)

## Required Configuration

### 1. Database (PostgreSQL)

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL if not installed
# Windows: Download from https://www.postgresql.org/download/windows/
# Or use: https://www.postgresql.org/download/

# Create database
createdb swipeshare
# Or using psql:
# psql -U postgres
# CREATE DATABASE swipeshare;

# Update .env:
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/swipeshare
```

**Option B: Cloud Database (Recommended for production)**
- [Supabase](https://supabase.com) - Free tier available
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Railway](https://railway.app) - Easy setup

Update `.env` with the connection string they provide.

### 2. Stripe API Keys

1. Sign up at https://stripe.com (free)
2. Go to Dashboard → Developers → API Keys
3. Copy your **Test** keys:
   - Secret Key: `sk_test_...`
   - Publishable Key: `pk_test_...`

Update `.env`:
```bash
STRIPE_SECRET_KEY=sk_test_51AbCdEf...
STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEf...
```

**Test Mode**: Use test keys (starts with `sk_test_` / `pk_test_`)
- No real charges
- Use test cards: `4242 4242 4242 4242`

### 3. JWT Secret

Generate a secure random string:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use an online generator
# https://randomkeygen.com/
```

Update `.env`:
```bash
JWT_SECRET=your-generated-64-character-hex-string
```

### 4. Email Configuration (Optional for MVP)

For email verification codes, you can:

**Option A: Gmail (Free)**
1. Enable 2FA on your Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

**Option B: Skip for MVP**
- Comment out email fields
- Use manual verification for testing
- Add email service later

### 5. Redis (Optional)

**Option A: Local Redis**
```bash
# Windows: Download from https://github.com/microsoftarchive/redis/releases
# Or use WSL: sudo apt-get install redis-server

# Update .env:
REDIS_URL=redis://localhost:6379
```

**Option B: Cloud Redis**
- [Upstash](https://upstash.com) - Free tier
- [Redis Cloud](https://redis.com/cloud) - Free tier

**Option C: Skip for MVP**
- Comment out `REDIS_URL`
- Rate limiting will use in-memory store (works for development)

## Minimum Setup for Testing

For quick testing, you only need:

```bash
# 1. Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/swipeshare

# 2. JWT Secret (any random string)
JWT_SECRET=dev-secret-key-change-in-production

# 3. Stripe (test keys)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

Everything else can be commented out or use defaults.

## Verification

After setting up, test your configuration:

```bash
# Install dependencies
npm install

# Try to start server (will show errors if config is wrong)
npm run dev
```

## Security Notes

1. **Never commit `.env` to git** ✅ (already in `.gitignore`)
2. **Use test keys for development**
3. **Generate strong JWT secret for production**
4. **Use environment-specific files**:
   - `.env.development`
   - `.env.production`
   - `.env.test`

## Production Checklist

Before deploying to production:

- [ ] Use production Stripe keys (`sk_live_...`)
- [ ] Use strong JWT secret (64+ characters)
- [ ] Use production database (not localhost)
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper email service
- [ ] Set up Redis for rate limiting
- [ ] Configure CORS for your domain
- [ ] Set up SSL/HTTPS

## Need Help?

- Database issues: Check PostgreSQL is running
- Stripe issues: Verify keys are correct (test vs live)
- Email issues: Check App Password is correct (Gmail)
- Connection errors: Verify URLs and ports

