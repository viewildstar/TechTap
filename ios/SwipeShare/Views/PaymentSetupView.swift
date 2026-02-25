import SwiftUI

struct PaymentSetupView: View {
    @StateObject private var paymentService = PaymentService.shared
    @State private var isSettingUp = false
    @State private var errorMessage: String?
    @State private var showError = false
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                Text("Set Up Payment")
                    .font(.title2)
                    .fontWeight(.bold)
                    .padding(.top)
                
                Text("Add a payment method to use SwipeShare")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                
                // TODO: Integrate Stripe Payment Sheet here
                // For now, show placeholder
                VStack(spacing: 16) {
                    Image(systemName: "creditcard")
                        .font(.system(size: 60))
                        .foregroundColor(.blue)
                    
                    Text("Stripe Payment Integration")
                        .font(.headline)
                    
                    Text("Add Stripe iOS SDK to enable payment method collection")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
                .padding(.horizontal)
                
                Button(action: {
                    // TODO: Present Stripe Payment Sheet
                    dismiss()
                }) {
                    Text("Add Payment Method")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                }
                .padding(.horizontal)
                .disabled(isSettingUp)
                
                if isSettingUp {
                    ProgressView()
                }
                
                Spacer()
            }
            .navigationTitle("Payment Setup")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
            .alert("Error", isPresented: $showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage ?? "An error occurred")
            }
        }
    }
}

#Preview {
    PaymentSetupView()
}

