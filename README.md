# SwipeShare - MIT Meal Swipe Marketplace

A mobile app that matches MIT students with surplus meal plan swipes to students who want dining hall meals at discounted prices.

## Project Structure

```
.
├── backend/          # Node.js/TypeScript API server
├── ios/              # SwiftUI iOS app
├── database/         # Database migrations and seeds
└── docs/             # Documentation
```

## Quick Start

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up PostgreSQL database:
```bash
createdb swipeshare
npm run db:migrate
```

4. Start development server:
```bash
npm run dev
```

### iOS Setup

See `ios/README.md` for iOS app setup instructions.

## Features

- **Find Host Now**: Location-based quick request with auto-detection
- **Automatic Matching**: Smart algorithm matching hosts and guests
- **Payment Escrow**: Secure payments via Stripe Connect
- **Real-time Coordination**: WebSocket-based chat and status updates
- **Trust & Safety**: Ratings, reliability scores, reporting

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **iOS**: SwiftUI, Swift 5.9+
- **Payments**: Stripe Connect
- **Real-time**: WebSocket
- **Location**: CoreLocation (iOS)

## Documentation

See `MIT_Meal_Swipe_App_Specification.md` for complete product specification.
