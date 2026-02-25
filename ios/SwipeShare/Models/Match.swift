import Foundation

struct Match: Codable, Identifiable {
    let id: String
    let host: MatchUser
    let guest: MatchUser
    let diningHall: String
    let meetingTime: Date
    let price: Double
    let status: MatchStatus
    let paymentStatus: PaymentStatus
    let hostArrivedAt: Date?
    let guestArrivedAt: Date?
    let hostConfirmedAt: Date?
    let guestConfirmedAt: Date?
    let createdAt: Date
    
    struct MatchUser: Codable {
        let id: String
        let name: String
        let photoUrl: String?
        let reliabilityScore: Int
    }
    
    enum MatchStatus: String, Codable {
        case pending
        case coordinating
        case inProgress
        case completed
        case cancelled
        case disputed
        case noShow
    }
    
    enum PaymentStatus: String, Codable {
        case pending
        case held
        case released
        case refunded
        case disputed
    }
}

struct ArriveRequest: Codable {
    let role: String // "host" or "guest"
}

struct ConfirmSwipeRequest: Codable {
    let role: String // "host"
}

struct ConfirmCompletionRequest: Codable {
    let role: String // "guest"
}

