// Core type definitions

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  photoUrl?: string;
  reliabilityScore: number;
  averageRating: number;
  totalTransactions: number;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  isSuspended: boolean;
  suspendedUntil?: Date;
  blockedUserIds: string[];
  paymentMethodId?: string;
  hostStripeAccountId?: string;
}

export interface DiningHall {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in meters
  hours: {
    breakfast?: { open: string; close: string };
    lunch?: { open: string; close: string };
    dinner?: { open: string; close: string };
  };
}

export interface Listing {
  id: string;
  hostId: string;
  diningHall: string;
  timeWindow: {
    type: 'now' | 'scheduled';
    scheduledTime?: Date;
    expiresAt: Date;
  };
  price: number;
  status: 'active' | 'matched' | 'expired' | 'cancelled';
  matchedGuestId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  id: string;
  guestId: string;
  diningHall: string;
  timeWindow: {
    type: 'now' | 'scheduled';
    scheduledTime?: Date;
    expiresAt: Date;
  };
  maxPrice: number;
  status: 'active' | 'matched' | 'expired' | 'cancelled';
  matchedHostId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  listingId?: string;
  requestId?: string;
  hostId: string;
  guestId: string;
  diningHall: string;
  meetingTime: Date;
  price: number;
  status: 'pending' | 'coordinating' | 'in_progress' | 'completed' | 'cancelled' | 'disputed' | 'no_show';
  hostArrivedAt?: Date;
  guestArrivedAt?: Date;
  hostConfirmedAt?: Date;
  guestConfirmedAt?: Date;
  paymentIntentId: string;
  paymentStatus: 'pending' | 'held' | 'released' | 'refunded' | 'disputed';
  paymentAmount: number;
  cancelledBy?: 'host' | 'guest';
  cancelledAt?: Date;
  cancellationReason?: string;
  noShowBy?: 'host' | 'guest';
  noShowAt?: Date;
  disputeId?: string;
  disputeFiledBy?: 'host' | 'guest';
  disputeFiledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Payment {
  id: string;
  matchId: string;
  hostId: string;
  guestId: string;
  amount: number;
  platformFee?: number;
  hostAmount: number;
  paymentIntentId: string;
  chargeId?: string;
  transferId?: string;
  status: 'pending' | 'held' | 'released' | 'refunded' | 'partially_refunded' | 'disputed';
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  releasedAt?: Date;
  refundedAt?: Date;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface Rating {
  id: string;
  matchId: string;
  raterId: string;
  rateeId: string;
  stars: number;
  comment?: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  matchId?: string;
  type: 'harassment' | 'inappropriate_behavior' | 'fraud' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string;
  resolvedAt?: Date;
  createdAt: Date;
}

