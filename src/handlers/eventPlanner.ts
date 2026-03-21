/**
 * Event Planner - Create and manage events with RSVPs
 */

import { v4 as uuid } from 'uuid';
import {
  Event,
  CreateEventRequest,
  EventInvite,
  RSVPStatus,
  EventStats,
  EventReminder,
} from '../types/event.types';

export class EventPlanner {
  private events = new Map<string, Event>();
  private invites = new Map<string, EventInvite[]>();

  /**
   * Create new event
   */
  async createEvent(request: CreateEventRequest): Promise<Event> {
    const eventId = uuid();

    const event: Event = {
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
        id: uuid(),
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
  async sendInvites(eventId: string, userIds: string[]): Promise<void> {
    const invites = userIds.map((userId) => ({
      id: uuid(),
      eventId,
      userId,
      rsvpStatus: 'pending' as RSVPStatus,
    }));

    this.invites.set(eventId, invites);

    const event = this.events.get(eventId)!;
    event.invites = invites;
  }

  /**
   * Respond to event invite
   */
  async respondToInvite(
    eventId: string,
    userId: string,
    rsvpStatus: RSVPStatus,
    notes?: string
  ): Promise<void> {
    const invites = this.invites.get(eventId);
    if (!invites) throw new Error(`Event ${eventId} not found`);

    const invite = invites.find((i) => i.userId === userId);
    if (!invite) throw new Error(`No invite found for user ${userId}`);

    invite.rsvpStatus = rsvpStatus;
    invite.respondedAt = new Date();
    invite.notes = notes;
  }

  /**
   * Get event details
   */
  async getEvent(eventId: string): Promise<Event> {
    const event = this.events.get(eventId);
    if (!event) throw new Error(`Event ${eventId} not found`);
    return event;
  }

  /**
   * Get event statistics
   */
  async getEventStats(eventId: string): Promise<EventStats> {
    const event = this.events.get(eventId);
    if (!event) throw new Error(`Event ${eventId} not found`);

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
  async cancelEvent(eventId: string): Promise<void> {
    const event = this.events.get(eventId);
    if (!event) throw new Error(`Event ${eventId} not found`);

    event.status = 'cancelled';
    event.updatedAt = new Date();
  }
}