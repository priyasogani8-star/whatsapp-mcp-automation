/**
 * Live Location Tracker - Share and track live locations
 */

import { v4 as uuid } from 'uuid';
import {
  LiveLocation,
  LocationShare,
  ShareLocationRequest,
  LocationUpdate,
  LocationCoordinates,
} from '../types/location.types';

export class LiveLocationTracker {
  private activeLocations = new Map<string, LiveLocation>();
  private locationShares = new Map<string, LocationShare>();
  private locationHistory = new Map<string, LocationUpdate[]>();

  /**
   * Share location in chat
   */
  async shareLocation(request: ShareLocationRequest): Promise<LocationShare> {
    const shareId = uuid();

    if (request.duration < 5 || request.duration > 60) {
      throw new Error('Duration must be between 5 and 60 minutes');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + request.duration * 60 * 1000);

    const share: LocationShare = {
      id: shareId,
      userId: request.userId,
      chatJid: request.chatJid,
      coordinates: request.coordinates,
      address: request.address,
      duration: request.duration,
      sharedAt: now,
      expiresAt,
      viewers: [],
    };

    this.locationShares.set(shareId, share);

    // Create live location entry
    const liveLocation: LiveLocation = {
      id: shareId,
      userId: request.userId,
      userPhone: request.userId, // simplified
      coordinates: request.coordinates,
      timestamp: now,
      isActive: true,
    };

    this.activeLocations.set(shareId, liveLocation);

    return share;
  }

  /**
   * Update live location
   */
  async updateLocation(locationId: string, coordinates: LocationCoordinates): Promise<void> {
    const location = this.activeLocations.get(locationId);
    if (!location) throw new Error(`Location ${locationId} not found`);

    location.coordinates = coordinates;
    location.timestamp = new Date();

    // Track history
    if (!this.locationHistory.has(locationId)) {
      this.locationHistory.set(locationId, []);
    }

    this.locationHistory.get(locationId)!.push({
      locationId,
      userId: location.userId,
      coordinates,
      timestamp: new Date(),
    });
  }

  /**
   * Stop sharing location
   */
  async stopSharing(shareId: string): Promise<void> {
    const share = this.locationShares.get(shareId);
    if (!share) throw new Error(`Location share ${shareId} not found`);

    const location = this.activeLocations.get(shareId);
    if (location) {
      location.isActive = false;
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(shareId: string): Promise<LiveLocation | null> {
    return this.activeLocations.get(shareId) || null;
  }

  /**
   * Get location history
   */
  async getLocationHistory(shareId: string): Promise<LocationUpdate[]> {
    return this.locationHistory.get(shareId) || [];
  }

  /**
   * Get viewers of location
   */
  async getViewers(shareId: string): Promise<string[]> {
    const share = this.locationShares.get(shareId);
    if (!share) throw new Error(`Location share ${shareId} not found`);
    return share.viewers;
  }
}