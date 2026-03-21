"use strict";
/**
 * Event Planner - Create and manage events with RSVPs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPlanner = void 0;
const uuid_1 = require("uuid");
class EventPlanner {
    constructor() {
        this.events = new Map();
        this.invites = new Map();
    }
    /**
     * Create new event
     */
    async createEvent(request) {
        const eventId = (0, uuid_1.v4)();
        const event = {
            id: eventId,
            title: request.title,
            description: request.description,
            startTime: request.startTime,
            endTime: request.endTime,
            location: request.location,
            creator: request.creator,
            chatJid: request.chatJid,
            status: 'draft',
            invites: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            reminders: [],
        };
        // Create reminders
        if (request.remindBefore) {
            event.reminders.push({
                id: (0, uuid_1.v4)(),
                eventId,
                minutesBefore: request.remindBefore,
                sent: false,
            });
        }
        this.events.set(eventId, event);
        // Send invites
        if (request.invitees && request.invitees.length > 0) {
            await this.sendInvites(eventId, request.invitees);
        }
        event.status = 'scheduled';
        return event;
    }
    /**
     * Send invites to users
     */
    async sendInvites(eventId, userIds) {
        const invites = userIds.map((userId) => ({
            id: (0, uuid_1.v4)(),
            eventId,
            userId,
            rsvpStatus: 'pending',
        }));
        this.invites.set(eventId, invites);
        const event = this.events.get(eventId);
        event.invites = invites;
    }
    /**
     * Respond to event invite
     */
    async respondToInvite(eventId, userId, rsvpStatus, notes) {
        const invites = this.invites.get(eventId);
        if (!invites)
            throw new Error(`Event ${eventId} not found`);
        const invite = invites.find((i) => i.userId === userId);
        if (!invite)
            throw new Error(`No invite found for user ${userId}`);
        invite.rsvpStatus = rsvpStatus;
        invite.respondedAt = new Date();
        invite.notes = notes;
    }
    /**
     * Get event details
     */
    async getEvent(eventId) {
        const event = this.events.get(eventId);
        if (!event)
            throw new Error(`Event ${eventId} not found`);
        return event;
    }
    /**
     * Get event statistics
     */
    async getEventStats(eventId) {
        const event = this.events.get(eventId);
        if (!event)
            throw new Error(`Event ${eventId} not found`);
        const invites = event.invites;
        const accepted = invites.filter((i) => i.rsvpStatus === 'accepted').length;
        const declined = invites.filter((i) => i.rsvpStatus === 'declined').length;
        const maybe = invites.filter((i) => i.rsvpStatus === 'maybe').length;
        const pending = invites.filter((i) => i.rsvpStatus === 'pending').length;
        const responseRate = invites.length > 0 ? ((accepted + declined + maybe) / invites.length) * 100 : 0;
        return {
            eventId,
            totalInvites: invites.length,
            accepted,
            declined,
            maybe,
            pending,
            responseRate,
        };
    }
    /**
     * Cancel event
     */
    async cancelEvent(eventId) {
        const event = this.events.get(eventId);
        if (!event)
            throw new Error(`Event ${eventId} not found`);
        event.status = 'cancelled';
        event.updatedAt = new Date();
    }
}
exports.EventPlanner = EventPlanner;
//# sourceMappingURL=eventPlanner.js.map