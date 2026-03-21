/**
 * WhatsApp MCP Automation - Main Entry Point
 * Exports all handlers and utilities
 */

// Poll Voting
export { PollHandler } from './handlers/pollHandler';
export { PollValidator } from './validators/pollValidator';
export { PollDatabase } from './storage/pollDatabase';
export * from './types/poll.types';

// Reactions
export { ReactionsHandler } from './handlers/reactionsHandler';
export * from './types/reactions.types';

// Stickers
export { StickerManager } from './handlers/stickerManager';
export * from './types/sticker.types';

// Status
export { StatusTools } from './handlers/statusTools';
export * from './types/status.types';

// Events
export { EventPlanner } from './handlers/eventPlanner';
export * from './types/event.types';

// Location
export { LiveLocationTracker } from './handlers/liveLocationTracker';
export * from './types/location.types';

// Mentions
export { GroupMentions } from './handlers/groupMentions';
export * from './types/mention.types';

// Validator
export { AutomationValidator } from './validators/automationValidator';

// Version
export const VERSION = '1.0.0';
export const NAME = 'whatsapp-mcp-automation';