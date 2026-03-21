/**
 * Sticker Manager - Manage sticker packs and sending
 */
import { Sticker, StickerPack, SendStickerRequest, UserStickerLibrary } from '../types/sticker.types';
export declare class StickerManager {
    private stickerPacks;
    private userLibraries;
    private usageStats;
    constructor();
    /**
     * Initialize default sticker packs (2026 themed)
     */
    private initializePacks;
    /**
     * Send sticker to chat
     */
    sendSticker(request: SendStickerRequest): Promise<void>;
    /**
     * Get available sticker packs
     */
    getAvailablePacks(): Promise<StickerPack[]>;
    /**
     * Create custom sticker pack
     */
    createCustomPack(userId: string, name: string, stickers: Omit<Sticker, 'packId' | 'packName' | 'createdAt'>[]): Promise<StickerPack>;
    /**
     * Get user's sticker library
     */
    getUserLibrary(userId: string): Promise<UserStickerLibrary>;
    /**
     * Add sticker to favorites
     */
    addToFavorites(userId: string, stickerId: string): Promise<void>;
}
//# sourceMappingURL=stickerManager.d.ts.map