import SwiftUI
import CoreLocation
import Combine

struct HomeView: View {
    @StateObject private var locationService = LocationService()
    @StateObject private var apiService = APIService.shared
    @State private var isFindingHost = false
    @State private var errorMessage: String?
    @State private var showError = false
    @State private var currentRequest: Request?
    @State private var currentMatch: Match?
    @State private var cancellables = Set<AnyCancellable>()
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Primary CTA: Find Host Now
                VStack(spacing: 16) {
                    Button(action: findHostNow) {
                        HStack {
                            Image(systemName: "location.fill")
                            Text("Find Host Now")
                                .font(.title2)
                                .fontWeight(.bold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                    }
                    .disabled(isFindingHost || locationService.authorizationStatus == .denied)
                    
                    if isFindingHost {
                        ProgressView()
                            .padding()
                        Text("Finding nearest dining hall...")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    if locationService.authorizationStatus == .denied {
                        Text("Location access needed. Enable in Settings to find nearest dining hall.")
                            .font(.caption)
                            .foregroundColor(.red)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                }
                .padding()
                .background(Color(.systemBackground))
                
                Divider()
                
                // Secondary Options
                VStack(spacing: 12) {
                    Button(action: {}) {
                        HStack {
                            Image(systemName: "list.bullet")
                            Text("Browse Listings")
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(.systemGray5))
                        .foregroundColor(.primary)
                        .cornerRadius(12)
                    }
                    
                    Button(action: {}) {
                        HStack {
                            Image(systemName: "plus.circle")
                            Text("List My Swipe")
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(.systemGray5))
                        .foregroundColor(.primary)
                        .cornerRadius(12)
                    }
                }
                .padding()
                
                Spacer()
            }
            .navigationTitle("SwipeShare")
            .navigationBarTitleDisplayMode(.large)
            .alert("Error", isPresented: $showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage ?? "An error occurred")
            }
            .sheet(item: $currentMatch) { match in
                MatchDetailView(match: match)
            }
        }
        .onAppear {
            locationService.requestLocationPermission()
        }
    }
    
    private func findHostNow() {
        guard let location = locationService.currentLocation else {
            locationService.getCurrentLocation()
            
            // Wait a bit for location to update
            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                if let location = locationService.currentLocation {
                    performQuickRequest(location: location)
                } else {
                    errorMessage = "Couldn't get your location. Please try again or select a dining hall manually."
                    showError = true
                }
            }
            return
        }
        
        performQuickRequest(location: location)
    }
    
    private func performQuickRequest(location: CLLocation) {
        isFindingHost = true
        errorMessage = nil
        
        apiService.createQuickRequest(
            latitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude
        )
        .sink(
            receiveCompletion: { completion in
                isFindingHost = false
                if case .failure(let error) = completion {
                    errorMessage = error.localizedDescription
                    showError = true
                }
            },
            receiveValue: { request in
                currentRequest = request
                isFindingHost = false
                
                // TODO: Navigate to match detail when matched
                // For now, poll for matches
                pollForMatches(requestId: request.id)
            }
        )
                .store(in: &cancellables)
    }
    
    private func pollForMatches(requestId: String) {
        // Poll for matches every 2 seconds
        Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { timer in
            apiService.getMatches()
                .sink(
                    receiveCompletion: { _ in },
                    receiveValue: { matches in
                        if let match = matches.first(where: { $0.id == requestId }) {
                            timer.invalidate()
                            currentMatch = match
                        }
                    }
                )
                .store(in: &cancellables)
        }
    }
}


#Preview {
    HomeView()
}

