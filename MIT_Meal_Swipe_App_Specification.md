# MIT Meal Swipe Marketplace - Product Specification

**Version:** 1.0  
**Date:** 2024  
**Status:** MVP Build-Ready

---

## Table of Contents

1. [Product Requirements Document (PRD)](#1-product-requirements-document-prd)
2. [UX / Information Architecture](#2-ux--information-architecture)
3. [Marketplace Mechanics](#3-marketplace-mechanics)
4. [Data Model](#4-data-model)
5. [Technical Architecture](#5-technical-architecture)
6. [Launch Plan](#6-launch-plan)
7. [Copy & Policy](#7-copy--policy)

---

## 1. Product Requirements Document (PRD)

### 1.1 Problem Statement

MIT students with meal plans often have unused swipes that expire, while other students (without meal plans or with insufficient swipes) pay full retail price for dining hall meals. The current system lacks a mechanism to efficiently match students with surplus swipes to those who need meals, resulting in:
- Wasted meal plan value for hosts
- Higher food costs for guests
- No coordination platform for guest swipe-ins

### 1.2 Goals

**Primary Goals:**
- Reduce wasted meal swipes by 30%+ within 6 months
- Enable guests to access dining halls at 40-60% below retail price
- Minimize coordination friction (target: <5 minutes from match to swipe-in)
- Maintain 95%+ transaction completion rate

**Secondary Goals:**
- Build trust through reliability scores and ratings
- Create sustainable marketplace liquidity
- Ensure safety and prevent harassment

### 1.3 Non-Goals

- Social dining features (this is transactional, not social)
- Integration with MIT dining systems (no official API access)
- Meal plan management or purchase
- Food ordering or delivery
- Multi-university expansion (MVP scope: MIT only)

### 1.4 Key Metrics

**Engagement Metrics:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Match rate: % of listings that result in matches
- Time-to-match: median time from listing creation to match

**Transaction Metrics:**
- Completion rate: % of matches that result in successful swipe-in
- No-show rate: % of matches where guest/host doesn't arrive
- Average transaction value
- Marketplace GMV (Gross Merchandise Value)

**Trust & Safety:**
- Report rate: reports per 100 transactions
- Block rate: blocks per 100 users
- Average reliability score
- Dispute rate: disputes per 100 transactions

**Business Metrics:**
- Platform fee revenue (if applicable post-MVP)
- User acquisition cost
- Retention rate (30-day, 90-day)

### 1.5 Personas

#### Persona 1: Host (Sarah)
- **Demographics:** Sophomore, on-campus, full meal plan
- **Pain Points:** 
  - Has 8-10 unused swipes per week
  - Swipes expire at end of semester
  - Wants to recoup some value
- **Goals:** 
  - Sell unused swipes easily
  - Minimal time commitment (5-10 min max)
  - Reliable guests who show up
- **Tech Comfort:** High (uses Venmo, Uber regularly)
- **Jobs-to-be-Done:**
  - List availability quickly when heading to dining hall
  - Get matched with a guest automatically
  - Meet briefly at entrance, swipe guest in, get paid
  - Build reputation for future matches

#### Persona 2: Guest (Alex)
- **Demographics:** Junior, off-campus, no meal plan
- **Pain Points:**
  - Dining hall meals cost $15-18 retail
  - Limited budget for food
  - Wants access to dining hall variety
- **Goals:**
  - Access dining halls at discounted rate ($6-10)
  - Reliable hosts who show up
  - Quick, frictionless process
- **Tech Comfort:** High
- **Jobs-to-be-Done:**
  - Find available swipes near desired time/location
  - Book quickly with payment held in escrow
  - Arrive at dining hall, meet host, get swiped in
  - Confirm completion to release payment

### 1.6 User Journeys

#### Journey 1: ASAP Match (Host-initiated)

1. **Host opens app** → Sees home screen with "List My Swipe" CTA
2. **Host taps "List My Swipe"** → Quick form:
   - Select dining hall (dropdown: Maseeh, Next, Baker, etc.)
   - Select time window (default: "Now" or "In 15 min" or custom)
   - Set price (suggested: $7-9, with slider)
   - Tap "List"
3. **App creates listing** → Shows "Looking for guest..." with countdown (5 min max wait)
4. **Guest matches** → Host receives push: "Guest matched! Meet at [Hall] entrance in 5 min"
5. **Host navigates to entrance** → Taps "I'm here" when at entrance desk
6. **Guest arrives** → Taps "I'm here" → Both see each other's location (approximate, 50m radius)
7. **Host swipes guest in** → Host taps "Swiped in" → Guest confirms "I'm in"
8. **Payment releases** → Host receives payment, both can rate

**Total time:** 5-10 minutes

#### Journey 2: Quick Request (Guest-initiated, Primary Flow)

1. **Guest opens app** → Sees home screen with prominent "Find Host Now" button
2. **Guest taps "Find Host Now"** → 
   - App requests location permission (if first time)
   - Gets GPS coordinates
   - Determines nearest dining hall (within 500m)
   - Auto-creates request:
     - Dining hall: Nearest (e.g., "Maseeh")
     - Time: "Now" (immediately)
     - Max price: $22 (auto-set)
   - Shows: "Found Maseeh Hall (0.2 mi away). Finding host..."
3. **App matches with host** → Guest receives push: "Host found! Meet at [Hall] in 5 min"
4. **Both navigate** → Coordination flow begins
5. **At entrance** → Same as Journey 1 steps 6-8

**Total time:** 5-10 minutes (quick request)

#### Journey 3: Scheduled Match (Guest-initiated, Manual)

1. **Guest opens app** → Taps "Browse Listings" or "Request a Swipe" (manual)
2. **Guest taps "Request"** → Form:
   - Select dining hall (manual picker)
   - Select time (now, +30 min, +1 hour, custom)
   - Max price willing to pay (slider: $5-$22, default $22)
   - Tap "Request"
3. **App matches with host** → Guest receives push: "Host found! Meet at [Hall] in 20 min"
4. **Both navigate** → 10 min before, both get "Time to head to [Hall]" push
5. **At entrance** → Same as Journey 1 steps 6-8

**Total time:** 20-30 minutes (scheduled)

### 1.7 Feature List

#### MVP Features (v1.0)

**Core Matching:**
- Host listing creation (dining hall, time, price)
- Guest request creation (dining hall, time, max price)
- **Quick request: "Find Host Now" with location-based auto-detection**
- Automatic matching algorithm (proximity, time, price)
- Real-time match notifications

**Coordination:**
- In-app chat (text only, no media)
- "I'm here" status with approximate location sharing
- Countdown timer for meeting window
- Auto-expire listings/requests after timeout

**Payments:**
- Stripe Connect integration for escrow
- Payment hold on match
- Auto-release on completion confirmation
- Manual refund flow for disputes

**Trust & Safety:**
- MIT email verification (or SSO if available)
- User profiles (name, photo optional, reliability score)
- Ratings (1-5 stars + optional text)
- Reporting and blocking
- Reliability score calculation

**Basic UX:**
- Home screen (listings/requests feed)
- Profile screen
- Match detail screen
- Chat screen
- Settings

#### v2.0 Features (Post-MVP)

- Recurring availability (host can set weekly patterns)
- Group swipes (host can swipe in 2-3 guests)
- Favorite hosts/guests
- Price history and trends
- Advanced filtering (by reliability score, price range)
- Push notification preferences
- Dining hall capacity indicators (crowdsourced)
- Waitlist for popular times

#### v3.0 Features (Future)

- Referral program
- Loyalty rewards
- Integration with MIT calendar (avoid class conflicts)
- Dining hall menu integration
- Social features (optional: "dine together" mode)

### 1.8 Functional Requirements

#### FR1: User Authentication
- **FR1.1:** Users must verify MIT email address during signup
- **FR1.2:** Alternative: MIT SSO integration if available
- **FR1.3:** Users must provide phone number (for SMS verification)
- **FR1.4:** Users must complete profile (name, optional photo)
- **Acceptance Criteria:**
  - Signup flow completes in <2 minutes
  - Email verification link expires in 24 hours
  - Users cannot create listings without verified account

#### FR2: Listing Creation
- **FR2.1:** Hosts can create listings with: dining hall, time window, price
- **FR2.2:** Time window options: "Now", "+15 min", "+30 min", "+1 hour", custom
- **FR2.3:** Price range: $5-$22 (enforced)
- **FR2.4:** Listings auto-expire if no match after 5 minutes (ASAP) or at selected time
- **FR2.5:** Hosts can cancel listing before match (no penalty)
- **Acceptance Criteria:**
  - Listing creation takes <30 seconds
  - Listings appear in feed within 2 seconds
  - Expired listings are removed automatically

#### FR2A: Location-Based Guest Request (Quick Request)
- **FR2A.1:** "Find Host Now" button automatically:
  - Requests location permission (if not granted)
  - Gets current GPS coordinates
  - Determines nearest dining hall (within 500m radius)
  - Creates request with: nearest dining hall, time "Now", max price $22
- **FR2A.2:** Location detection uses predefined dining hall coordinates (stored in app)
- **FR2A.3:** If no dining hall within 500m, show manual picker
- **FR2A.4:** If multiple dining halls nearby, show picker with nearest highlighted
- **FR2A.5:** Location data used only for dining hall detection, not stored permanently
- **Acceptance Criteria:**
  - Location detection completes within 3 seconds
  - Dining hall detection accuracy: 95%+ within 500m
  - Request creation from "Find Host Now" takes <5 seconds total
  - Fallback to manual selection if location unavailable

#### FR3: Matching Algorithm
- **FR3.1:** Match guests to hosts based on: dining hall match, time compatibility, price compatibility
- **FR3.2:** Ranking factors: host reliability score, guest reliability score, price (lower first for guests)
- **FR3.3:** One-to-one matching (one guest per host per listing)
- **FR3.4:** Match notification sent within 10 seconds of compatibility
- **Acceptance Criteria:**
  - 90%+ of listings match within 5 minutes (during active hours)
  - No duplicate matches for same listing
  - Match notifications delivered within 15 seconds

#### FR4: Payment Escrow
- **FR4.1:** On match, guest's payment method is charged and held in escrow
- **FR4.2:** Payment held for up to 2 hours (covers meeting window + meal)
- **FR4.3:** Payment auto-releases to host when both parties confirm completion
- **FR4.4:** If no confirmation after 2 hours, payment held for dispute resolution
- **FR4.5:** Refund available if host cancels after match (full refund) or guest no-shows (host keeps 50%, guest refunded 50%)
- **Acceptance Criteria:**
  - Payment authorization succeeds 99%+ of time
  - Escrow release happens within 5 minutes of dual confirmation
  - Refund processing completes within 24 hours

#### FR5: Coordination Flow
- **FR5.1:** After match, both parties enter "coordination" state
- **FR5.2:** Chat enabled between matched parties
- **FR5.3:** "I'm here" button appears 5 minutes before meeting time
- **FR5.4:** Location sharing (approximate, 50m radius) when both tap "I'm here"
- **FR5.5:** Meeting window: 10 minutes (if guest/host doesn't arrive, can mark "no-show")
- **FR5.6:** After swipe-in, host confirms "Swiped in", guest confirms "I'm in"
- **Acceptance Criteria:**
  - Location sharing accuracy: ±50m
  - "I'm here" status updates within 3 seconds
  - Chat messages deliver within 2 seconds

#### FR6: No-Show Handling
- **FR6.1:** If host doesn't arrive within 10 minutes of meeting time, guest can mark "Host no-show"
- **FR6.2:** If guest doesn't arrive within 10 minutes, host can mark "Guest no-show"
- **FR6.3:** No-show penalties:
  - Host no-show: Full refund to guest, host reliability score -2 points
  - Guest no-show: 50% refund to guest, 50% to host, guest reliability score -2 points
- **FR6.4:** After 3 no-shows in 30 days, user account suspended for 7 days
- **Acceptance Criteria:**
  - No-show detection happens automatically after 10 min + 2 min grace
  - Penalties applied within 1 hour
  - Suspension notifications sent immediately

#### FR7: Ratings & Reliability
- **FR7.1:** After completion, both parties can rate (1-5 stars) and optional text
- **FR7.2:** Ratings must be submitted within 24 hours
- **FR7.3:** Reliability score formula: Base 100, +1 per successful transaction, -2 per no-show, -5 per report
- **FR7.4:** Reliability score visible on profiles (rounded to nearest 5)
- **Acceptance Criteria:**
  - Ratings submitted by 80%+ of users
  - Reliability score updates within 5 minutes of rating/submission
  - Scores displayed accurately on profiles

#### FR8: Reporting & Blocking
- **FR8.1:** Users can report others for: harassment, inappropriate behavior, fraud, other
- **FR8.2:** Users can block others (prevents future matches)
- **FR8.3:** Reports trigger admin review (manual, 24-hour SLA)
- **FR8.4:** Blocked users cannot see each other's listings or match
- **Acceptance Criteria:**
  - Report submission succeeds 100% of time
  - Block takes effect immediately
  - Admin dashboard shows reports within 1 minute

### 1.9 Non-Functional Requirements

#### Performance
- **NFR1:** App launch time: <2 seconds (cold start)
- **NFR2:** API response time: <200ms (p95)
- **NFR3:** Real-time updates latency: <3 seconds
- **NFR4:** Image loading: <1 second (on WiFi)

#### Reliability
- **NFR5:** Uptime: 99.5% (target: 99.9%)
- **NFR6:** Payment processing success rate: 99.9%
- **NFR7:** Match notification delivery: 99%+ within 15 seconds

#### Security
- **NFR8:** All API calls over HTTPS/TLS 1.3
- **NFR9:** Payment data: PCI-DSS compliant (via Stripe)
- **NFR10:** User data encryption at rest (AES-256)
- **NFR11:** Rate limiting: 100 requests/minute per user
- **NFR12:** MIT email verification: cryptographic proof required

#### Privacy
- **NFR13:** Phone numbers not exposed in-app (use in-app chat only)
- **NFR14:** Location data: approximate only (±50m), deleted after 1 hour
- **NFR15:** Chat messages: end-to-end encrypted (optional v2)
- **NFR16:** GDPR/CCPA compliance: data export and deletion available

#### Scalability
- **NFR17:** Support 1,000 concurrent users (MVP)
- **NFR18:** Database: handle 10,000 users, 1,000 daily transactions
- **NFR19:** Auto-scale backend during peak hours (lunch: 11:30-1:30, dinner: 5:30-7:30)

---

## 2. UX / Information Architecture

### 2.1 App Information Architecture

```
App Structure (Tab Bar Navigation - 4 tabs)

├── Home Tab
│   ├── Feed (Listings + Requests)
│   ├── Create Listing (Host)
│   ├── Create Request (Guest)
│   └── Match Detail (when matched)
│
├── Matches Tab
│   ├── Active Matches
│   ├── Past Matches
│   └── Match Detail → Chat → Coordination
│
├── Profile Tab
│   ├── My Profile
│   ├── Reliability Score
│   ├── Ratings Received
│   ├── Settings
│   └── Help & Support
│
└── Notifications Tab (or in-app)
    ├── Match Notifications
    ├── Chat Messages
    └── System Alerts
```

### 2.2 Screen-by-Screen Specifications

#### Screen 1: Onboarding / Signup

**Purpose:** Verify MIT affiliation and create account

**Layout:**
- Welcome screen (splash): "SwipeShare - MIT Meal Swipe Marketplace"
- Step 1: Email input → "Enter your MIT email (@mit.edu)"
- Step 2: Verification code sent → "Check your email"
- Step 3: Phone number → "For account security" (SMS verification)
- Step 4: Profile setup → Name, optional photo, bio (optional)

**Microcopy:**
- CTA: "Continue with MIT Email"
- Error: "Please use a valid @mit.edu email address"
- Success: "Verification email sent! Check your inbox."

**Edge Cases:**
- Email already registered → "Account exists. Sign in instead?"
- Verification code expired → "Code expired. Resend?"
- Phone verification fails → "SMS failed. Try again or skip (less secure)"

---

#### Screen 2: Home / Feed

**Purpose:** Primary entry point - Quick guest request or browse listings

**Layout:**
- **Primary CTA (Large, Prominent Button at Top):**
  - "Find Host Now" button (full-width, primary color, large text)
  - Icon: Location pin + clock
  - When tapped:
    1. Requests location permission (if not granted)
    2. Gets current GPS location
    3. Determines nearest dining hall automatically
    4. Creates request with:
       - Dining hall: Auto-detected (nearest)
       - Time: "Now" (immediately)
       - Max price: $22 (auto-set)
    5. Shows loading: "Finding nearest dining hall..."
    6. Redirects to match detail screen once request created
- **Secondary Options (Below Primary CTA):**
  - "Browse Listings" button (secondary style)
  - "List My Swipe" button (for hosts)
- **Feed Section (Below Buttons, Scrollable):**
  - Segmented control: "Listings" | "Requests"
  - Listings view: Cards showing:
    - Host name (first name only)
    - Dining hall name + icon
    - Time: "Now" or "In 15 min" or "12:30 PM"
    - Price: "$8"
    - Host reliability: ⭐⭐⭐⭐⭐ (5/5) or score: 95
    - CTA: "Request Swipe"
  - Requests view: Similar cards (guest-initiated)

**Microcopy:**
- Primary CTA: "Find Host Now" (with subtitle: "Auto-find nearest dining hall")
- Loading (location): "Finding your location..."
- Loading (dining hall): "Detecting nearest dining hall..."
- Loading (request): "Creating request..."
- Error (location denied): "Location access needed. Enable in Settings to find nearest dining hall."
- Error (location error): "Couldn't get location. Try again or select dining hall manually."
- Error (no dining hall nearby): "No dining hall detected nearby. Select one manually."
- Empty state: "No listings yet. Be the first to list your swipe!"
- Error: "Couldn't load listings. Pull to refresh."

**Edge Cases:**
- Location permission denied → Show manual dining hall picker
- Location services off → Prompt to enable, fallback to manual selection
- No dining hall within 500m → Show: "No dining hall nearby. Select one manually" with picker
- Multiple dining halls nearby → Show picker with nearest highlighted: "Nearest: Maseeh (0.2 mi)"
- User already has active match → Show banner: "You have an active match" and disable "Find Host Now"
- Network error → Retry button

---

#### Screen 3: Create Listing (Host)

**Purpose:** Host creates availability listing

**Layout:**
- Header: "List Your Swipe"
- Form fields:
  1. Dining hall (picker): Maseeh, Next House, Baker, Simmons, etc.
  2. Time (segmented): "Now" | "+15 min" | "+30 min" | "+1 hour" | "Custom"
     - If custom: Time picker appears
  3. Price (slider): $5 - $22, default $8
     - Display: "Price: $8" with slider
     - Helper text: "Suggested: $7-9 (guests can pay up to $22)"
- CTA: "List My Swipe" (primary button)

**Microcopy:**
- Helper text: "You'll meet the guest at the dining hall entrance to swipe them in."
- Price tooltip: "Guests typically pay $7-9. Higher prices may take longer to match."
- Success: "Listing created! We're finding a guest..."

**Edge Cases:**
- User has active listing → "You already have a listing. Cancel it first?"
- Dining hall closed → "This dining hall is closed. Select another."
- Time in past → "Please select a future time."

---

#### Screen 4: Create Request (Guest)

**Purpose:** Guest requests a swipe (manual flow, if not using "Find Host Now")

**Layout:**
- Similar to Create Listing, but:
  - Header: "Request a Swipe"
  - Dining hall (picker): Maseeh, Next House, Baker, Simmons, etc.
  - Time (segmented): "Now" | "+15 min" | "+30 min" | "+1 hour" | "Custom"
  - Price field: "Max price willing to pay" (slider: $5-$22, default $22)
  - CTA: "Request Swipe"

**Microcopy:**
- Helper text: "We'll match you with a host. Meet at the entrance to get swiped in."
- Price helper: "Max price: $22 (covers all dining halls)"
- Success: "Request sent! We're finding a host..."

**Note:** This screen is for manual requests. Most guests will use "Find Host Now" on home screen.

---

#### Screen 5: Match Detail / Coordination

**Purpose:** Show match details and coordinate meeting

**States:**

**State A: Just Matched**
- Header: "🎉 You're Matched!"
- Info cards:
  - Host/Guest name + photo
  - Dining hall + address
  - Meeting time: "Meet in 5 minutes" (countdown)
  - Price: "$8"
- Chat button: "Message [Name]"
- "I'm here" button (disabled until 5 min before)

**State B: Coordination (5 min before)**
- "I'm here" button enabled
- When both tap "I'm here":
  - Location sharing activated (approximate)
  - Map view: Both users' approximate locations (50m radius circles)
  - Text: "You're both here! Find each other at the entrance desk."
- Countdown: "Meeting window: 8:32 remaining"

**State C: At Meeting Point**
- Host actions: "Swiped In" button
- Guest actions: "I'm In" confirmation button
- When both confirm:
  - Success screen: "✅ Swipe complete! Payment processing..."
  - Redirect to rating screen

**State D: No-Show**
- If timeout (10 min):
  - "No-show detected" screen
  - Options: "Mark as no-show" or "Still waiting" (+5 min grace)
  - After marking: Penalty applied, refund processed

**Microcopy:**
- Countdown: "Meet in 4:32" (live countdown)
- "I'm here" tooltip: "Tap when you arrive at the dining hall entrance"
- Location sharing: "📍 Approximate location shared (within 50m)"
- Success: "Payment released! Rate your experience below."

**Edge Cases:**
- Host cancels → Guest sees: "Host cancelled. Full refund processing..."
- Guest cancels → Host sees: "Guest cancelled. Listing reopened."
- Both no-show → Auto-resolve after 12 minutes, penalties applied
- Location services off → "Enable location to see meeting point"

---

#### Screen 6: Chat

**Purpose:** In-app messaging between matched parties

**Layout:**
- Standard chat UI (Messages-style)
- Text input at bottom
- Timestamps on messages
- Read receipts (optional v2)

**Microcopy:**
- Placeholder: "Message [Name]..."
- Empty: "No messages yet. Say hi!"
- System message: "You matched with [Name]. Meet at [Hall] in 5 min."

**Edge Cases:**
- Message fails to send → Retry button
- User blocked → "This user has been blocked. Unblock to message."

---

#### Screen 7: Profile

**Purpose:** User profile and stats

**Layout:**
- Header: Photo, name, MIT email (masked: a***@mit.edu)
- Stats card:
  - Reliability score: 95/100 (large, prominent)
  - Successful swipes: 23
  - Ratings: ⭐⭐⭐⭐⭐ (4.8/5.0)
- Tabs: "Ratings" | "History"
- Settings button (gear icon)

**Microcopy:**
- Reliability explanation: "Based on successful transactions and reliability"
- Empty ratings: "No ratings yet. Complete a swipe to get rated!"

---

#### Screen 8: Settings

**Purpose:** App settings and account management

**Sections:**
- Account: Email, phone, profile photo
- Notifications: Push, email, SMS preferences
- Payments: Payment methods, transaction history
- Privacy: Blocked users, data export
- Safety: Report issue, help center
- About: Version, terms, privacy policy

---

### 2.3 Key Microcopy

#### Buttons
- Primary CTA: "List My Swipe" / "Request Swipe"
- Secondary: "Cancel" / "Back"
- Destructive: "Mark as No-Show" (red)
- Disabled: "I'm here" (gray, until enabled)

#### Error States
- Network: "Connection lost. Check your internet and try again."
- Payment: "Payment failed. Please update your payment method."
- Match failed: "Couldn't find a match. Try again in a few minutes."
- Generic: "Something went wrong. Please try again."

#### Success States
- Listing created: "Listing active! We're finding a guest..."
- Match found: "🎉 You're matched! Meet in 5 minutes."
- Payment complete: "Payment received! Thanks for using SwipeShare."

#### Tooltips / Helper Text
- Price slider: "Guests typically pay $7-9. Higher prices may take longer."
- Reliability score: "Based on successful transactions, punctuality, and ratings."
- Location sharing: "Your approximate location (within 50m) is shared when both parties tap 'I'm here'."

---

### 2.4 Edge-Case Flows

#### Flow 1: Late Arrival

**Scenario:** Guest arrives 8 minutes late (within 10-min window)

**Flow:**
1. Host taps "I'm here" at T+0
2. Guest arrives at T+8, taps "I'm here"
3. Location sharing activates
4. Host sees: "Guest arrived (2 min remaining)"
5. Normal completion flow

**Microcopy:** "Guest arrived. 2 minutes remaining in meeting window."

---

#### Flow 2: Cancellation (Host)

**Scenario:** Host cancels after match but before meeting

**Flow:**
1. Host taps "Cancel" in match detail
2. Confirmation: "Cancel this match? Guest will receive full refund."
3. Host confirms
4. Guest receives push: "Host cancelled. Full refund processing..."
5. Guest's payment refunded (full, within 24 hours)
6. Host's reliability score: -1 (minor penalty)

**Microcopy:**
- Confirmation: "Cancel match? This will refund the guest and slightly lower your reliability score."
- Guest notification: "Host cancelled. You'll receive a full refund within 24 hours."

---

#### Flow 3: Cancellation (Guest)

**Scenario:** Guest cancels after match

**Flow:**
1. Guest taps "Cancel"
2. Confirmation: "Cancel? You'll receive 50% refund. Host keeps 50%."
3. Guest confirms
4. Host receives push: "Guest cancelled. Your listing is reopened."
5. Payment split: 50% to host, 50% refunded to guest
6. Guest reliability: -1

**Microcopy:**
- Confirmation: "Cancel? You'll get 50% back. Host keeps 50% for their time."
- Host notification: "Guest cancelled. You received $4. Listing reopened."

---

#### Flow 4: Dispute

**Scenario:** Guest claims host didn't swipe them in, host claims they did

**Flow:**
1. Guest taps "Report Issue" in match detail
2. Options: "Host didn't swipe me in" | "Other issue"
3. Guest submits report with optional message
4. Payment held (not released)
5. Admin review (24-hour SLA)
6. Admin decision:
   - If guest correct: Full refund, host reliability -5
   - If host correct: Payment released, guest reliability -3
   - If unclear: 50/50 split

**Microcopy:**
- Report screen: "What happened? We'll review within 24 hours."
- Admin decision: "Review complete. [Decision]. Payment [released/refunded]."

---

#### Flow 5: No-Show (Host)

**Scenario:** Host doesn't arrive within 10 minutes

**Flow:**
1. Meeting time arrives
2. Guest taps "I'm here" at T+0
3. Host doesn't tap "I'm here" by T+10
4. Guest sees: "Host hasn't arrived. Mark as no-show?"
5. Guest taps "Mark as No-Show"
6. Full refund to guest (within 1 hour)
7. Host reliability: -2
8. Host receives push: "You were marked as no-show. Reliability score decreased."

**Microcopy:**
- Guest: "Host hasn't arrived. Mark as no-show to get a full refund."
- Host: "You were marked as no-show. Your reliability score decreased by 2 points."

---

#### Flow 6: No-Show (Guest)

**Scenario:** Guest doesn't arrive within 10 minutes

**Flow:**
1. Host taps "I'm here" at T+0
2. Guest doesn't tap "I'm here" by T+10
3. Host sees: "Guest hasn't arrived. Mark as no-show?"
4. Host taps "Mark as No-Show"
5. Payment split: 50% to host, 50% refunded to guest
6. Guest reliability: -2

**Microcopy:**
- Host: "Guest hasn't arrived. Mark as no-show? You'll receive 50% payment."
- Guest: "You were marked as no-show. 50% refunded, 50% paid to host."

---

#### Flow 7: Dining Hall Closed

**Scenario:** User tries to create listing for closed dining hall

**Flow:**
1. User selects dining hall
2. App checks hours (hardcoded or API if available)
3. If closed: Error message
4. User selects different hall or time

**Microcopy:** "[Dining Hall] is closed at this time. Select another hall or time."

**Assumption:** Dining hall hours stored in app (manually updated or crowdsourced)

---

#### Flow 8: Auto-Expire Listing

**Scenario:** Listing expires without match (5 minutes for ASAP, or at selected time)

**Flow:**
1. Listing created
2. Timer counts down
3. At expiry: Listing removed from feed
4. Host receives push: "Your listing expired. No match found. Try again?"
5. Host can create new listing

**Microcopy:** "Listing expired. No match found. Create a new listing?"

---

### 2.5 "Pickup" Style Coordination UX

**Design Philosophy:** Mimic Uber/Lyft pickup flow for minimal friction

**Key Elements:**

1. **Countdown Timer**
   - Prominent, large text
   - Updates every second
   - Color: Green (>5 min), Yellow (2-5 min), Red (<2 min)
   - Example: "Meet in 4:32"

2. **"I'm Here" Button**
   - Large, prominent button
   - Disabled until 5 minutes before meeting time
   - When enabled: Pulsing animation
   - Tapping shows: "📍 Location shared"

3. **Meeting Point**
   - Text: "Meet at [Dining Hall] entrance desk"
   - Map view (optional): Shows approximate locations when both "here"
   - Address: Full address of dining hall

4. **Auto-Expire**
   - Meeting window: 10 minutes
   - After 10 min: "Mark as no-show" appears
   - Grace period: +2 minutes (total 12 min)
   - Auto-resolve if no action

5. **Status Updates**
   - Real-time: "Host is on the way" (when host taps "I'm here")
   - "Both here! Find each other at the entrance."
   - "Swiped in! Confirm to complete."

**Visual Design:**
- Minimal, clean interface
- Large touch targets (44pt minimum)
- High contrast for accessibility
- Status colors: Green (success), Yellow (warning), Red (error)

---

## 3. Marketplace Mechanics

### 3.1 Matching Algorithm v1

#### Rules-Based Matching

**Step 1: Filter Compatible Matches**

For a host listing:
- Guest request must match dining hall (exact match required)
- Guest's max price ≥ host's asking price
- Time compatibility:
  - If host: "Now" → Match with guest: "Now" or "+15 min"
  - If host: "+15 min" → Match with guest: "Now", "+15 min", "+30 min"
  - If host: "+30 min" → Match with guest: "+15 min", "+30 min", "+1 hour"
  - If host: Custom time → Match if guest time within ±15 minutes

For a guest request:
- Host listing must match dining hall
- Host's asking price ≤ guest's max price
- Time compatibility (same rules as above)

**Step 2: Ranking**

Rank compatible matches by score:

```
Score = (Host Reliability × 0.4) + (Guest Reliability × 0.3) + (Price Score × 0.3)

Where:
- Host Reliability = User's reliability score (0-100)
- Guest Reliability = User's reliability score (0-100)
- Price Score = 100 - (Price Difference × 10)
  - Price Difference = |Host Price - Guest Max Price|
  - If host price = guest max price: Price Score = 100
  - If difference = $1: Price Score = 90
  - If difference = $2: Price Score = 80
  - Max difference considered: $5 (Price Score = 50)
```

**Step 3: Selection**

- Select highest-scoring match
- If tie: Prefer lower price (benefits guest)
- If still tie: Prefer user with higher reliability

**Step 4: Match Notification**

- Send push notification to both parties within 10 seconds
- Create match record in database
- Hold payment in escrow

**Example:**

Host listing: Maseeh, "Now", $8, Reliability 95
Guest requests: Maseeh, "Now", Max $10, Reliability 90

Compatibility: ✅ (hall match, price compatible, time compatible)
Score = (95 × 0.4) + (90 × 0.3) + (100 × 0.3) = 38 + 27 + 30 = 95

Match! ✅

---

### 3.2 Pricing Suggestions Model

#### Heuristics

**Base Price Calculation:**
```
Suggested Price = Retail Price × (0.4 to 0.6)

Where Retail Price = $15-18 (varies by dining hall)
```

**Suggested Ranges:**
- Breakfast: $6-8 (retail ~$12)
- Lunch: $7-9 (retail ~$15)
- Dinner: $8-10 (retail ~$18)

**Dynamic Suggestions (v2):**
- If high demand (many guest requests): Suggest +$1
- If low demand: Suggest -$1
- If host reliability <80: Suggest -$0.50 (compensate for risk)

**Guardrails:**
- Minimum: $5 (prevents race to bottom)
- Maximum: $22 (allows flexibility for premium times/halls, still below retail $15-18)
- Default: $8 (middle of typical range)
- Guest max price: $22 (auto-set for "Find Host Now" quick requests)

**UI Implementation:**
- Slider: $5-$22, default $8 (hosts can list up to $22, though typical is $7-9)
- Helper text: "Suggested: $7-9 (saves guest 40-50%)"
- Real-time calculation: "Guest saves: $7 (47% off retail)"
- Quick request ("Find Host Now"): Auto-sets max price to $22

---

### 3.3 Cancellation/No-Show Policy

#### Cancellation Windows

**Before Meeting Time:**
- Host cancels: Full refund to guest, host reliability -1
- Guest cancels: 50% refund to guest, 50% to host, guest reliability -1

**During Meeting Window (0-10 min):**
- Host no-show: Full refund to guest, host reliability -2
- Guest no-show: 50% to host, 50% refund to guest, guest reliability -2

**After Meeting Window (>10 min):**
- Auto-resolve: Same as no-show penalties

#### Penalty Escalation

**Reliability Score Impact:**
- First no-show: -2 points
- Second no-show (30 days): -3 points
- Third no-show (30 days): -5 points + 7-day suspension

**Suspension Rules:**
- 3 no-shows in 30 days → 7-day suspension
- 5 no-shows in 30 days → 30-day suspension
- 7+ no-shows in 30 days → Permanent ban (admin review)

**Refund Processing:**
- Full refunds: Processed within 1 hour
- Partial refunds: Processed within 24 hours
- Disputes: Held until resolution (max 48 hours)

---

### 3.4 Ratings + Reliability Score Formula

#### Ratings

**Scale:** 1-5 stars
**Required:** Star rating
**Optional:** Text review (max 500 characters)

**Rating Factors (for display):**
- Punctuality (derived from "I'm here" timing)
- Communication (chat activity)
- Overall experience (user rating)

**Rating Display:**
- Show on profile: Average rating (e.g., 4.8/5.0)
- Show individual ratings: List of recent ratings with text

**Rating Window:**
- Can rate within 24 hours of completion
- After 24 hours: Rating option expires
- If not rated: No impact on reliability (neutral)

---

#### Reliability Score Formula

**Base Score:** 100 (new users start here)

**Scoring Components:**

```
Reliability Score = Base + Transaction Points - Penalty Points

Where:
- Base = 100
- Transaction Points = +1 per successful transaction (max +50, so max score = 150)
- Penalty Points:
  - No-show: -2 per occurrence
  - Cancellation (after match): -1 per occurrence
  - Report (verified): -5 per occurrence
  - Suspension: -10 per occurrence
```

**Score Decay (v2):**
- After 90 days of inactivity: -1 per month (encourages activity)

**Score Display:**
- Rounded to nearest 5 (e.g., 95, 100, 105)
- Color coding:
  - 90-100+: Green (excellent)
  - 80-89: Yellow (good)
  - 70-79: Orange (fair)
  - <70: Red (poor)

**Score Impact:**
- Higher score → Higher ranking in matching
- Score <70 → Warning banner on profile
- Score <50 → Account review (potential suspension)

**Example Calculation:**

User with:
- 25 successful transactions: +25
- 2 no-shows: -4
- 1 cancellation: -1
- 0 reports: 0

Score = 100 + 25 - 4 - 1 = 120 (displayed as 120)

---

### 3.5 Dispute Resolution Rules

#### Dispute Types

1. **Payment Dispute:** Guest claims host didn't swipe them in
2. **Service Dispute:** Host claims guest was rude/inappropriate
3. **Cancellation Dispute:** Disagreement on who cancelled
4. **Other:** Miscellaneous issues

#### Dispute Process

**Step 1: User Reports Issue**
- User taps "Report Issue" in match detail
- Selects dispute type
- Provides description (optional, max 1000 chars)
- Submits

**Step 2: Payment Hold**
- Payment held in escrow (not released)
- Both parties notified: "Dispute filed. Review in progress."

**Step 3: Admin Review (24-hour SLA)**
- Admin reviews:
  - Chat logs
  - Location data (if available)
  - Timing data ("I'm here" timestamps)
  - User history (reliability, past disputes)

**Step 4: Resolution**

**If Guest Correct (host didn't swipe in):**
- Full refund to guest
- Host reliability: -5
- Host receives warning

**If Host Correct (guest false claim):**
- Payment released to host
- Guest reliability: -3
- Guest receives warning

**If Unclear / Both at Fault:**
- 50/50 split (payment and refund)
- Both reliability: -2

**Step 5: Notification**
- Both parties notified of decision
- Payment processed within 1 hour of decision

#### Dispute Escalation

- If user disputes admin decision: Can appeal (one-time, 48-hour review)
- If appeal successful: Decision reversed, admin notes updated
- If appeal denied: Original decision stands, no further appeals

#### Dispute Prevention

- Encourage communication (chat prompts)
- Clear meeting instructions
- Automatic timeouts (prevent long disputes)

---

## 4. Data Model

### 4.1 Entities and Fields

#### Entity 1: User

```typescript
interface User {
  id: string; // UUID
  email: string; // MIT email (verified)
  phone: string; // Verified phone number
  name: string; // Display name
  photoUrl?: string; // Optional profile photo
  reliabilityScore: number; // 0-150 (default 100)
  averageRating: number; // 0-5 (calculated)
  totalTransactions: number; // Count of completed swipes
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean; // MIT email verified
  isSuspended: boolean;
  suspendedUntil?: Date;
  blockedUserIds: string[]; // Array of blocked user IDs
  paymentMethodId?: string; // Stripe payment method ID
  hostStripeAccountId?: string; // Stripe Connect account (for receiving payments)
}
```

#### Entity 2: Listing (Host Availability)

```typescript
interface Listing {
  id: string; // UUID
  hostId: string; // Foreign key to User
  diningHall: string; // "Maseeh", "Next", "Baker", etc.
  timeWindow: {
    type: "now" | "scheduled";
    scheduledTime?: Date; // If scheduled
    expiresAt: Date; // Auto-expire time
  };
  price: number; // $5-$22
  status: "active" | "matched" | "expired" | "cancelled";
  matchedGuestId?: string; // If matched
  createdAt: Date;
  updatedAt: Date;
}
```

#### Entity 3: Request (Guest Request)

```typescript
interface Request {
  id: string; // UUID
  guestId: string; // Foreign key to User
  diningHall: string;
  timeWindow: {
    type: "now" | "scheduled";
    scheduledTime?: Date;
    expiresAt: Date;
  };
  maxPrice: number; // $5-$22
  status: "active" | "matched" | "expired" | "cancelled";
  matchedHostId?: string; // If matched
  createdAt: Date;
  updatedAt: Date;
}
```

#### Entity 4: Match (Order)

```typescript
interface Match {
  id: string; // UUID
  listingId?: string; // If host-initiated
  requestId?: string; // If guest-initiated
  hostId: string;
  guestId: string;
  diningHall: string;
  meetingTime: Date;
  price: number; // Agreed price
  status: "pending" | "coordinating" | "in_progress" | "completed" | "cancelled" | "disputed" | "no_show";
  
  // Coordination state
  hostArrivedAt?: Date;
  guestArrivedAt?: Date;
  hostConfirmedAt?: Date; // "Swiped in"
  guestConfirmedAt?: Date; // "I'm in"
  
  // Payment
  paymentIntentId: string; // Stripe Payment Intent ID
  paymentStatus: "pending" | "held" | "released" | "refunded" | "disputed";
  paymentAmount: number; // In cents
  
  // Cancellation
  cancelledBy?: "host" | "guest";
  cancelledAt?: Date;
  cancellationReason?: string;
  
  // No-show
  noShowBy?: "host" | "guest";
  noShowAt?: Date;
  
  // Dispute
  disputeId?: string; // Foreign key to Dispute
  disputeFiledBy?: "host" | "guest";
  disputeFiledAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

#### Entity 5: Payment

```typescript
interface Payment {
  id: string; // UUID
  matchId: string; // Foreign key to Match
  hostId: string;
  guestId: string;
  amount: number; // In cents
  platformFee?: number; // In cents (v2, if applicable)
  hostAmount: number; // Amount to host (after fees)
  
  // Stripe
  paymentIntentId: string;
  chargeId?: string;
  transferId?: string; // Stripe Connect transfer to host
  
  status: "pending" | "held" | "released" | "refunded" | "partially_refunded" | "disputed";
  refundAmount?: number; // If refunded
  
  createdAt: Date;
  updatedAt: Date;
  releasedAt?: Date;
  refundedAt?: Date;
}
```

#### Entity 6: Message (Chat)

```typescript
interface Message {
  id: string; // UUID
  matchId: string; // Foreign key to Match
  senderId: string; // Foreign key to User
  recipientId: string; // Foreign key to User
  content: string; // Text content (max 1000 chars)
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}
```

#### Entity 7: Rating

```typescript
interface Rating {
  id: string; // UUID
  matchId: string; // Foreign key to Match
  raterId: string; // User who gave rating
  rateeId: string; // User being rated
  stars: number; // 1-5
  comment?: string; // Optional text (max 500 chars)
  createdAt: Date;
}
```

#### Entity 8: Report

```typescript
interface Report {
  id: string; // UUID
  reporterId: string; // User who reported
  reportedUserId: string; // User being reported
  matchId?: string; // If related to a match
  type: "harassment" | "inappropriate_behavior" | "fraud" | "other";
  description: string; // Max 1000 chars
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  adminNotes?: string;
  resolvedAt?: Date;
  createdAt: Date;
}
```

#### Entity 9: Dispute

```typescript
interface Dispute {
  id: string; // UUID
  matchId: string; // Foreign key to Match
  filedBy: "host" | "guest";
  type: "payment" | "service" | "cancellation" | "other";
  description: string; // Max 1000 chars
  status: "pending" | "under_review" | "resolved" | "appealed";
  resolution?: "guest_correct" | "host_correct" | "unclear" | "both_at_fault";
  adminNotes?: string;
  resolvedAt?: Date;
  resolvedBy?: string; // Admin user ID
  createdAt: Date;
  updatedAt: Date;
}
```

#### Entity 10: AuditLog (Trust & Safety)

```typescript
interface AuditLog {
  id: string; // UUID
  userId: string; // User who performed action
  action: string; // "listing_created", "match_made", "no_show", "cancellation", etc.
  entityType: string; // "listing", "match", "payment", etc.
  entityId: string; // ID of affected entity
  metadata: Record<string, any>; // Additional context
  ipAddress?: string; // For security
  userAgent?: string; // For security
  createdAt: Date;
}
```

### 4.2 State Machines

#### Match State Machine

```
States:
- pending: Just matched, waiting for coordination
- coordinating: Both parties coordinating (chat, "I'm here")
- in_progress: Both confirmed "here", waiting for swipe-in confirmation
- completed: Both confirmed completion, payment released
- cancelled: Cancelled by host or guest
- disputed: Dispute filed, payment held
- no_show: No-show detected, penalties applied

Transitions:
pending → coordinating: When meeting time approaches (5 min before)
coordinating → in_progress: When both tap "I'm here"
in_progress → completed: When both confirm swipe-in
coordinating → no_show: When timeout (10 min) and user marks no-show
in_progress → no_show: When timeout and user marks no-show
pending → cancelled: When host/guest cancels before meeting
coordinating → cancelled: When host/guest cancels during coordination
any → disputed: When user files dispute
disputed → completed/cancelled/no_show: After admin resolution
```

#### Payment State Machine

```
States:
- pending: Payment intent created, not yet charged
- held: Payment charged and held in escrow
- released: Payment released to host
- refunded: Full refund to guest
- partially_refunded: Partial refund (50/50 split)
- disputed: Payment held due to dispute

Transitions:
pending → held: When match is made, payment charged
held → released: When both confirm completion
held → refunded: When host cancels or host no-show
held → partially_refunded: When guest cancels or guest no-show
held → disputed: When dispute filed
disputed → released/refunded/partially_refunded: After admin resolution
```

### 4.3 Audit Log Events

**Events to Log (for Trust & Safety):**

1. **User Actions:**
   - `user_signup`
   - `user_verified` (email verification)
   - `user_suspended`
   - `user_blocked` (user blocks another)

2. **Listing/Request Actions:**
   - `listing_created`
   - `listing_expired`
   - `listing_cancelled`
   - `request_created`
   - `request_expired`
   - `request_cancelled`

3. **Match Actions:**
   - `match_made`
   - `match_cancelled`
   - `match_no_show` (with who: host/guest)
   - `match_completed`

4. **Payment Actions:**
   - `payment_held`
   - `payment_released`
   - `payment_refunded`
   - `payment_partially_refunded`

5. **Trust & Safety:**
   - `report_filed`
   - `dispute_filed`
   - `dispute_resolved`
   - `reliability_score_updated`

6. **Coordination:**
   - `host_arrived` (tapped "I'm here")
   - `guest_arrived`
   - `swipe_confirmed` (host)
   - `completion_confirmed` (guest)

**Log Format:**
```json
{
  "id": "audit_123",
  "userId": "user_456",
  "action": "match_no_show",
  "entityType": "match",
  "entityId": "match_789",
  "metadata": {
    "noShowBy": "guest",
    "matchTime": "2024-01-15T12:00:00Z",
    "noShowAt": "2024-01-15T12:10:00Z"
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "iOS/17.0",
  "createdAt": "2024-01-15T12:10:05Z"
}
```

---

## 5. Technical Architecture

### 5.1 Recommended Stack

#### Mobile (iOS - MVP)
- **Framework:** SwiftUI (iOS 16+)
- **Language:** Swift 5.9+
- **Networking:** URLSession + Combine
- **Real-time:** WebSocket (via Starscream or native)
- **Push Notifications:** APNs (Apple Push Notification service)
- **Payment SDK:** Stripe iOS SDK
- **Location:** CoreLocation
- **State Management:** Combine + @State/@ObservableObject

**Android Considerations (v2):**
- Kotlin + Jetpack Compose
- Retrofit for networking
- Firebase Cloud Messaging (FCM) for push
- Stripe Android SDK

#### Backend
- **Runtime:** Node.js 20+ (TypeScript)
- **Framework:** Express.js or Fastify
- **Database:** PostgreSQL 15+ (primary)
- **Cache:** Redis 7+ (for real-time updates, rate limiting)
- **Real-time:** WebSocket (ws library) or Socket.io
- **Payment:** Stripe API (Connect for marketplace)
- **Auth:** JWT tokens + MIT email verification
- **File Storage:** AWS S3 or Cloudflare R2 (for profile photos)
- **Location Services:** CoreLocation (iOS), geolib or similar for distance calculations

#### Infrastructure
- **Hosting:** AWS (EC2/ECS) or Railway/Render
- **Database Hosting:** AWS RDS (PostgreSQL) or Supabase
- **CDN:** Cloudflare (for static assets)
- **Monitoring:** Sentry (error tracking), Datadog/New Relic (APM)
- **Analytics:** PostHog or Amplitude (event tracking)

#### DevOps
- **CI/CD:** GitHub Actions
- **Containerization:** Docker
- **Environment:** Development, Staging, Production

### 5.2 API Endpoints (REST)

#### Authentication

**POST /api/auth/signup**
```json
Request:
{
  "email": "user@mit.edu",
  "phone": "+1234567890",
  "name": "John Doe"
}

Response (201):
{
  "userId": "user_123",
  "token": "jwt_token_here",
  "requiresVerification": true
}
```

**POST /api/auth/verify-email**
```json
Request:
{
  "email": "user@mit.edu",
  "code": "123456"
}

Response (200):
{
  "verified": true,
  "token": "jwt_token_here"
}
```

**POST /api/auth/login**
```json
Request:
{
  "email": "user@mit.edu",
  "password": "..." // Or SSO token
}

Response (200):
{
  "userId": "user_123",
  "token": "jwt_token_here"
}
```

#### Listings

**POST /api/listings**
```json
Request:
{
  "diningHall": "Maseeh",
  "timeWindow": {
    "type": "now" // or "scheduled"
  },
  "price": 8
}

Response (201):
{
  "id": "listing_123",
  "hostId": "user_456",
  "diningHall": "Maseeh",
  "timeWindow": {
    "type": "now",
    "expiresAt": "2024-01-15T12:05:00Z"
  },
  "price": 8,
  "status": "active",
  "createdAt": "2024-01-15T12:00:00Z"
}
```

**GET /api/listings**
```json
Query Params:
- diningHall?: string
- status?: "active" | "matched" | "expired"
- limit?: number (default 20)
- offset?: number

Response (200):
{
  "listings": [
    {
      "id": "listing_123",
      "host": {
        "id": "user_456",
        "name": "Sarah",
        "reliabilityScore": 95,
        "averageRating": 4.8
      },
      "diningHall": "Maseeh",
      "timeWindow": {
        "type": "now",
        "expiresAt": "2024-01-15T12:05:00Z"
      },
      "price": 8,
      "status": "active"
    }
  ],
  "total": 15,
  "limit": 20,
  "offset": 0
}
```

**DELETE /api/listings/:id**
```json
Response (200):
{
  "cancelled": true,
  "listingId": "listing_123"
}
```

#### Requests

**POST /api/requests**
```json
Request:
{
  "diningHall": "Maseeh",
  "timeWindow": {
    "type": "now"
  },
  "maxPrice": 22
}

Response (201):
{
  "id": "request_123",
  "guestId": "user_789",
  "diningHall": "Maseeh",
  "timeWindow": {
    "type": "now",
    "expiresAt": "2024-01-15T12:05:00Z"
  },
  "maxPrice": 22,
  "status": "active"
}
```

**POST /api/requests/quick** (Location-based quick request)
```json
Request:
{
  "latitude": 42.3601,
  "longitude": -71.0942
}

Response (201):
{
  "id": "request_123",
  "guestId": "user_789",
  "diningHall": "Maseeh", // Auto-detected nearest
  "timeWindow": {
    "type": "now",
    "expiresAt": "2024-01-15T12:05:00Z"
  },
  "maxPrice": 22, // Auto-set
  "status": "active",
  "detectedHall": {
    "name": "Maseeh",
    "distance": 0.2, // miles
    "address": "305 Memorial Dr, Cambridge, MA"
  }
}
```

**GET /api/dining-halls/nearby**
```json
Query Params:
- latitude: number (required)
- longitude: number (required)
- radius?: number (default 500, in meters)

Response (200):
{
  "diningHalls": [
    {
      "id": "maseeh",
      "name": "Maseeh Hall",
      "address": "305 Memorial Dr, Cambridge, MA",
      "distance": 0.2, // miles
      "coordinates": {
        "latitude": 42.3601,
        "longitude": -71.0942
      },
      "isOpen": true,
      "hours": {
        "breakfast": "7:00-10:00",
        "lunch": "11:30-14:00",
        "dinner": "17:30-20:00"
      }
    }
  ],
  "nearest": {
    "id": "maseeh",
    "name": "Maseeh Hall",
    "distance": 0.2
  }
}
```

**GET /api/requests** (similar to listings)

**DELETE /api/requests/:id**

#### Matches

**GET /api/matches**
```json
Query Params:
- status?: "pending" | "coordinating" | "in_progress" | "completed"
- limit?: number
- offset?: number

Response (200):
{
  "matches": [
    {
      "id": "match_123",
      "host": {
        "id": "user_456",
        "name": "Sarah",
        "photoUrl": "...",
        "reliabilityScore": 95
      },
      "guest": {
        "id": "user_789",
        "name": "Alex",
        "photoUrl": "...",
        "reliabilityScore": 90
      },
      "diningHall": "Maseeh",
      "meetingTime": "2024-01-15T12:05:00Z",
      "price": 8,
      "status": "coordinating",
      "hostArrivedAt": null,
      "guestArrivedAt": null,
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ]
}
```

**GET /api/matches/:id**
```json
Response (200):
{
  "id": "match_123",
  "host": {...},
  "guest": {...},
  "diningHall": "Maseeh",
  "meetingTime": "2024-01-15T12:05:00Z",
  "price": 8,
  "status": "coordinating",
  "paymentStatus": "held",
  "hostArrivedAt": null,
  "guestArrivedAt": null,
  "createdAt": "2024-01-15T12:00:00Z"
}
```

**POST /api/matches/:id/arrive**
```json
Request:
{
  "role": "host" // or "guest"
}

Response (200):
{
  "arrived": true,
  "arrivedAt": "2024-01-15T12:05:00Z",
  "otherPartyArrived": false // Whether other party has arrived
}
```

**POST /api/matches/:id/confirm-swipe**
```json
Request:
{
  "role": "host" // Host confirms "Swiped in"
}

Response (200):
{
  "confirmed": true,
  "confirmedAt": "2024-01-15T12:06:00Z",
  "waitingForGuest": true
}
```

**POST /api/matches/:id/confirm-completion**
```json
Request:
{
  "role": "guest" // Guest confirms "I'm in"
}

Response (200):
{
  "completed": true,
  "completedAt": "2024-01-15T12:07:00Z",
  "paymentReleased": true
}
```

**POST /api/matches/:id/cancel**
```json
Request:
{
  "reason": "optional reason"
}

Response (200):
{
  "cancelled": true,
  "refundAmount": 8.00, // If guest cancels, shows 50%
  "cancelledAt": "2024-01-15T12:05:00Z"
}
```

**POST /api/matches/:id/mark-no-show**
```json
Request:
{
  "role": "host" // or "guest", who is marking the no-show
}

Response (200):
{
  "noShowMarked": true,
  "noShowBy": "guest",
  "penaltyApplied": true,
  "refundAmount": 4.00 // If guest no-show, host gets 50%
}
```

#### Messages

**GET /api/matches/:id/messages**
```json
Response (200):
{
  "messages": [
    {
      "id": "msg_123",
      "senderId": "user_456",
      "content": "I'm at the entrance!",
      "isRead": true,
      "createdAt": "2024-01-15T12:05:00Z"
    }
  ]
}
```

**POST /api/matches/:id/messages**
```json
Request:
{
  "content": "I'm at the entrance!"
}

Response (201):
{
  "id": "msg_123",
  "senderId": "user_456",
  "content": "I'm at the entrance!",
  "isRead": false,
  "createdAt": "2024-01-15T12:05:00Z"
}
```

#### Payments

**POST /api/payments/setup**
```json
Request:
{
  "paymentMethodId": "pm_123" // From Stripe SDK
}

Response (200):
{
  "setup": true,
  "customerId": "cus_123"
}
```

**GET /api/payments/history**
```json
Response (200):
{
  "payments": [
    {
      "id": "payment_123",
      "matchId": "match_456",
      "amount": 8.00,
      "status": "released",
      "type": "sent" // or "received"
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ]
}
```

#### Ratings

**POST /api/matches/:id/rating**
```json
Request:
{
  "stars": 5,
  "comment": "Great experience!"
}

Response (201):
{
  "id": "rating_123",
  "stars": 5,
  "comment": "Great experience!",
  "createdAt": "2024-01-15T12:10:00Z"
}
```

#### Reports

**POST /api/reports**
```json
Request:
{
  "reportedUserId": "user_456",
  "matchId": "match_123",
  "type": "harassment",
  "description": "Inappropriate behavior"
}

Response (201):
{
  "id": "report_123",
  "status": "pending",
  "createdAt": "2024-01-15T12:00:00Z"
}
```

#### Users

**GET /api/users/me**
```json
Response (200):
{
  "id": "user_123",
  "email": "a***@mit.edu",
  "name": "John Doe",
  "photoUrl": "...",
  "reliabilityScore": 95,
  "averageRating": 4.8,
  "totalTransactions": 23,
  "isVerified": true
}
```

**GET /api/users/:id**
```json
Response (200):
{
  "id": "user_456",
  "name": "Sarah",
  "photoUrl": "...",
  "reliabilityScore": 95,
  "averageRating": 4.8,
  "totalTransactions": 15
  // Email/phone not exposed
}
```

**POST /api/users/block**
```json
Request:
{
  "userId": "user_456"
}

Response (200):
{
  "blocked": true
}
```

### 5.3 Location Services & Dining Hall Detection

#### Dining Hall Coordinates (Stored in App/Backend)

**Dining Hall Database:**
```typescript
interface DiningHall {
  id: string; // "maseeh", "next", "baker", etc.
  name: string; // "Maseeh Hall"
  address: string; // "305 Memorial Dr, Cambridge, MA 02139"
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number; // Detection radius in meters (default: 500)
  hours: {
    breakfast?: { open: string; close: string };
    lunch?: { open: string; close: string };
    dinner?: { open: string; close: string };
  };
}

// Example data (MIT dining halls)
const diningHalls: DiningHall[] = [
  {
    id: "maseeh",
    name: "Maseeh Hall",
    address: "305 Memorial Dr, Cambridge, MA 02139",
    coordinates: { latitude: 42.3601, longitude: -71.0942 },
    radius: 500
  },
  {
    id: "next",
    name: "Next House",
    address: "500 Memorial Dr, Cambridge, MA 02139",
    coordinates: { latitude: 42.3610, longitude: -71.0930 },
    radius: 500
  },
  {
    id: "baker",
    name: "Baker House",
    address: "362 Memorial Dr, Cambridge, MA 02139",
    coordinates: { latitude: 42.3590, longitude: -71.0950 },
    radius: 500
  },
  // ... other dining halls
];
```

#### Location Detection Algorithm

**Step 1: Get User Location**
- Request location permission (iOS: `CLLocationManager`)
- Get current coordinates (latitude, longitude)
- Accuracy: ±50 meters acceptable

**Step 2: Find Nearest Dining Hall**
```javascript
function findNearestDiningHall(userLat, userLon, diningHalls) {
  let nearest = null;
  let minDistance = Infinity;
  
  for (const hall of diningHalls) {
    const distance = calculateDistance(
      userLat, userLon,
      hall.coordinates.latitude,
      hall.coordinates.longitude
    );
    
    if (distance < hall.radius && distance < minDistance) {
      nearest = hall;
      minDistance = distance;
    }
  }
  
  return nearest ? {
    hall: nearest,
    distance: minDistance // in meters
  } : null;
}

// Haversine formula for distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in meters
}
```

**Step 3: Handle Edge Cases**
- No dining hall within 500m → Show manual picker
- Multiple dining halls nearby → Show picker with nearest highlighted
- Location services off → Prompt to enable, fallback to manual
- Location permission denied → Show manual picker immediately

**Step 4: Create Quick Request**
- Auto-set dining hall: Nearest detected
- Auto-set time: "Now"
- Auto-set max price: $22
- Create request via API: `POST /api/requests/quick`

#### Implementation Notes

**iOS (SwiftUI):**
```swift
import CoreLocation

class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    @Published var currentLocation: CLLocation?
    
    func requestLocation() {
        locationManager.requestWhenInUseAuthorization()
        locationManager.requestLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        currentLocation = locations.first
        // Call API to find nearest dining hall
    }
}
```

**Backend API:**
- Endpoint: `GET /api/dining-halls/nearby?latitude=X&longitude=Y`
- Returns: List of nearby dining halls sorted by distance
- Nearest hall highlighted in response

**Privacy:**
- Location data used only for dining hall detection
- Coordinates not stored permanently
- Location shared only during coordination ("I'm here" phase)
- Location data deleted after 1 hour

### 5.4 Real-time Updates Approach

#### WebSocket Connection

**Connection:**
- Client connects to `wss://api.swipeshare.app/ws`
- Authenticate with JWT token in query param: `?token=jwt_token`

**Message Types:**

**1. Match Created**
```json
{
  "type": "match_created",
  "data": {
    "matchId": "match_123",
    "host": {...},
    "guest": {...},
    "diningHall": "Maseeh",
    "meetingTime": "2024-01-15T12:05:00Z",
    "price": 8
  }
}
```

**2. Match Status Updated**
```json
{
  "type": "match_status_updated",
  "data": {
    "matchId": "match_123",
    "status": "coordinating",
    "hostArrivedAt": "2024-01-15T12:05:00Z"
  }
}
```

**3. New Message**
```json
{
  "type": "new_message",
  "data": {
    "matchId": "match_123",
    "message": {
      "id": "msg_456",
      "senderId": "user_789",
      "content": "I'm here!",
      "createdAt": "2024-01-15T12:05:00Z"
    }
  }
}
```

**4. Payment Status Updated**
```json
{
  "type": "payment_status_updated",
  "data": {
    "matchId": "match_123",
    "paymentStatus": "released",
    "amount": 8.00
  }
}
```

**Fallback:**
- If WebSocket fails, use HTTP polling (every 5 seconds) for active matches
- Push notifications for critical updates (match created, payment released)

### 5.4 Payments Integration (Stripe)

#### Setup

**Guest (Payer):**
1. User adds payment method via Stripe iOS SDK
2. Create Stripe Customer: `stripe.customers.create()`
3. Attach payment method: `stripe.paymentMethods.attach()`
4. Store `customerId` and `paymentMethodId` in database

**Host (Receiver):**
1. Create Stripe Connect account: `stripe.accounts.create({type: 'express'})`
2. Store `accountId` in database
3. Host completes onboarding (one-time, via Stripe Connect)

#### Escrow Flow

**Step 1: Match Created**
```javascript
// Create Payment Intent with destination (host's Connect account)
const paymentIntent = await stripe.paymentIntents.create({
  amount: 800, // $8.00 in cents
  currency: 'usd',
  customer: guestCustomerId,
  payment_method: guestPaymentMethodId,
  confirmation_method: 'manual',
  confirm: true,
  application_fee_amount: 0, // No platform fee in MVP
  transfer_data: {
    destination: hostStripeAccountId
  },
  metadata: {
    matchId: 'match_123',
    hostId: 'user_456',
    guestId: 'user_789'
  }
});

// Hold payment (don't transfer yet)
// Payment status: "requires_capture" or "succeeded" (if card authorized)
```

**Step 2: Payment Held**
- Payment Intent status: `succeeded` (authorized)
- Transfer is created but not finalized (Stripe Connect holds it)
- Store `paymentIntentId` in Match record

**Step 3: Completion Confirmed**
```javascript
// Both parties confirmed, release payment
// Stripe automatically transfers to host's Connect account
// No additional API call needed (transfer was set up in Step 1)

// Update payment status in database
await updatePaymentStatus(matchId, 'released');
```

**Step 4: Refund (if needed)**
```javascript
// If cancellation or no-show
const refund = await stripe.refunds.create({
  payment_intent: paymentIntentId,
  amount: 400, // Partial refund: $4.00 (50%)
  // Full refund: omit amount
});

await updatePaymentStatus(matchId, 'refunded', refundAmount);
```

#### Dispute Handling

- Stripe Disputes API: Monitor for chargebacks
- If dispute filed: Hold payment, notify admin
- Admin reviews and responds via Stripe Dashboard or API

### 5.5 Push Notifications Plan

#### Notification Types

**1. Match Created**
- Title: "🎉 You're Matched!"
- Body: "Meet [Name] at [Dining Hall] in 5 minutes"
- Action: Deep link to match detail screen
- Priority: High

**2. Host/Guest Arrived**
- Title: "[Name] is here"
- Body: "They're at the [Dining Hall] entrance"
- Action: Deep link to match detail
- Priority: High

**3. Payment Released**
- Title: "Payment received!"
- Body: "You received $8.00 for your swipe"
- Action: Deep link to payment history
- Priority: Medium

**4. New Message**
- Title: "New message from [Name]"
- Body: "[Message preview]"
- Action: Deep link to chat
- Priority: Medium

**5. No-Show Alert**
- Title: "No-show detected"
- Body: "Mark as no-show to process refund"
- Action: Deep link to match detail
- Priority: High

**6. Rating Reminder**
- Title: "Rate your experience"
- Body: "How was your swipe with [Name]?"
- Action: Deep link to rating screen
- Priority: Low

#### Implementation

**iOS (APNs):**
- Register device token on app launch
- Send token to backend: `POST /api/notifications/register`
- Backend stores token in database
- Send notifications via APNs API (using `apn` npm package)

**Backend Notification Service:**
```javascript
async function sendPushNotification(userId, notification) {
  const deviceTokens = await getDeviceTokens(userId);
  
  for (const token of deviceTokens) {
    if (token.platform === 'ios') {
      await apn.send({
        deviceToken: token.token,
        topic: 'com.swipeshare.app',
        payload: {
          aps: {
            alert: {
              title: notification.title,
              body: notification.body
            },
            sound: 'default',
            badge: 1,
            'content-available': 1
          },
          data: notification.data // Deep link data
        }
      });
    }
  }
}
```

### 5.6 Security Model

#### Authentication

**JWT Tokens:**
- Algorithm: HS256 or RS256
- Expiration: 7 days (refresh token: 30 days)
- Claims: `userId`, `email`, `verified`
- Stored: Secure keychain (iOS), encrypted SharedPreferences (Android)

**MIT Email Verification:**
- Send verification code to email
- Code expires in 15 minutes
- Verify code matches hash stored in database
- Alternative: MIT SSO (SAML/OAuth) if available

#### Rate Limiting

**Per User:**
- 100 requests/minute (general API)
- 10 listings/requests per hour
- 5 matches per day (prevent spam)

**Per IP:**
- 1000 requests/minute (prevent DDoS)

**Implementation:**
- Redis-based rate limiting (using `express-rate-limit` or custom)
- Sliding window algorithm

#### Anti-Fraud

**Account Verification:**
- MIT email required (domain validation)
- Phone verification (SMS)
- New accounts: Limited to 3 transactions in first week

**Transaction Monitoring:**
- Flag suspicious patterns:
  - Multiple cancellations in short time
  - High no-show rate
  - Unusual payment patterns
- Auto-suspend if threshold exceeded

**Payment Fraud:**
- Stripe Radar (built-in fraud detection)
- Monitor for chargebacks
- Require 3D Secure for high-value transactions (v2)

#### Data Protection

**Encryption:**
- At rest: AES-256 (database fields: phone, email)
- In transit: TLS 1.3 (HTTPS)
- Chat messages: Encrypted in database (optional v2: E2E)

**Privacy:**
- Phone numbers: Never exposed in API responses
- Email: Masked in profiles (a***@mit.edu)
- Location: Approximate only (±50m), deleted after 1 hour
- PII: GDPR/CCPA compliant (data export, deletion)

---

## 6. Launch Plan

### 6.1 MVP Build Plan (4-6 Weeks)

#### Week 1: Foundation
**Milestones:**
- [ ] Backend setup (Node.js, Express, PostgreSQL)
- [ ] Database schema creation
- [ ] Basic API endpoints (auth, users)
- [ ] iOS app setup (SwiftUI project)
- [ ] Authentication flow (email verification)
- [ ] User profile screens

**Deliverables:**
- Working signup/login flow
- User profiles in database
- Basic iOS app structure

#### Week 2: Core Matching
**Milestones:**
- [ ] Listing/Request creation API
- [ ] Matching algorithm implementation
- [ ] Match creation and notifications
- [ ] iOS: Create listing/request screens
- [ ] iOS: Feed screen (listings/requests)
- [ ] iOS: Match detail screen

**Deliverables:**
- Users can create listings/requests
- Automatic matching works
- Match notifications sent

#### Week 3: Coordination & Payments
**Milestones:**
- [ ] Stripe integration (Connect setup)
- [ ] Payment escrow flow
- [ ] Coordination API endpoints ("I'm here", confirm)
- [ ] iOS: Payment setup (Stripe SDK)
- [ ] iOS: Coordination screen
- [ ] iOS: Chat screen
- [ ] WebSocket real-time updates

**Deliverables:**
- Payments held in escrow
- Coordination flow works end-to-end
- Real-time updates via WebSocket

#### Week 4: Trust & Safety
**Milestones:**
- [ ] Ratings system
- [ ] Reliability score calculation
- [ ] Reporting and blocking
- [ ] No-show detection and penalties
- [ ] Cancellation flows
- [ ] iOS: Rating screens
- [ ] iOS: Report/block UI

**Deliverables:**
- Complete trust & safety features
- Reliability scores calculated
- Reporting system functional

#### Week 5: Polish & Testing
**Milestones:**
- [ ] Push notifications (APNs)
- [ ] Error handling and edge cases
- [ ] UI/UX polish
- [ ] Performance optimization
- [ ] Security audit
- [ ] End-to-end testing

**Deliverables:**
- Production-ready app
- All edge cases handled
- Performance benchmarks met

#### Week 6: Pilot Launch
**Milestones:**
- [ ] Deploy to production
- [ ] TestFlight beta (iOS)
- [ ] Pilot with 20-30 users
- [ ] Monitor and fix bugs
- [ ] Collect feedback

**Deliverables:**
- Live app in production
- Pilot users onboarded
- Feedback collected

### 6.2 Pilot Strategy

#### Phase 1: Single Dining Hall (Week 6-7)
- **Target:** Maseeh Hall (largest, most central)
- **Time Window:** Lunch only (11:30 AM - 1:30 PM)
- **Users:** 20-30 early adopters (10 hosts, 20 guests)
- **Goal:** Validate core flow, identify issues

#### Phase 2: Expand to 2-3 Halls (Week 8-9)
- **Add:** Next House, Baker House
- **Time Windows:** Lunch + Dinner
- **Users:** 50-100 users
- **Goal:** Test scalability, matching algorithm

#### Phase 3: Full Campus (Week 10+)
- **All dining halls**
- **All meal times**
- **Open to all MIT students**
- **Goal:** Scale to 500+ users

### 6.3 Liquidity Strategy

#### Early Incentives

**Week 1-2 (Launch):**
- **Fee holiday:** No platform fees (0% fee)
- **Host bonus:** First 3 hosts get $5 bonus per completed swipe
- **Guest bonus:** First 10 guests get $2 off first swipe

**Week 3-4:**
- **Referral program:** Invite a friend, both get $3 credit
- **Loyalty:** Complete 5 swipes, get $5 credit

**Week 5+:**
- **Sustained liquidity:** 
  - Hosts: Guaranteed match within 5 minutes (or $2 credit)
  - Guests: Guaranteed swipe within 15 minutes (or $1 credit)

#### Pricing Strategy

**MVP:** No platform fees (build liquidity)
**v2:** 5% platform fee (split: 3% host, 2% guest, or all from guest)

**Price Guidance:**
- Encourage hosts to list at $7-9 (sweet spot)
- Show "suggested price" based on demand
- Dynamic pricing hints (v2): "Higher demand, consider $9"

### 6.4 Community Growth Plan

#### Pre-Launch (Week 1-5)
- **Campus flyers:** Post in dorms, student center
- **Social media:** Instagram, Facebook groups (MIT Class of 20XX)
- **Word of mouth:** Recruit 10 "ambassadors" (early users)

#### Launch (Week 6)
- **Email blast:** MIT student listservs (if permitted)
- **Reddit:** r/mit (if allowed by mods)
- **Slack/Discord:** MIT student communities

#### Post-Launch (Week 7+)
- **Incentivized sharing:** Referral program
- **Success stories:** Share user testimonials
- **Partnerships:** Student organizations, dining services (informal)

#### Growth Metrics
- **Week 1:** 50 users
- **Week 2:** 100 users
- **Week 4:** 250 users
- **Week 8:** 500 users
- **Week 12:** 1,000 users (target)

### 6.5 Instrumentation / Analytics Events

#### User Events

**Onboarding:**
- `signup_started`
- `email_entered`
- `email_verified`
- `phone_verified`
- `profile_completed`
- `onboarding_completed`

**Listing/Request:**
- `listing_created`
- `listing_cancelled`
- `listing_expired`
- `request_created`
- `request_cancelled`
- `request_expired`

**Matching:**
- `match_made`
- `match_viewed`
- `match_cancelled`
- `match_completed`
- `match_no_show`

**Coordination:**
- `arrived_tapped` (host/guest)
- `swipe_confirmed`
- `completion_confirmed`
- `chat_message_sent`

**Payments:**
- `payment_method_added`
- `payment_held`
- `payment_released`
- `payment_refunded`

**Trust & Safety:**
- `rating_submitted`
- `report_filed`
- `user_blocked`

#### Funnel Analysis

**Funnel 1: Listing to Match**
1. `listing_created`
2. `match_made`
3. `match_completed`

**Funnel 2: Request to Match**
1. `request_created`
2. `match_made`
3. `match_completed`

**Funnel 3: Match to Completion**
1. `match_made`
2. `arrived_tapped` (both)
3. `swipe_confirmed`
4. `completion_confirmed`
5. `match_completed`

#### Key Metrics to Track

**Engagement:**
- DAU, WAU, MAU
- Sessions per user
- Time in app
- Screen views

**Conversion:**
- Listing → Match rate
- Request → Match rate
- Match → Completion rate

**Retention:**
- Day 1, 7, 30 retention
- Repeat user rate
- Churn rate

**Revenue (v2):**
- GMV (Gross Merchandise Value)
- Platform fee revenue
- Average transaction value

**Trust & Safety:**
- No-show rate
- Dispute rate
- Report rate
- Average reliability score

#### Analytics Tool

**Recommended:** PostHog (open-source, privacy-friendly) or Amplitude

**Implementation:**
```javascript
// Backend: Log events to analytics
analytics.track(userId, 'match_made', {
  matchId: 'match_123',
  diningHall: 'Maseeh',
  price: 8,
  timeToMatch: 120 // seconds
});

// iOS: Use PostHog SDK or Amplitude SDK
PostHog.shared.capture("match_made", properties: [
  "matchId": "match_123",
  "diningHall": "Maseeh",
  "price": 8
])
```

---

## 7. Copy & Policy

### 7.1 Terms-Friendly Wording

#### App Name & Tagline
- **Name:** SwipeShare (or MealMatch, SwipeSwap)
- **Tagline:** "Share your meal swipes. Help fellow students eat."

#### Legal Disclaimers

**In App Store Description:**
> "SwipeShare facilitates connections between MIT students with meal plan access and students seeking dining hall meals. Users are responsible for complying with MIT dining policies and their meal plan terms. SwipeShare does not guarantee meal plan eligibility or dining hall access."

**In Terms of Service:**
> "By using SwipeShare, you acknowledge that:
> - You are responsible for ensuring your meal plan permits guest swipes
> - You comply with all MIT dining policies
> - SwipeShare is a coordination platform only and does not provide meal services
> - All transactions are between users; SwipeShare facilitates payment processing only"

**In-App Warnings:**
- Before first listing: "Make sure your meal plan allows guest swipes. Check your plan terms if unsure."
- Before first request: "Guests must be swiped in by the host at the dining hall entrance. This is a coordination service only."

### 7.2 Safety Policy Text

#### Safety Guidelines (In-App)

**For All Users:**
- Meet only at designated dining hall entrances
- Never share personal information (phone, address) outside the app
- Report any inappropriate behavior immediately
- Respect others' time and commitments

**For Hosts:**
- Only swipe in guests you've matched with through the app
- Meet guests at the entrance desk only
- Do not ask for additional payment outside the app
- Cancel if you cannot make the meeting time

**For Guests:**
- Arrive on time (within 10-minute window)
- Be respectful and courteous
- Confirm completion only after you've been swiped in
- Do not request refunds fraudulently

#### Reporting

**Report Options:**
1. **Harassment:** Inappropriate messages, behavior, or contact
2. **Fraud:** Payment issues, false claims, scams
3. **Inappropriate Behavior:** Rude, threatening, or unsafe conduct
4. **Other:** Any other safety concern

**Report Process:**
- Reports are reviewed within 24 hours
- Serious violations may result in immediate account suspension
- All reports are confidential
- Users can block others at any time

#### Blocking

- Blocked users cannot:
  - See your listings/requests
  - Match with you
  - Message you
  - See your profile
- You can unblock users in Settings
- Blocking is one-way (you block them, they don't know)

### 7.3 Marketplace Rules

#### Refund Policy

**Full Refunds:**
- Host cancels before meeting: 100% refund to guest
- Host no-show: 100% refund to guest
- Dispute resolved in guest's favor: 100% refund to guest

**Partial Refunds:**
- Guest cancels after match: 50% refund to guest, 50% to host
- Guest no-show: 50% refund to guest, 50% to host
- Dispute resolved as "unclear": 50% refund to guest, 50% to host

**No Refunds:**
- Both parties confirm completion (payment released)
- Dispute resolved in host's favor (payment released)

**Refund Processing:**
- Full refunds: Processed within 1 hour
- Partial refunds: Processed within 24 hours
- Refunds appear in original payment method within 3-5 business days

#### Penalties

**No-Show Penalties:**
- First no-show: Reliability score -2 points
- Second no-show (30 days): Reliability score -3 points
- Third no-show (30 days): Reliability score -5 points + 7-day suspension

**Cancellation Penalties:**
- Cancellation after match: Reliability score -1 point
- Frequent cancellations (3+ in 7 days): Warning + potential suspension

**Suspension Rules:**
- 3 no-shows in 30 days → 7-day suspension
- 5 no-shows in 30 days → 30-day suspension
- 7+ no-shows in 30 days → Permanent ban (admin review)
- Verified harassment/fraud → Immediate suspension or ban

#### Dispute Resolution

**Filing a Dispute:**
- Available within 2 hours of match completion or no-show
- Provide description of issue
- Admin reviews within 24 hours
- Payment held until resolution

**Dispute Outcomes:**
- Guest correct: Full refund, host penalty
- Host correct: Payment released, guest penalty
- Unclear: 50/50 split, both penalized

**Appeals:**
- One appeal allowed per dispute
- 48-hour review
- Final decision is binding

#### Prohibited Activities

**Not Allowed:**
- Creating fake accounts
- Price gouging (listing above $22, though typical range is $7-9)
- Spam listings/requests
- Harassment or inappropriate behavior
- Fraudulent refund requests
- Circumventing platform fees (v2)
- Sharing account with others

**Consequences:**
- Warning (first offense)
- Temporary suspension (repeated offenses)
- Permanent ban (severe violations)

### 7.4 Privacy Policy Highlights

#### Data Collection

**We Collect:**
- MIT email address (for verification)
- Phone number (for account security)
- Name and optional profile photo
- Payment information (via Stripe, not stored by us)
- Location data (approximate, temporary)
- Chat messages
- Transaction history

**We Do Not Collect:**
- Full address
- Social security number
- Academic records
- Other personal information

#### Data Usage

- Used only for app functionality (matching, payments, communication)
- Not sold to third parties
- Shared only with Stripe (payments) and hosting providers (infrastructure)

#### Data Retention

- Account data: Retained while account is active
- Location data: Deleted after 1 hour
- Chat messages: Retained for 90 days (for dispute resolution)
- Transaction data: Retained for 7 years (tax/legal compliance)

#### User Rights

- **Access:** View your data in app (Profile, Settings)
- **Export:** Request data export (email support)
- **Deletion:** Delete account and data (Settings → Delete Account)
- **Correction:** Update profile information anytime

---

## Appendix: Assumptions & Notes

### Assumptions Made

1. **MIT Dining Policy:** Assumes guest swipes are permitted (not verified; design within this constraint)
2. **Dining Hall Hours:** Stored manually in app (or crowdsourced); not integrated with official API
3. **Payment Processing:** Stripe Connect supports marketplace model (verified)
4. **User Base:** MIT students only (email verification enforces this)
5. **Meeting Point:** Dining hall entrance/desk (standard location, not GPS-precise)
6. **Network Coverage:** Assumes reliable WiFi/cellular on campus
7. **Legal:** App is coordination platform only; users responsible for compliance

### Technical Assumptions

1. **iOS Version:** Target iOS 16+ (SwiftUI support)
2. **Backend:** Node.js/Express (can be swapped for other stack)
3. **Database:** PostgreSQL (can use other SQL or NoSQL)
4. **Real-time:** WebSocket (can use Firebase, Pusher, etc.)
5. **Hosting:** Cloud provider (AWS, Railway, Render, etc.)

### Future Considerations (Post-MVP)

1. **Android App:** Kotlin + Jetpack Compose
2. **Web Dashboard:** Admin panel for dispute resolution
3. **Advanced Matching:** ML-based ranking (beyond rules-based)
4. **Group Swipes:** Multiple guests per host
5. **Recurring Availability:** Weekly patterns
6. **Integration:** MIT calendar (avoid class conflicts)
7. **Analytics:** Advanced dashboards for admins
8. **Monetization:** Platform fees (5% post-MVP)

---

## Conclusion

This specification provides a comprehensive, build-ready design for the MIT Meal Swipe Marketplace app. The document covers all requested areas:

✅ **Product Requirements:** Problem, goals, personas, journeys, features, requirements  
✅ **UX/IA:** Screen-by-screen specs, microcopy, edge cases, coordination UX  
✅ **Marketplace Mechanics:** Matching algorithm, pricing, policies, ratings, disputes  
✅ **Data Model:** Complete entity schemas, state machines, audit logs  
✅ **Technical Architecture:** Stack, API endpoints, real-time, payments, security  
✅ **Launch Plan:** 6-week build plan, pilot strategy, growth plan, analytics  
✅ **Copy & Policy:** Terms-friendly wording, safety policy, marketplace rules

The specification is detailed enough for a development team to begin implementation immediately, with specific numbers, examples, and acceptance criteria throughout.

**Next Steps:**
1. Review and approve specification
2. Set up development environment (backend, database, iOS project)
3. Begin Week 1 milestones
4. Iterate based on pilot feedback

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Development

