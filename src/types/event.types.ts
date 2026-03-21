/**
 * Event Types - Event planning and management
 */

export type EventStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
export type RSVPStatus = 'pending' | 'accepted' | 'declined' | 'maybe';

export interface EventDetails {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  creator: string;
  chatJid: string;
}

export interface EventInvite {
  id: string;
  eventId: string;
  userId: string;
  rsvpStatus: RSVPStatus;
  respondedAt?: Date;
  plusOnes?: number;
  notes?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  creator: string;
  chatJid: string;
  invitees?: string[];
  remindBefore?: number; // minutes
}

export interface Event extends EventDetails {
  status: EventStatus;
  invites: EventInvite[];
  createdAt: Date;
  updatedAt: Date;
  reminders: EventReminder[];
}

export interface EventReminder {
  id: string;
  eventId: string;
  minutesBefore: number;
  sent: boolean;
  sentAt?: Date;
}

export interface EventStats {
  eventId: string;
  totalInvites: number;
  accepted: number;
  declined: number;
  maybe: number;
  pending: number;
  responseRate: number;
}