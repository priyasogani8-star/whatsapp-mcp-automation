/**
 * Location Types - Live location tracking and sharing
 */
export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    accuracy: number;
}
export interface LiveLocation {
    id: string;
    userId: string;
    userPhone: string;
    coordinates: LocationCoordinates;
    heading?: number;
    speed?: number;
    timestamp: Date;
    isActive: boolean;
}
export interface LocationShare {
    id: string;
    userId: string;
    chatJid: string;
    coordinates: LocationCoordinates;
    address?: string;
    duration: number;
    sharedAt: Date;
    expiresAt: Date;
    viewers: string[];
}
export interface ShareLocationRequest {
    userId: string;
    chatJid: string;
    coordinates: LocationCoordinates;
    duration: number;
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
//# sourceMappingURL=location.types.d.ts.map