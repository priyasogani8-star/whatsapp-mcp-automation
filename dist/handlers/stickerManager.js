"use strict";
/**
 * Sticker Manager - Manage sticker packs and sending
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StickerManager = void 0;
const uuid_1 = require("uuid");
class StickerManager {
    constructor() {
        this.stickerPacks = new Map();
        this.userLibraries = new Map();
        this.usageStats = new Map();
        this.initializePacks();
    }
    /**
     * Initialize default sticker packs (2026 themed)
     */
    initializePacks() {
        // 2026 New Year Pack
        const newYearPack = {
            id: (0, uuid_1.v4)(),
            name: '2026 New Year Vibes',
            type: '2026',
            stickers: [
                {
                    id: (0, uuid_1.v4)(),
                    name: 'Confetti Pop',
                    emoji: '🎉',
                    packId: 'new-year',
                    packName: '2026 New Year',
                    packType: '2026',
                    createdAt: new Date(),
                },
                {
                    id: (0, uuid_1.v4)(),
                    name: 'Fireworks',
                    emoji: '🎆',
                    packId: 'new-year',
                    packName: '2026 New Year',
                    packType: '2026',
                    createdAt: new Date(),
                },
                {
                    id: (0, uuid_1.v4)(),
                    name: 'Party Sparkles',
                    emoji: '✨',
                    packId: 'new-year',
                    packName: '2026 New Year',
                    packType: '2026',
                    createdAt: new Date(),
                },
            ],
            description: 'Celebrate 2026 with festive stickers!',
            author: 'WhatsApp MCP Automation',
            createdAt: new Date(),
            isPublic: true,
        };
        this.stickerPacks.set(newYearPack.id, newYearPack);
    }
    /**
     * Send sticker to chat
     */
    async sendSticker(request) {
        const pack = this.stickerPacks.get(request.packId);
        if (!pack)
            throw new Error(`Sticker pack ${request.packId} not found`);
        const sticker = pack.stickers.find((s) => s.id === request.stickerId);
        if (!sticker)
            throw new Error(`Sticker ${request.stickerId} not found`);
        // Track usage
        const statsKey = `${request.stickerId}_${request.packId}`;
        if (!this.usageStats.has(statsKey)) {
            this.usageStats.set(statsKey, {
                stickerId: request.stickerId,
                packId: request.packId,
                usageCount: 0,
                lastUsed: new Date(),
                popularityRank: 0,
            });
        }
        const stats = this.usageStats.get(statsKey);
        stats.usageCount++;
        stats.lastUsed = new Date();
    }
    /**
     * Get available sticker packs
     */
    async getAvailablePacks() {
        return Array.from(this.stickerPacks.values()).filter((p) => p.isPublic);
    }
    /**
     * Create custom sticker pack
     */
    async createCustomPack(userId, name, stickers) {
        const packId = (0, uuid_1.v4)();
        const pack = {
            id: packId,
            name,
            type: 'custom',
            stickers: stickers.map((s) => ({
                ...s,
                packId,
                packName: name,
                createdAt: new Date(),
            })),
            description: `Custom pack by ${userId}`,
            author: userId,
            createdAt: new Date(),
            isPublic: false,
        };
        this.stickerPacks.set(packId, pack);
        return pack;
    }
    /**
     * Get user's sticker library
     */
    async getUserLibrary(userId) {
        if (!this.userLibraries.has(userId)) {
            this.userLibraries.set(userId, {
                userId,
                favoriteStickers: [],
                installedPacks: [],
                recentlyUsed: [],
            });
        }
        return this.userLibraries.get(userId);
    }
    /**
     * Add sticker to favorites
     */
    async addToFavorites(userId, stickerId) {
        const library = await this.getUserLibrary(userId);
        if (!library.favoriteStickers.includes(stickerId)) {
            library.favoriteStickers.push(stickerId);
        }
    }
}
exports.StickerManager = StickerManager;
//# sourceMappingURL=stickerManager.js.map