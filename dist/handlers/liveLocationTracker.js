"use strict";
/**
 * Live Location Tracker - Share and track live locations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveLocationTracker = void 0;
const uuid_1 = require("uuid");
class LiveLocationTracker {
    constructor() {
        this.activeLocations = new Map();
        this.locationShares = new Map();
        this.locationHistory = new Map();
    }
    /**
     * Share location in chat
     */
    async shareLocation(request) {
        const shareId = (0, uuid_1.v4)();
        if (request.duration < 5 || request.duration > 60) {
            throw new Error('Duration must be between 5 and 60 minutes');
        }
        const now = new Date();
        const expiresAt = new Date(now.getTime() + request.duration * 60 * 1000);
        const share = {
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
        const liveLocation = {
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
    async updateLocation(locationId, coordinates) {
        const location = this.activeLocations.get(locationId);
        if (!location)
            throw new Error(`Location ${locationId} not found`);
        location.coordinates = coordinates;
        location.timestamp = new Date();
        // Track history
        if (!this.locationHistory.has(locationId)) {
            this.locationHistory.set(locationId, []);
        }
        this.locationHistory.get(locationId).push({
            locationId,
            userId: location.userId,
            coordinates,
            timestamp: new Date(),
        });
    }
    /**
     * Stop sharing location
     */
    async stopSharing(shareId) {
        const share = this.locationShares.get(shareId);
        if (!share)
            throw new Error(`Location share ${shareId} not found`);
        const location = this.activeLocations.get(shareId);
        if (location) {
            location.isActive = false;
        }
    }
    /**
     * Get current location
     */
    async getCurrentLocation(shareId) {
        return this.activeLocations.get(shareId) || null;
    }
    /**
     * Get location history
     */
    async getLocationHistory(shareId) {
        return this.locationHistory.get(shareId) || [];
    }
    /**
     * Get viewers of location
     */
    async getViewers(shareId) {
        const share = this.locationShares.get(shareId);
        if (!share)
            throw new Error(`Location share ${shareId} not found`);
        return share.viewers;
    }
}
exports.LiveLocationTracker = LiveLocationTracker;
//# sourceMappingURL=liveLocationTracker.js.map