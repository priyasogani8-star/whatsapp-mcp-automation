/**
 * Live Location Tracker - Share and track live locations
 */
import { LiveLocation, LocationShare, ShareLocationRequest, LocationUpdate, LocationCoordinates } from '../types/location.types';
export declare class LiveLocationTracker {
    private activeLocations;
    private locationShares;
    private locationHistory;
    /**
     * Share location in chat
     */
    shareLocation(request: ShareLocationRequest): Promise<LocationShare>;
    /**
     * Update live location
     */
    updateLocation(locationId: string, coordinates: LocationCoordinates): Promise<void>;
    /**
     * Stop sharing location
     */
    stopSharing(shareId: string): Promise<void>;
    /**
     * Get current location
     */
    getCurrentLocation(shareId: string): Promise<LiveLocation | null>;
    /**
     * Get location history
     */
    getLocationHistory(shareId: string): Promise<LocationUpdate[]>;
    /**
     * Get viewers of location
     */
    getViewers(shareId: string): Promise<string[]>;
}
//# sourceMappingURL=liveLocationTracker.d.ts.map