/**
 * Location Types - Live location tracking and sharing
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
}

export interface LiveLocation {
  id: string;
  userId: string;
  userPhone: string;
  coordinates: LocationCoordinates;
  heading?: number; // degrees
  speed?: number; // km/h
  timestamp: Date;
  isActive: boolean;
}

export interface LocationShare {
  id: string;
  userId: string;
  chatJid: string;
  coordinates: LocationCoordinates;
  address?: string;
  duration: number; // minutes
  sharedAt: Date;
  expiresAt: Date;
  viewers: string[];
}

export interface ShareLocationRequest {
  userId: string;
  chatJid: string;
  coordinates: LocationCoordinates;
  duration: number; // minutes (5-60)
  address?: string;
}

export interface LocationUpdate {
  locationId: string;
  userId: string;
  coordinates: LocationCoordinates;
  timestamp: Date;
  heading?: number;
  speed?: number;
}

export interface LocationTracking {
  id: string;
  trackerId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  locations: LiveLocation[];
}

export interface LocationPermission {
  userId: string;
  chatJid: string;
  canShareLocation: boolean;
  canTrackLocation: boolean;
  grantedAt: Date;
}