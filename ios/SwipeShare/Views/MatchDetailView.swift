import SwiftUI

struct MatchDetailView: View {
    let match: Match
    @State private var hostArrived = false
    @State private var guestArrived = false
    @State private var swipeConfirmed = false
    @State private var completionConfirmed = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Match Header
                    VStack(spacing: 8) {
                        Text("🎉 You're Matched!")
                            .font(.title)
                            .fontWeight(.bold)
                        
                        Text("Meet at \(match.diningHall)")
                            .font(.headline)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    
                    // User Info Cards
                    HStack(spacing: 16) {
                        UserCard(user: match.host, role: "Host")
                        UserCard(user: match.guest, role: "Guest")
                    }
                    .padding(.horizontal)
                    
                    // Meeting Info
                    VStack(alignment: .leading, spacing: 12) {
                        InfoRow(icon: "clock", text: formatMeetingTime(match.meetingTime))
                        InfoRow(icon: "dollarsign.circle", text: String(format: "$%.2f", match.price))
                        InfoRow(icon: "mappin.circle", text: match.diningHall)
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                    .padding(.horizontal)
                    
                    // Status
                    StatusView(
                        hostArrived: hostArrived,
                        guestArrived: guestArrived,
                        swipeConfirmed: swipeConfirmed,
                        completionConfirmed: completionConfirmed
                    )
                    .padding()
                    
                    // Action Buttons
                    if !hostArrived || !guestArrived {
                        Button(action: markArrived) {
                            Text("I'm Here")
                                .font(.headline)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.green)
                                .foregroundColor(.white)
                                .cornerRadius(12)
                        }
                        .padding(.horizontal)
                    }
                    
                    if hostArrived && guestArrived && !swipeConfirmed {
                        Button(action: confirmSwipe) {
                            Text("Swiped In")
                                .font(.headline)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(12)
                        }
                        .padding(.horizontal)
                    }
                    
                    if swipeConfirmed && !completionConfirmed {
                        Button(action: confirmCompletion) {
                            Text("I'm In")
                                .font(.headline)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(12)
                        }
                        .padding(.horizontal)
                    }
                    
                    if completionConfirmed {
                        Text("✅ Swipe complete! Payment processing...")
                            .font(.headline)
                            .foregroundColor(.green)
                            .padding()
                    }
                }
                .padding(.vertical)
            }
            .navigationTitle("Match Details")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private func markArrived() {
        // TODO: Call API
        hostArrived = true
    }
    
    private func confirmSwipe() {
        // TODO: Call API
        swipeConfirmed = true
    }
    
    private func confirmCompletion() {
        // TODO: Call API
        completionConfirmed = true
    }
    
    private func formatMeetingTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return "Meet at \(formatter.string(from: date))"
    }
}

struct UserCard: View {
    let user: Match.MatchUser
    let role: String
    
    var body: some View {
        VStack(spacing: 8) {
            if let photoUrl = user.photoUrl, let url = URL(string: photoUrl) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Image(systemName: "person.circle.fill")
                        .font(.system(size: 50))
                }
                .frame(width: 60, height: 60)
                .clipShape(Circle())
            } else {
                Image(systemName: "person.circle.fill")
                    .font(.system(size: 50))
                    .foregroundColor(.gray)
            }
            
            Text(user.name)
                .font(.headline)
            
            Text(role)
                .font(.caption)
                .foregroundColor(.secondary)
            
            HStack(spacing: 4) {
                Image(systemName: "star.fill")
                    .foregroundColor(.yellow)
                    .font(.caption)
                Text("\(user.reliabilityScore)")
                    .font(.caption)
            }
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct InfoRow: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(.blue)
                .frame(width: 24)
            Text(text)
        }
    }
}

struct StatusView: View {
    let hostArrived: Bool
    let guestArrived: Bool
    let swipeConfirmed: Bool
    let completionConfirmed: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Status")
                .font(.headline)
            
            StatusRow(label: "Host Arrived", status: hostArrived)
            StatusRow(label: "Guest Arrived", status: guestArrived)
            StatusRow(label: "Swiped In", status: swipeConfirmed)
            StatusRow(label: "Completed", status: completionConfirmed)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct StatusRow: View {
    let label: String
    let status: Bool
    
    var body: some View {
        HStack {
            Text(label)
            Spacer()
            Image(systemName: status ? "checkmark.circle.fill" : "circle")
                .foregroundColor(status ? .green : .gray)
        }
    }
}

#Preview {
    MatchDetailView(
        match: Match(
            id: "1",
            host: Match.MatchUser(id: "1", name: "Sarah", photoUrl: nil, reliabilityScore: 95),
            guest: Match.MatchUser(id: "2", name: "Alex", photoUrl: nil, reliabilityScore: 90),
            diningHall: "Maseeh Hall",
            meetingTime: Date(),
            price: 8.0,
            status: .coordinating,
            paymentStatus: .held,
            hostArrivedAt: nil,
            guestArrivedAt: nil,
            hostConfirmedAt: nil,
            guestConfirmedAt: nil,
            createdAt: Date()
        )
    )
}

