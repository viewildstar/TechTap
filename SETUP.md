# SwipeShare Setup Guide

## Backend Setup

### Prerequisites
- Node.js 20+ installed
- PostgreSQL 15+ installed and running
- npm or yarn

### Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Create database:**
```bash
createdb swipeshare
# Or using psql:
# psql -U postgres -c "CREATE DATABASE swipeshare;"
```

4. **Run database migrations:**
```bash
psql -U postgres -d swipeshare -f database/migrations/001_initial_schema.sql
```

5. **Start development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## iOS Setup

### Prerequisites
- Xcode 15+ installed
- iOS 16.0+ target
- macOS for development

### Steps

1. **Open Xcode and create new project:**
   - Choose "iOS" → "App"
   - Product Name: `SwipeShare`
   - Interface: `SwiftUI`
   - Language: `Swift`
   - Minimum iOS: `16.0`

2. **Add files to project:**
   - Copy all files from `ios/SwipeShare/` to your Xcode project
   - Maintain the folder structure:
     - `App/SwipeShareApp.swift`
     - `Models/` (all model files)
     - `Views/` (all view files)
     - `Services/` (all service files)
     - `Utils/Constants.swift`

3. **Configure Info.plist:**
   Add location permissions:
   ```xml
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>We need your location to find the nearest dining hall</string>
   <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
   <string>We need your location to coordinate meetings</string>
   ```

4. **Update API URL:**
   - Edit `ios/SwipeShare/Utils/Constants.swift`
   - Change `apiBaseURL` to your backend URL (or keep `http://localhost:3000/api` for simulator)

5. **Build and run:**
   - Select a simulator or device
   - Press Cmd+R to build and run

## Testing

### Backend API
Test endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:3000/health

# Get nearby dining halls
curl "http://localhost:3000/api/dining-halls/nearby?latitude=42.3601&longitude=-71.0942"
```

### iOS App
1. Run the app in simulator
2. Grant location permissions when prompted
3. Tap "Find Host Now" button
4. App should detect nearest dining hall and create request

## Next Steps

- [ ] Set up Stripe account and configure payment integration
- [ ] Configure email service for verification codes
- [ ] Set up push notifications (APNs)
- [ ] Deploy backend to production
- [ ] Test end-to-end flow

## Troubleshooting

### Backend Issues
- **Database connection error**: Check PostgreSQL is running and DATABASE_URL is correct
- **Port already in use**: Change PORT in .env or kill process using port 3000

### iOS Issues
- **Location not working**: Check Info.plist permissions
- **API connection failed**: Verify backend is running and URL is correct
- **Build errors**: Ensure all files are added to Xcode project target

