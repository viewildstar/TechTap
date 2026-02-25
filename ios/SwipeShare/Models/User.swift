import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let name: String
    let photoUrl: String?
    let reliabilityScore: Int
    let averageRating: Double
    let totalTransactions: Int
    let isVerified: Bool
    
    enum CodingKeys: String, CodingKey {
        case id
        case email
        case name
        case photoUrl
        case reliabilityScore
        case averageRating
        case totalTransactions
        case isVerified
    }
}

