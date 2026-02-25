import Foundation
import Combine

// Custom date decoder for ISO8601 dates
extension JSONDecoder {
    static let iso8601: JSONDecoder = {
        let decoder = JSONDecoder()
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)
            
            if let date = formatter.date(from: dateString) {
                return date
            }
            
            // Fallback to standard ISO8601
            formatter.formatOptions = [.withInternetDateTime]
            if let date = formatter.date(from: dateString) {
                return date
            }
            
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date: \(dateString)")
        }
        return decoder
    }()
}

class APIService: ObservableObject {
    static let shared = APIService()
    
    private let session = URLSession.shared
    private var cancellables = Set<AnyCancellable>()
    
    private init() {}
    
    // MARK: - Auth Token Management
    
    var authToken: String? {
        get {
            UserDefaults.standard.string(forKey: Constants.UserDefaultsKeys.authToken)
        }
        set {
            UserDefaults.standard.set(newValue, forKey: Constants.UserDefaultsKeys.authToken)
        }
    }
    
    // MARK: - Generic Request Method (Private)
    
    func requestInternal<T: Decodable>(
        endpoint: String,
        method: String = "GET",
        body: Data? = nil
    ) -> AnyPublisher<T, Error> {
        guard let url = URL(string: "\(Constants.apiBaseURL)\(endpoint)") else {
            return Fail(error: URLError(.badURL))
                .eraseToAnyPublisher()
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        if let body = body {
            do {
                request.httpBody = try JSONEncoder().encode(body)
            } catch {
                return Fail(error: error).eraseToAnyPublisher()
            }
        }
        
        return session.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: T.self, decoder: JSONDecoder.iso8601)
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Dining Halls
    
    func getNearbyDiningHalls(latitude: Double, longitude: Double, radius: Double = 500) -> AnyPublisher<NearbyDiningHallsResponse, Error> {
        let endpoint = "\(Constants.Endpoints.diningHallsNearby)?latitude=\(latitude)&longitude=\(longitude)&radius=\(radius)"
        return request(endpoint: endpoint)
    }
    
    // MARK: - Requests
    
    func createQuickRequest(latitude: Double, longitude: Double) -> AnyPublisher<Request, Error> {
        let body = QuickRequestRequest(latitude: latitude, longitude: longitude)
        return request(endpoint: Constants.Endpoints.quickRequest, method: "POST", body: body)
    }
    
    // MARK: - Matches
    
    func getMatches() -> AnyPublisher<[Match], Error> {
        struct MatchesResponse: Codable {
            let matches: [Match]
        }
        
        return request<MatchesResponse>(endpoint: Constants.Endpoints.matches)
            .map(\.matches)
            .eraseToAnyPublisher()
    }
    
    func getMatch(id: String) -> AnyPublisher<Match, Error> {
        return request(endpoint: "\(Constants.Endpoints.matchDetail)/\(id)")
    }
    
    func markArrived(matchId: String, role: String) -> AnyPublisher<ArriveResponse, Error> {
        let body = ArriveRequest(role: role)
        return request(endpoint: "\(Constants.Endpoints.arrive)/\(matchId)/arrive", method: "POST", body: body)
    }
    
    func confirmSwipe(matchId: String) -> AnyPublisher<ConfirmResponse, Error> {
        let body = ConfirmSwipeRequest(role: "host")
        return request(endpoint: "\(Constants.Endpoints.confirmSwipe)/\(matchId)/confirm-swipe", method: "POST", body: body)
    }
    
    func confirmCompletion(matchId: String) -> AnyPublisher<ConfirmResponse, Error> {
        let body = ConfirmCompletionRequest(role: "guest")
        return request(endpoint: "\(Constants.Endpoints.confirmCompletion)/\(matchId)/confirm-completion", method: "POST", body: body)
    }
    
    
    // MARK: - Auth
    
    func signup(email: String, phone: String, name: String) -> AnyPublisher<AuthResponse, Error> {
        struct SignupRequest: Codable {
            let email: String
            let phone: String
            let name: String
        }
        
        let body = SignupRequest(email: email, phone: phone, name: name)
        return request(endpoint: Constants.Endpoints.signup, method: "POST", body: body)
    }
    
    func login(email: String) -> AnyPublisher<AuthResponse, Error> {
        struct LoginRequest: Codable {
            let email: String
        }
        
        let body = LoginRequest(email: email)
        return request(endpoint: Constants.Endpoints.login, method: "POST", body: body)
    }
}

// MARK: - Response Models

struct AuthResponse: Codable {
    let userId: String
    let token: String
    let requiresVerification: Bool?
    let isVerified: Bool?
}

struct ArriveResponse: Codable {
    let arrived: Bool
    let arrivedAt: String
    let otherPartyArrived: Bool
}

struct ConfirmResponse: Codable {
    let confirmed: Bool?
    let completed: Bool?
    let confirmedAt: String?
    let completedAt: String?
    let waitingForGuest: Bool?
    let paymentReleased: Bool?
}

