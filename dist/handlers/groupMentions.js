"use strict";
/**
 * Group Mentions - Send mentions and notifications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMentions = void 0;
const uuid_1 = require("uuid");
class GroupMentions {
    constructor() {
        this.mentionMessages = new Map();
        this.notifications = new Map();
        this.groupRoles = new Map();
        this.mentionStats = new Map();
    }
    /**
     * Send mention to group
     */
    async sendMention(request) {
        const messageId = (0, uuid_1.v4)();
        // Determine target users
        let mentionedUsers = [];
        if (request.mentionType === 'all') {
            mentionedUsers = ['@all']; // Placeholder for all users
        }
        else if (request.mentionType === 'specific' && request.targetUsers) {
            mentionedUsers = request.targetUsers;
        }
        else if (request.mentionType === 'role' && request.targetRole) {
            const roles = this.groupRoles.get(request.chatJid) || [];
            const role = roles.find((r) => r.name === request.targetRole);
            mentionedUsers = role ? role.userIds : [];
        }
        const mention = {
            id: messageId,
            senderId: request.userId,
            chatJid: request.chatJid,
            content: request.message,
            mentions: {
                type: request.mentionType,
                targetIds: request.targetUsers,
                role: request.targetRole,
            },
            mentionedUsers,
            createdAt: new Date(),
            notificationsSent: mentionedUsers.length,
            readBy: [],
        };
        this.mentionMessages.set(messageId, mention);
        // Send notifications
        await this.sendNotifications(messageId, mentionedUsers, request.notificationLevel);
        // Update stats
        this.updateStats(request.chatJid, request.mentionType);
        return mention;
    }
    /**
     * Send notifications to mentioned users
     */
    async sendNotifications(messageId, userIds, level) {
        const mention = this.mentionMessages.get(messageId);
        const notifications = userIds.map((userId) => ({
            id: (0, uuid_1.v4)(),
            mentionId: messageId,
            userId,
            mentionedIn: mention.content.slice(0, 50),
            sentAt: new Date(),
            status: 'sent',
        }));
        this.notifications.set(messageId, notifications);
    }
    /**
     * Mark notification as read
     */
    async markNotificationAsRead(notificationId) {
        for (const [, notifications] of this.notifications) {
            const notification = notifications.find((n) => n.id === notificationId);
            if (notification) {
                notification.readAt = new Date();
                notification.status = 'read';
                break;
            }
        }
    }
    /**
     * Create group role
     */
    async createRole(chatJid, roleName, userIds) {
        if (!this.groupRoles.has(chatJid)) {
            this.groupRoles.set(chatJid, []);
        }
        const role = {
            name: roleName,
            userIds,
            permissions: [],
        };
        this.groupRoles.get(chatJid).push(role);
        return role;
    }
    /**
     * Get mention statistics
     */
    getStats(chatJid) {
        if (!this.mentionStats.has(chatJid)) {
            this.mentionStats.set(chatJid, {
                chatJid,
                totalMentions: 0,
                allMentions: 0,
                roleMentions: 0,
                specificMentions: 0,
                adminMentions: 0,
                mostMentionedUsers: [],
            });
        }
        return this.mentionStats.get(chatJid);
    }
    /**
     * Update statistics
     */
    updateStats(chatJid, mentionType) {
        const stats = this.getStats(chatJid);
        stats.totalMentions++;
        if (mentionType === 'all')
            stats.allMentions++;
        else if (mentionType === 'role')
            stats.roleMentions++;
        else if (mentionType === 'specific')
            stats.specificMentions++;
        else if (mentionType === 'admin')
            stats.adminMentions++;
    }
}
exports.GroupMentions = GroupMentions;
//# sourceMappingURL=groupMentions.js.map