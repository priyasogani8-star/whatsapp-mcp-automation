/**
 * Automation Validator - Validate all automation features
 */

import {
  CreateReactionRequest,
  SendStickerRequest,
  CreateStatusRequest,
  CreateEventRequest,
  ShareLocationRequest,
  SendMentionRequest,
} from '../types/index';

export class AutomationValidator {
  /**
   * Validate reaction request
   */
  validateReaction(request: CreateReactionRequest): void {
    if (!request.messageId) throw new Error('messageId required');
    if (!request.userId) throw new Error('userId required');
    if (!request.emoji) throw new Error('emoji required');
  }

  /**
   * Validate sticker request
   */
  validateSticker(request: SendStickerRequest): void {
    if (!request.chatJid) throw new Error('chatJid required');
    if (!request.stickerId) throw new Error('stickerId required');
    if (!request.packId) throw new Error('packId required');
  }

  /**
   * Validate status request
   */
  validateStatus(request: CreateStatusRequest): void {
    if (!request.userId) throw new Error('userId required');
    if (!request.type) throw new Error('type required');
    if (!request.content) throw new Error('content required');
    if (!request.visibility) throw new Error('visibility required');

    const validTypes = ['text', 'image', 'video', 'gif', 'animated'];
    if (!validTypes.includes(request.type)) throw new Error('Invalid status type');

    const validVisibility = ['public', 'contacts', 'private'];
    if (!validVisibility.includes(request.visibility)) throw new Error('Invalid visibility');
  }

  /**
   * Validate event request
   */
  validateEvent(request: CreateEventRequest): void {
    if (!request.title) throw new Error('title required');
    if (!request.startTime) throw new Error('startTime required');
    if (!request.endTime) throw new Error('endTime required');
    if (request.startTime >= request.endTime) throw new Error('startTime must be before endTime');
    if (!request.creator) throw new Error('creator required');
    if (!request.chatJid) throw new Error('chatJid required');
  }

  /**
   * Validate location request
   */
  validateLocation(request: ShareLocationRequest): void {
    if (!request.userId) throw new Error('userId required');
    if (!request.chatJid) throw new Error('chatJid required');
    if (!request.coordinates) throw new Error('coordinates required');
    if (!request.coordinates.latitude || !request.coordinates.longitude) {
      throw new Error('Invalid coordinates');
    }
    if (request.duration < 5 || request.duration > 60) {
      throw new Error('Duration must be between 5 and 60 minutes');
    }
  }

  /**
   * Validate mention request
   */
  validateMention(request: SendMentionRequest): void {
    if (!request.chatJid) throw new Error('chatJid required');
    if (!request.userId) throw new Error('userId required');
    if (!request.message) throw new Error('message required');
    if (!request.mentionType) throw new Error('mentionType required');

    const validTypes = ['all', 'role', 'specific', 'admin'];
    if (!validTypes.includes(request.mentionType)) throw new Error('Invalid mention type');
  }
}