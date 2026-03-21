/**
 * Reactions Types - Animated reactions for WhatsApp messages
 */

export type ReactionType = 'emoji' | 'effect' | 'confetti' | 'fireworks' | 'sparkles' | 'hearts';

export interface ReactionEmoji {
  id: string;
  emoji: string;
  name: string;
  effect?: string;
}

export interface ReactionEffect {
  id: string;
  type: ReactionType;
  animation: string;
  duration: number; // milliseconds
  intensity?: 'light' | 'medium' | 'heavy';
}

export interface CreateReactionRequest {
  messageId: string;
  userId: string;
  chatJid: string;
  emoji: string;
  effectType?: ReactionType;
  intensity?: 'light' | 'medium' | 'heavy';
}

export interface UserReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  effectType: ReactionType;
  createdAt: Date;
  intensity?: 'light' | 'medium' | 'heavy';
}

export interface ReactionResult {
  messageId: string;
  totalReactions: number;
  reactions: {
    emoji: string;
    count: number;
    users: string[];
    effects: ReactionEffect[];
  }[];
}