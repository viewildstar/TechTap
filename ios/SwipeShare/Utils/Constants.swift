import Foundation

struct Constants {
    // API Configuration
    static let apiBaseURL = "http://localhost:3000/api" // Change to production URL
    
    // API Endpoints
    struct Endpoints {
        static let signup = "/auth/signup"
        static let login = "/auth/login"
        static let verifyEmail = "/auth/verify-email"
        static let me = "/auth/me"
        
        static let diningHallsNearby = "/dining-halls/nearby"
        static let diningHall = "/dining-halls"
        
        static let quickRequest = "/requests/quick"
        static let requests = "/requests"
        
        static let listings = "/listings"
        
        static let matches = "/matches"
        static let matchDetail = "/matches"
        static let arrive = "/matches"
        static let confirmSwipe = "/matches"
        static let confirmCompletion = "/matches"
        
        static let messages = "/matches"
        
        static let payments = "/payments"
    }
    
    // User Defaults Keys
    struct UserDefaultsKeys {
        static let authToken = "authToken"
        static let userId = "userId"
    }
    
    // App Configuration
    static let maxPrice: Double = 22.0
    static let minPrice: Double = 5.0
    static let defaultPrice: Double = 8.0
}

