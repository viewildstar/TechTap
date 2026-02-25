import Foundation

struct Request: Codable, Identifiable {
    let id: String
    let guestId: String
    let diningHall: String
    let timeWindow: TimeWindow
    let maxPrice: Double
    let status: RequestStatus
    let detectedHall: DetectedHall?
    let createdAt: Date
    
    struct TimeWindow: Codable {
        let type: String // "now" or "scheduled"
        let scheduledTime: Date?
        let expiresAt: Date
    }
    
    struct DetectedHall: Codable {
        let name: String
        let distance: Double
        let address: String
    }
    
    enum RequestStatus: String, Codable {
        case active
        case matched
        case expired
        case cancelled
    }
}

struct QuickRequestRequest: Codable {
    let latitude: Double
    let longitude: Double
}

