-- SwipeShare Database Schema
-- PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    photo_url TEXT,
    reliability_score INTEGER DEFAULT 100,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    verification_code VARCHAR(6),
    is_verified BOOLEAN DEFAULT false,
    is_suspended BOOLEAN DEFAULT false,
    suspended_until TIMESTAMP,
    blocked_user_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
    payment_method_id VARCHAR(255),
    host_stripe_account_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Listings table (host availability)
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dining_hall VARCHAR(100) NOT NULL,
    time_window_type VARCHAR(20) NOT NULL CHECK (time_window_type IN ('now', 'scheduled')),
    scheduled_time TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 5 AND price <= 22),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'matched', 'expired', 'cancelled')),
    matched_guest_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Requests table (guest requests)
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dining_hall VARCHAR(100) NOT NULL,
    time_window_type VARCHAR(20) NOT NULL CHECK (time_window_type IN ('now', 'scheduled')),
    scheduled_time TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    max_price DECIMAL(10,2) NOT NULL CHECK (max_price >= 5 AND max_price <= 22),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'matched', 'expired', 'cancelled')),
    matched_host_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Matches table (orders)
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id),
    request_id UUID REFERENCES requests(id),
    host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dining_hall VARCHAR(100) NOT NULL,
    meeting_time TIMESTAMP NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'coordinating', 'in_progress', 'completed', 'cancelled', 'disputed', 'no_show')),
    host_arrived_at TIMESTAMP,
    guest_arrived_at TIMESTAMP,
    host_confirmed_at TIMESTAMP,
    guest_confirmed_at TIMESTAMP,
    payment_intent_id VARCHAR(255) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'held', 'released', 'refunded', 'disputed')),
    payment_amount DECIMAL(10,2) NOT NULL,
    cancelled_by VARCHAR(10) CHECK (cancelled_by IN ('host', 'guest')),
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    no_show_by VARCHAR(10) CHECK (no_show_by IN ('host', 'guest')),
    no_show_at TIMESTAMP,
    dispute_id UUID,
    dispute_filed_by VARCHAR(10) CHECK (dispute_filed_by IN ('host', 'guest')),
    dispute_filed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- in cents
    platform_fee INTEGER DEFAULT 0, -- in cents
    host_amount INTEGER NOT NULL, -- in cents
    payment_intent_id VARCHAR(255) NOT NULL,
    charge_id VARCHAR(255),
    transfer_id VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'held', 'released', 'refunded', 'partially_refunded', 'disputed')),
    refund_amount INTEGER DEFAULT 0, -- in cents
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    released_at TIMESTAMP,
    refunded_at TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 1000),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP
);

-- Ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ratee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
    comment TEXT CHECK (char_length(comment) <= 500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches(id),
    type VARCHAR(30) NOT NULL CHECK (type IN ('harassment', 'inappropriate_behavior', 'fraud', 'other')),
    description TEXT NOT NULL CHECK (char_length(description) <= 1000),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    admin_notes TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Disputes table
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    filed_by VARCHAR(10) NOT NULL CHECK (filed_by IN ('host', 'guest')),
    type VARCHAR(30) NOT NULL CHECK (type IN ('payment', 'service', 'cancellation', 'other')),
    description TEXT NOT NULL CHECK (char_length(description) <= 1000),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'appealed')),
    resolution VARCHAR(30) CHECK (resolution IN ('guest_correct', 'host_correct', 'unclear', 'both_at_fault')),
    admin_notes TEXT,
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_listings_host_id ON listings(host_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_dining_hall ON listings(dining_hall);
CREATE INDEX idx_listings_expires_at ON listings(expires_at);

CREATE INDEX idx_requests_guest_id ON requests(guest_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_dining_hall ON requests(dining_hall);
CREATE INDEX idx_requests_expires_at ON requests(expires_at);

CREATE INDEX idx_matches_host_id ON matches(host_id);
CREATE INDEX idx_matches_guest_id ON matches(guest_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_payment_status ON matches(payment_status);

CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);

CREATE INDEX idx_ratings_ratee_id ON ratings(ratee_id);
CREATE INDEX idx_ratings_match_id ON ratings(match_id);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

