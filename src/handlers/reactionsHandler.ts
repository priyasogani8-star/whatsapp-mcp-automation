/**
 * Reactions Handler - Manage animated reactions for messages
 */

import { v4 as uuid } from 'uuid';
import {
  CreateReactionRequest,
  UserReaction,
  ReactionResult,
  ReactionType,
} from '../types/reactions.types';

export class ReactionsHandler {
  private reactionsStorage = new Map<string, UserReaction[]>();

  /**
   * Add reaction to a message
   */
  async addReaction(request: CreateReactionRequest): Promise<void> {
    const reaction: UserReaction = {
      id: uuid(),
      messageId: request.messageId,
      userId: request.userId,
      emoji: request.emoji,
      effectType: request.effectType || 'emoji',
      createdAt: new Date(),
      intensity: request.intensity,
    };

    const key = request.messageId;
    if (!this.reactionsStorage.has(key)) {
      this.reactionsStorage.set(key, []);
    }

    // Remove existing reaction from user for this message
    const reactions = this.reactionsStorage.get(key)!;
    const existingIndex = reactions.findIndex((r) => r.userId === request.userId);
    if (existingIndex !== -1) {
      reactions.splice(existingIndex, 1);
    }

    reactions.push(reaction);
  }

  /**
   * Remove reaction from message
   */
  async removeReaction(messageId: string, userId: string): Promise<void> {
    const reactions = this.reactionsStorage.get(messageId);
    if (!reactions) return;

    const index = reactions.findIndex((r) => r.userId === userId);
    if (index !== -1) {
      reactions.splice(index, 1);
    }
  }

  /**
   * Get all reactions for a message
   */
  async getMessageReactions(messageId: string): Promise<ReactionResult> {
    const reactions = this.reactionsStorage.get(messageId) || [];

    const reactionMap = new Map<
      string,
      { count: number; users: string[]; effects: { type: ReactionType; intensity?: string }[] }
    >();

    reactions.forEach((reaction) => {
      if (!reactionMap.has(reaction.emoji)) {
        reactionMap.set(reaction.emoji, { count: 0, users: [], effects: [] });
      }
      const data = reactionMap.get(reaction.emoji)!;
      data.count++;
      data.users.push(reaction.userId);
      data.effects.push({ type: reaction.effectType, intensity: reaction.intensity });
    });

    const reactionsArray = Array.from(reactionMap).map(([emoji, data]) => ({
      emoji,
      count: data.count,
      users: data.users,
      effects: data.effects.map((e) => ({
        id: uuid(),
        type: e.type,
        animation: e.type === 'confetti' ? 'confetti-animation' : e.type,
        duration: 1000,
        intensity: e.intensity as 'light' | 'medium' | 'heavy',
      })),
    }));

    return {
      messageId,
      totalReactions: reactions.length,
      reactions: reactionsArray,
    };
  }

  /**
   * Get user's reaction to a message
   */
  async getUserReaction(messageId: string, userId: string): Promise<UserReaction | null> {
    const reactions = this.reactionsStorage.get(messageId) || [];
    return reactions.find((r) => r.userId === userId) || null;
  }
}