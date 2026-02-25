# Stripe Integration Setup Guide

## Backend Setup

### 1. Get Stripe API Keys

1. Sign up at https://stripe.com (free)
2. Go to Developers → API Keys
3. Copy your **Secret Key** (starts with `sk_test_` for test mode)
4. Copy your **Publishable Key** (starts with `pk_test_` for test mode)

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 3. Test Mode vs Live Mode

- **Test Mode**: Use test keys (starts with `sk_test_` / `pk_test_`)
  - No real charges
  - Use test card numbers (see below)
  - Perfect for development

- **Live Mode**: Use live keys (starts with `sk_live_` / `pk_live_`)
  - Real charges
  - Switch in Stripe Dashboard when ready for production

### 4. Test Card Numbers

Use these in test mode:

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires 3D Secure: 4000 0025 0000 3155
```

Any future expiry date, any 3-digit CVC, any ZIP code.

## iOS Setup

### 1. Add Stripe iOS SDK

**Option A: Swift Package Manager (Recommended)**

1. In Xcode, go to File → Add Packages...
2. Enter: `https://github.com/stripe/stripe-ios`
3. Select version: `23.x.x` (or latest)
4. Add to target: SwipeShare

**Option B: CocoaPods**

Add to `Podfile`:
```ruby
pod 'Stripe'
pod 'StripePaymentSheet'
```

### 2. Configure Stripe in App

Update `ios/SwipeShare/App/SwipeShareApp.swift`:

```swift
import SwiftUI
import Stripe

@main
struct SwipeShareApp: App {
    init() {
        // Set your publishable key
        StripeAPI.defaultPublishableKey = "pk_test_your_publishable_key_here"
    }
    
    var body: some Scene {
        WindowGroup {
            HomeView()
        }
    }
}
```

### 3. Update Info.plist

Add to allow HTTP connections (for test mode):
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

**Note**: Remove this in production and use HTTPS only.

### 4. Implement Payment Sheet

See `ios/SwipeShare/Services/PaymentService.swift` for integration example.

## Stripe Connect Setup (for Hosts)

### 1. Enable Connect in Stripe Dashboard

1. Go to Stripe Dashboard → Connect
2. Enable Express accounts
3. Configure settings

### 2. Host Onboarding Flow

1. Host taps "Set up to receive payments"
2. Backend creates Connect account
3. Backend creates account link
4. Host completes onboarding in browser
5. Host returns to app
6. Host can now receive payments

## Testing the Integration

### 1. Test Payment Flow

1. Create a match (payment intent is created)
2. Use test card: `4242 4242 4242 4242`
3. Complete match (payment is captured)
4. Check Stripe Dashboard → Payments to see transaction

### 2. Test Refunds

1. Complete a match
2. Call refund endpoint
3. Check Stripe Dashboard → Refunds

### 3. Test Connect

1. Host sets up Connect account
2. Complete a match
3. Check Stripe Dashboard → Connect → Accounts
4. Verify transfer to host account

## Webhook Setup (Optional, for Production)

For production, set up webhooks to handle:
- Payment succeeded
- Payment failed
- Refund processed
- Dispute created

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-api.com/api/webhooks/stripe`
3. Select events to listen to
4. Add webhook secret to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

## Cost Summary

- **Setup**: Free
- **Test Mode**: Free (unlimited test transactions)
- **Live Mode**: 2.9% + $0.30 per transaction
- **Connect**: Additional 0.25% on transfers (optional)

## Next Steps

1. ✅ Add Stripe keys to `.env`
2. ✅ Install Stripe iOS SDK
3. ✅ Configure publishable key in iOS app
4. ✅ Test with test cards
5. ⏭️ Switch to live mode when ready for production

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe iOS SDK](https://github.com/stripe/stripe-ios)
- [Stripe Connect Guide](https://stripe.com/docs/connect)
- [Test Cards](https://stripe.com/docs/testing)

