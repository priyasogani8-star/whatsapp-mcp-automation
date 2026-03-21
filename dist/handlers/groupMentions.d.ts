/**
 * Group Mentions - Send mentions and notifications
 */
import { SendMentionRequest, MentionMessage, MentionStats, GroupRole } from '../types/mention.types';
export declare class GroupMentions {
    private mentionMessages;
    private notifications;
    private groupRoles;
    private mentionStats;
    /**
     * Send mention to group
     */
    sendMention(request: SendMentionRequest): Promise<MentionMessage>;
    /**
     * Send notifications to mentioned users
     */
    private sendNotifications;
    /**
     * Mark notification as read
     */
    markNotificationAsRead(notificationId: string): Promise<void>;
    /**
     * Create group role
     */
    createRole(chatJid: string, roleName: string, userIds: string[]): Promise<GroupRole>;
    /**
     * Get mention statistics
     */
    getStats(chatJid: string): MentionStats;
    /**
     * Update statistics
     */
    private updateStats;
}
//# sourceMappingURL=groupMentions.d.ts.map