import Foundation
import Combine

// Stripe Payment Service
// Note: For full Stripe integration, you'll need to add Stripe iOS SDK
// Add via Swift Package Manager: https://github.com/stripe/stripe-ios

class PaymentService: ObservableObject {
    static let shared = PaymentService()
    
    private let apiService = APIService.shared
    
    private init() {}
    
    // MARK: - Setup Payment Method
    
    func setupPaymentMethod(paymentMethodId: String) -> AnyPublisher<PaymentSetupResponse, Error> {
        struct PaymentSetupRequest: Codable {
            let paymentMethodId: String
        }
        
        let body = PaymentSetupRequest(paymentMethodId: paymentMethodId)
        return apiService.request(endpoint: Constants.Endpoints.payments + "/setup", method: "POST", body: body)
    }
    
    // MARK: - Setup Stripe Connect (for hosts)
    
    func setupConnectAccount() -> AnyPublisher<ConnectAccountResponse, Error> {
        return apiService.requestInternal(endpoint: Constants.Endpoints.payments + "/connect/setup", method: "POST", body: nil)
    }
    
    // MARK: - Payment History
    
    func getPaymentHistory() -> AnyPublisher<PaymentHistoryResponse, Error> {
        return apiService.requestInternal(endpoint: Constants.Endpoints.payments + "/history", method: "GET", body: nil)
    }
}

// MARK: - Response Models

struct PaymentSetupResponse: Codable {
    let setup: Bool
    let customerId: String
}

struct ConnectAccountResponse: Codable {
    let accountId: String
    let accountLinkUrl: String
}

struct PaymentHistoryResponse: Codable {
    let payments: [PaymentHistoryItem]
    
    struct PaymentHistoryItem: Codable {
        let id: String
        let matchId: String
        let amount: Double
        let status: String
        let type: String // "sent" or "received"
        let diningHall: String
        let meetingTime: Date
        let createdAt: Date
    }
}

// MARK: - Stripe Integration Helper

/*
 To integrate Stripe iOS SDK:
 
 1. Add Stripe iOS SDK via Swift Package Manager:
    https://github.com/stripe/stripe-ios
 
 2. Import Stripe:
    import Stripe
    import StripePaymentSheet
 
 3. Initialize Stripe in AppDelegate or App:
    StripeAPI.defaultPublishableKey = "pk_test_your_publishable_key"
 
 4. Create Payment Sheet:
    func createPaymentSheet(paymentIntentClientSecret: String) {
        var configuration = PaymentSheet.Configuration()
        configuration.merchantDisplayName = "SwipeShare"
        
        let paymentSheet = PaymentSheet(
            paymentIntentClientSecret: paymentIntentClientSecret,
            configuration: configuration
        )
        
        paymentSheet.present(from: viewController) { paymentResult in
            // Handle payment result
        }
    }
 
 5. For collecting payment method:
    let paymentMethodParams = STPPaymentMethodParams()
    // Configure payment method
    STPAPIClient.shared.createPaymentMethod(with: paymentMethodParams) { paymentMethod, error in
        // Send paymentMethod.id to backend
    }
 */

