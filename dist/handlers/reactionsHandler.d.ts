/**
 * Reactions Handler - Manage animated reactions for messages
 */
import { CreateReactionRequest, UserReaction, ReactionResult } from '../types/reactions.types';
export declare class ReactionsHandler {
    private reactionsStorage;
    /**
     * Add reaction to a message
     */
    addReaction(request: CreateReactionRequest): Promise<void>;
    /**
     * Remove reaction from message
     */
    removeReaction(messageId: string, userId: string): Promise<void>;
    /**
     * Get all reactions for a message
     */
    getMessageReactions(messageId: string): Promise<ReactionResult>;
    /**
     * Get user's reaction to a message
     */
    getUserReaction(messageId: string, userId: string): Promise<UserReaction | null>;
}
//# sourceMappingURL=reactionsHandler.d.ts.map