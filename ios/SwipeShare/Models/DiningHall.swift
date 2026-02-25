import Foundation
import CoreLocation

struct DiningHall: Codable, Identifiable {
    let id: String
    let name: String
    let address: String
    let coordinates: Coordinates
    let distance: Double? // in miles
    let isOpen: Bool
    let hours: Hours?
    
    struct Coordinates: Codable {
        let latitude: Double
        let longitude: Double
        
        var location: CLLocation {
            CLLocation(latitude: latitude, longitude: longitude)
        }
    }
    
    struct Hours: Codable {
        let breakfast: MealHours?
        let lunch: MealHours?
        let dinner: MealHours?
        
        struct MealHours: Codable {
            let open: String
            let close: String
        }
    }
}

struct NearbyDiningHallsResponse: Codable {
    let diningHalls: [DiningHall]
    let nearest: NearestDiningHall?
    
    struct NearestDiningHall: Codable {
        let id: String
        let name: String
        let distance: Double
    }
}

