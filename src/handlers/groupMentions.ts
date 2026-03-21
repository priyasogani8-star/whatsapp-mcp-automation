/**
 * Group Mentions - Send mentions and notifications
 */

import { v4 as uuid } from 'uuid';
import {
  SendMentionRequest,
  MentionMessage,
  MentionNotification,
  MentionTarget,
  MentionStats,
  MentionType,
  GroupRole,
} from '../types/mention.types';

export class GroupMentions {
  private mentionMessages = new Map<string, MentionMessage>();
  private notifications = new Map<string, MentionNotification[]>();
  private groupRoles = new Map<string, GroupRole[]>();
  private mentionStats = new Map<string, MentionStats>();

  /**
   * Send mention to group
   */
  async sendMention(request: SendMentionRequest): Promise<MentionMessage> {
    const messageId = uuid();

    // Determine target users
    let mentionedUsers: string[] = [];
    if (request.mentionType === 'all') {
      mentionedUsers = ['@all']; // Placeholder for all users
    } else if (request.mentionType === 'specific' && request.targetUsers) {
      mentionedUsers = request.targetUsers;
    } else if (request.mentionType === 'role' && request.targetRole) {
      const roles = this.groupRoles.get(request.chatJid) || [];
      const role = roles.find((r) => r.name === request.targetRole);
      mentionedUsers = role ? role.userIds : [];
    }

    const mention: MentionMessage = {
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
  private async sendNotifications(
    messageId: string,
    userIds: string[],
    level?: string
  ): Promise<void> {
    const mention = this.mentionMessages.get(messageId)!;

    const notifications = userIds.map((userId) => ({
      id: uuid(),
      mentionId: messageId,
      userId,
      mentionedIn: mention.content.slice(0, 50),
      sentAt: new Date(),
      status: 'sent' as const,
    }));

    this.notifications.set(messageId, notifications);
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
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
  async createRole(chatJid: string, roleName: string, userIds: string[]): Promise<GroupRole> {
    if (!this.groupRoles.has(chatJid)) {
      this.groupRoles.set(chatJid, []);
    }

    const role: GroupRole = {
      name: roleName,
      userIds,
      permissions: [],
    };

    this.groupRoles.get(chatJid)!.push(role);
    return role;
  }

  /**
   * Get mention statistics
   */
  getStats(chatJid: string): MentionStats {
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
    return this.mentionStats.get(chatJid)!;
  }

  /**
   * Update statistics
   */
  private updateStats(chatJid: string, mentionType: MentionType): void {
    const stats = this.getStats(chatJid);
    stats.totalMentions++;

    if (mentionType === 'all') stats.allMentions++;
    else if (mentionType === 'role') stats.roleMentions++;
    else if (mentionType === 'specific') stats.specificMentions++;
    else if (mentionType === 'admin') stats.adminMentions++;
  }
}