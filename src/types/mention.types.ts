/**
 * Mention Types - Group mentions and notifications
 */

export type MentionType = 'all' | 'role' | 'specific' | 'admin';

export interface MentionTarget {
  type: MentionType;
  targetIds?: string[]; // user IDs for specific mentions
  role?: string; // for role-based mentions
}

export interface MentionMessage {
  id: string;
  senderId: string;
  chatJid: string;
  content: string;
  mentions: MentionTarget;
  mentionedUsers: string[];
  createdAt: Date;
  notificationsSent: number;
  readBy: string[];
}

export interface SendMentionRequest {
  chatJid: string;
  userId: string;
  message: string;
  mentionType: MentionType;
  targetUsers?: string[];
  targetRole?: string;
  notificationLevel?: 'silent' | 'normal' | 'high';
}

export interface MentionNotification {
  id: string;
  mentionId: string;
  userId: string;
  mentionedIn: string; // message content snippet
  sentAt: Date;
  readAt?: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface GroupRole {
  name: string;
  userIds: string[];
  permissions: string[];
}

export interface MentionStats {
  chatJid: string;
  totalMentions: number;
  allMentions: number;
  roleMentions: number;
  specificMentions: number;
  adminMentions: number;
  mostMentionedUsers: { userId: string; count: number }[];
}