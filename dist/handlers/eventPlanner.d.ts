/**
 * Event Planner - Create and manage events with RSVPs
 */
import { Event, CreateEventRequest, RSVPStatus, EventStats } from '../types/event.types';
export declare class EventPlanner {
    private events;
    private invites;
    /**
     * Create new event
     */
    createEvent(request: CreateEventRequest): Promise<Event>;
    /**
     * Send invites to users
     */
    sendInvites(eventId: string, userIds: string[]): Promise<void>;
    /**
     * Respond to event invite
     */
    respondToInvite(eventId: string, userId: string, rsvpStatus: RSVPStatus, notes?: string): Promise<void>;
    /**
     * Get event details
     */
    getEvent(eventId: string): Promise<Event>;
    /**
     * Get event statistics
     */
    getEventStats(eventId: string): Promise<EventStats>;
    /**
     * Cancel event
     */
    cancelEvent(eventId: string): Promise<void>;
}
//# sourceMappingURL=eventPlanner.d.ts.map