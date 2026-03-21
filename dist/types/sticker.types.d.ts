/**
 * Sticker Types - Sticker management for WhatsApp
 */
export type StickerPackType = 'emoji' | 'animated' | '2026' | 'custom' | 'reaction';
export interface Sticker {
    id: string;
    name: string;
    emoji: string;
    packId: string;
    packName: string;
    packType: StickerPackType;
    imageUrl?: string;
    animatedUrl?: string;
    createdAt: Date;
}
export interface StickerPack {
    id: string;
    name: string;
    type: StickerPackType;
    stickers: Sticker[];
    description: string;
    author?: string;
    createdAt: Date;
    isPublic: boolean;
}
export interface SendStickerRequest {
    chatJid: string;
    stickerId: string;
    packId: string;
    isStatusSticker?: boolean;
}
export interface UserStickerLibrary {
    userId: string;
    favoriteStickers: string[];
    installedPacks: string[];
    recentlyUsed: string[];
}
export interface StickerUsageStats {
    stickerId: string;
    packId: string;
    usageCount: number;
    lastUsed: Date;
    popularityRank: number;
}
//# sourceMappingURL=sticker.types.d.ts.map