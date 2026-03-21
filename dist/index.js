"use strict";
/**
 * WhatsApp MCP Automation - Main Entry Point
 * Exports all handlers and utilities
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAME = exports.VERSION = exports.AutomationValidator = exports.GroupMentions = exports.LiveLocationTracker = exports.EventPlanner = exports.StatusTools = exports.StickerManager = exports.ReactionsHandler = exports.PollDatabase = exports.PollValidator = exports.PollHandler = void 0;
// Poll Voting
var pollHandler_1 = require("./handlers/pollHandler");
Object.defineProperty(exports, "PollHandler", { enumerable: true, get: function () { return pollHandler_1.PollHandler; } });
var pollValidator_1 = require("./validators/pollValidator");
Object.defineProperty(exports, "PollValidator", { enumerable: true, get: function () { return pollValidator_1.PollValidator; } });
var pollDatabase_1 = require("./storage/pollDatabase");
Object.defineProperty(exports, "PollDatabase", { enumerable: true, get: function () { return pollDatabase_1.PollDatabase; } });
__exportStar(require("./types/poll.types"), exports);
// Reactions
var reactionsHandler_1 = require("./handlers/reactionsHandler");
Object.defineProperty(exports, "ReactionsHandler", { enumerable: true, get: function () { return reactionsHandler_1.ReactionsHandler; } });
__exportStar(require("./types/reactions.types"), exports);
// Stickers
var stickerManager_1 = require("./handlers/stickerManager");
Object.defineProperty(exports, "StickerManager", { enumerable: true, get: function () { return stickerManager_1.StickerManager; } });
__exportStar(require("./types/sticker.types"), exports);
// Status
var statusTools_1 = require("./handlers/statusTools");
Object.defineProperty(exports, "StatusTools", { enumerable: true, get: function () { return statusTools_1.StatusTools; } });
__exportStar(require("./types/status.types"), exports);
// Events
var eventPlanner_1 = require("./handlers/eventPlanner");
Object.defineProperty(exports, "EventPlanner", { enumerable: true, get: function () { return eventPlanner_1.EventPlanner; } });
__exportStar(require("./types/event.types"), exports);
// Location
var liveLocationTracker_1 = require("./handlers/liveLocationTracker");
Object.defineProperty(exports, "LiveLocationTracker", { enumerable: true, get: function () { return liveLocationTracker_1.LiveLocationTracker; } });
__exportStar(require("./types/location.types"), exports);
// Mentions
var groupMentions_1 = require("./handlers/groupMentions");
Object.defineProperty(exports, "GroupMentions", { enumerable: true, get: function () { return groupMentions_1.GroupMentions; } });
__exportStar(require("./types/mention.types"), exports);
// Validator
var automationValidator_1 = require("./validators/automationValidator");
Object.defineProperty(exports, "AutomationValidator", { enumerable: true, get: function () { return automationValidator_1.AutomationValidator; } });
// Version
exports.VERSION = '1.0.0';
exports.NAME = 'whatsapp-mcp-automation';
//# sourceMappingURL=index.js.map