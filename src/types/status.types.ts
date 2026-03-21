/**
 * Status Types - WhatsApp status management
 */

export type StatusType = 'text' | 'image' | 'video' | 'gif' | 'animated';
export type StatusVisibility = 'public' | 'contacts' | 'private';

export interface StatusContent {
  id: string;
  type: StatusType;
  content: string; // URL or text
  caption?: string;
  stickers?: string[];
  effects?: string[];
  filters?: string[];
}

export interface StatusPost {
  id: string;
  userId: string;
  content: StatusContent;
  visibility: StatusVisibility;
  createdAt: Date;
  expiresAt: Date;
  reactions: Map<string, number>;
  views: string[];
  scheduleTime?: Date;
}

export interface CreateStatusRequest {
  userId: string;
  type: StatusType;
  content: string;
  caption?: string;
  visibility: StatusVisibility;
  stickers?: string[];
  effects?: string[];
  scheduleTime?: Date;
}

export interface StatusViewStats {
  statusId: string;
  totalViews: number;
  viewers: string[];
  reactions: { emoji: string; count: number }[];
  shares: number;
  savedCount: number;
}

export interface StatusEffect {
  id: string;
  name: string;
  type: 'filter' | 'animation' | 'text-effect';
  description: string;
}