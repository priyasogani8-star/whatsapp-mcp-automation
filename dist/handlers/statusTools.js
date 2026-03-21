"use strict";
/**
 * Status Tools - Create and manage WhatsApp status updates
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusTools = void 0;
const uuid_1 = require("uuid");
class StatusTools {
    constructor() {
        this.statusPosts = new Map();
        this.viewStats = new Map();
    }
    /**
     * Create new status post
     */
    async createStatus(request) {
        const statusId = (0, uuid_1.v4)();
        const status = {
            id: statusId,
            userId: request.userId,
            content: {
                id: (0, uuid_1.v4)(),
                type: request.type,
                content: request.content,
                caption: request.caption,
                stickers: request.stickers,
                effects: request.effects,
            },
            visibility: request.visibility,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            reactions: new Map(),
            views: [],
            scheduleTime: request.scheduleTime,
        };
        this.statusPosts.set(statusId, status);
        // Initialize view stats
        this.viewStats.set(statusId, {
            statusId,
            totalViews: 0,
            viewers: [],
            reactions: [],
            shares: 0,
            savedCount: 0,
        });
        return status;
    }
    /**
     * View status (track view)
     */
    async viewStatus(statusId, viewerId) {
        const status = this.statusPosts.get(statusId);
        if (!status)
            throw new Error(`Status ${statusId} not found`);
        if (!status.views.includes(viewerId)) {
            status.views.push(viewerId);
        }
        const stats = this.viewStats.get(statusId);
        if (!stats.viewers.includes(viewerId)) {
            stats.viewers.push(viewerId);
            stats.totalViews++;
        }
    }
    /**
     * Add reaction to status
     */
    async addReaction(statusId, emoji, userId) {
        const status = this.statusPosts.get(statusId);
        if (!status)
            throw new Error(`Status ${statusId} not found`);
        const currentCount = status.reactions.get(emoji) || 0;
        status.reactions.set(emoji, currentCount + 1);
        const stats = this.viewStats.get(statusId);
        const reactionIndex = stats.reactions.findIndex((r) => r.emoji === emoji);
        if (reactionIndex !== -1) {
            stats.reactions[reactionIndex].count++;
        }
        else {
            stats.reactions.push({ emoji, count: 1 });
        }
    }
    /**
     * Get status view statistics
     */
    async getViewStats(statusId) {
        const stats = this.viewStats.get(statusId);
        if (!stats)
            throw new Error(`Status ${statusId} not found`);
        return stats;
    }
    /**
     * Schedule status post
     */
    async scheduleStatus(request, scheduleTime) {
        return this.createStatus({
            ...request,
            scheduleTime,
        });
    }
    /**
     * Delete status
     */
    async deleteStatus(statusId) {
        this.statusPosts.delete(statusId);
        this.viewStats.delete(statusId);
    }
}
exports.StatusTools = StatusTools;
//# sourceMappingURL=statusTools.js.map