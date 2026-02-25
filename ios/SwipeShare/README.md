# SwipeShare iOS App

SwiftUI-based iOS app for MIT Meal Swipe Marketplace.

## Setup

1. Open Xcode and create a new iOS App project
2. Set project name: "SwipeShare"
3. Set Interface: SwiftUI
4. Set Language: Swift
5. Minimum iOS version: 16.0

## Project Structure

```
SwipeShare/
├── App/
│   └── SwipeShareApp.swift
├── Models/
│   ├── User.swift
│   ├── Listing.swift
│   ├── Request.swift
│   ├── Match.swift
│   └── DiningHall.swift
├── Views/
│   ├── HomeView.swift
│   ├── FindHostNowView.swift
│   ├── MatchDetailView.swift
│   └── ProfileView.swift
├── Services/
│   ├── APIService.swift
│   ├── LocationService.swift
│   └── AuthService.swift
└── Utils/
    └── Constants.swift
```

## Dependencies

Add via Swift Package Manager:
- None for MVP (using native frameworks)

## Configuration

1. Add location permissions to Info.plist:
   - `NSLocationWhenInUseUsageDescription`: "We need your location to find the nearest dining hall"
   - `NSLocationAlwaysAndWhenInUseUsageDescription`: "We need your location to coordinate meetings"

2. Set up API base URL in Constants.swift

