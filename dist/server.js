"use strict";
/**
 * WhatsApp MCP Automation - MCP Server
 * Registers all 7 tools with the Model Context Protocol
 *
 * Usage: node dist/server.js
 * Add to claude_desktop_config.json or Claude Code settings
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore - absolute paths bypass Node.js 24 exports map resolution bug
const index_js_1 = require("../node_modules/@modelcontextprotocol/sdk/dist/cjs/server/index.js");
// @ts-ignore
const stdio_js_1 = require("../node_modules/@modelcontextprotocol/sdk/dist/cjs/server/stdio.js");
// @ts-ignore
const types_js_1 = require("../node_modules/@modelcontextprotocol/sdk/dist/cjs/types.js");
const path = __importStar(require("path"));
const pollHandler_1 = require("./handlers/pollHandler");
const pollDatabase_1 = require("./storage/pollDatabase");
const reactionsHandler_1 = require("./handlers/reactionsHandler");
const stickerManager_1 = require("./handlers/stickerManager");
const statusTools_1 = require("./handlers/statusTools");
const eventPlanner_1 = require("./handlers/eventPlanner");
const liveLocationTracker_1 = require("./handlers/liveLocationTracker");
const groupMentions_1 = require("./handlers/groupMentions");
const DATA_DIR = process.env.WHATSAPP_DATA_DIR ||
    path.join(process.env.HOME || process.env.USERPROFILE || '~', '.whatsapp-mcp');
const DB_PATH = path.join(DATA_DIR, 'polls.db');
const pollDb = new pollDatabase_1.PollDatabase(DB_PATH);
const pollHandler = new pollHandler_1.PollHandler(pollDb);
const reactionsHandler = new reactionsHandler_1.ReactionsHandler();
const stickerManager = new stickerManager_1.StickerManager();
const statusTools = new statusTools_1.StatusTools();
const eventPlanner = new eventPlanner_1.EventPlanner();
const locationTracker = new liveLocationTracker_1.LiveLocationTracker();
const groupMentions = new groupMentions_1.GroupMentions();
const server = new index_js_1.Server({ name: 'whatsapp-mcp-automation', version: '1.0.0' }, { capabilities: { tools: {} } });
// ─── LIST TOOLS ─────────────────────────────────────────────────────────────
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
    tools: [
        // POLLS
        {
            name: 'create_poll',
            description: 'Create a single-choice or multiple-choice WhatsApp poll',
            inputSchema: {
                type: 'object',
                properties: {
                    question: { type: 'string', description: 'Poll question' },
                    choices: { type: 'array', items: { type: 'string' } },
                    pollType: { type: 'string', enum: ['single', 'multiple'] },
                    minSelections: { type: 'number' },
                    maxSelections: { type: 'number' },
                    groupJid: { type: 'string' },
                    expiresAt: { type: 'string', description: 'ISO datetime' },
                },
                required: ['question', 'choices', 'pollType'],
            },
        },
        {
            name: 'vote_poll',
            description: 'Vote on an existing WhatsApp poll',
            inputSchema: {
                type: 'object',
                properties: {
                    pollId: { type: 'string' },
                    userId: { type: 'string' },
                    userPhone: { type: 'string' },
                    selectedChoices: { type: 'array', items: { type: 'string' } },
                },
                required: ['pollId', 'userId', 'userPhone', 'selectedChoices'],
            },
        },
        {
            name: 'change_vote',
            description: 'Change an existing vote on a poll',
            inputSchema: {
                type: 'object',
                properties: {
                    pollId: { type: 'string' },
                    userId: { type: 'string' },
                    newSelectedChoices: { type: 'array', items: { type: 'string' } },
                },
                required: ['pollId', 'userId', 'newSelectedChoices'],
            },
        },
        {
            name: 'get_poll_results',
            description: 'Get results and vote counts for a poll',
            inputSchema: {
                type: 'object',
                properties: { pollId: { type: 'string' } },
                required: ['pollId'],
            },
        },
        {
            name: 'list_polls',
            description: 'List all active polls, optionally filtered by group',
            inputSchema: {
                type: 'object',
                properties: { groupJid: { type: 'string' } },
            },
        },
        {
            name: 'close_poll',
            description: 'Close a poll so no more votes can be cast',
            inputSchema: {
                type: 'object',
                properties: { pollId: { type: 'string' } },
                required: ['pollId'],
            },
        },
        // REACTIONS
        {
            name: 'add_reaction',
            description: 'Add an animated reaction (confetti, fireworks, sparkles, hearts) to a WhatsApp message',
            inputSchema: {
                type: 'object',
                properties: {
                    messageId: { type: 'string' },
                    userId: { type: 'string' },
                    chatJid: { type: 'string' },
                    emoji: { type: 'string' },
                    effectType: {
                        type: 'string',
                        enum: ['emoji', 'effect', 'confetti', 'fireworks', 'sparkles', 'hearts'],
                    },
                    intensity: { type: 'string', enum: ['light', 'medium', 'heavy'] },
                },
                required: ['messageId', 'userId', 'chatJid', 'emoji'],
            },
        },
        {
            name: 'get_message_reactions',
            description: 'Get all reactions for a WhatsApp message',
            inputSchema: {
                type: 'object',
                properties: { messageId: { type: 'string' } },
                required: ['messageId'],
            },
        },
        // STICKERS
        {
            name: 'send_sticker',
            description: 'Send a sticker to a WhatsApp chat',
            inputSchema: {
                type: 'object',
                properties: {
                    chatJid: { type: 'string' },
                    stickerId: { type: 'string' },
                    packId: { type: 'string' },
                },
                required: ['chatJid', 'stickerId', 'packId'],
            },
        },
        {
            name: 'get_sticker_packs',
            description: 'List available sticker packs including 2026 New Year pack',
            inputSchema: { type: 'object', properties: {} },
        },
        // STATUS
        {
            name: 'create_status',
            description: 'Create a WhatsApp status update (text, image, video, gif, animated)',
            inputSchema: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    type: { type: 'string', enum: ['text', 'image', 'video', 'gif', 'animated'] },
                    content: { type: 'string', description: 'Text or media URL' },
                    caption: { type: 'string' },
                    visibility: { type: 'string', enum: ['public', 'contacts', 'private'] },
                    effects: { type: 'array', items: { type: 'string' } },
                    scheduleTime: { type: 'string', description: 'ISO datetime to schedule' },
                },
                required: ['userId', 'type', 'content', 'visibility'],
            },
        },
        // EVENTS
        {
            name: 'create_event',
            description: 'Create a group event with RSVP tracking in WhatsApp',
            inputSchema: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    startTime: { type: 'string', description: 'ISO datetime' },
                    endTime: { type: 'string', description: 'ISO datetime' },
                    location: { type: 'string' },
                    creator: { type: 'string' },
                    chatJid: { type: 'string' },
                    invitees: { type: 'array', items: { type: 'string' } },
                    remindBefore: { type: 'number', description: 'Minutes before event' },
                },
                required: ['title', 'description', 'startTime', 'endTime', 'creator', 'chatJid'],
            },
        },
        {
            name: 'rsvp_event',
            description: 'Respond to a WhatsApp event invite',
            inputSchema: {
                type: 'object',
                properties: {
                    eventId: { type: 'string' },
                    userId: { type: 'string' },
                    rsvpStatus: { type: 'string', enum: ['accepted', 'declined', 'maybe'] },
                    notes: { type: 'string' },
                },
                required: ['eventId', 'userId', 'rsvpStatus'],
            },
        },
        {
            name: 'get_event_stats',
            description: 'Get RSVP statistics for a WhatsApp event',
            inputSchema: {
                type: 'object',
                properties: { eventId: { type: 'string' } },
                required: ['eventId'],
            },
        },
        // LOCATION
        {
            name: 'share_location',
            description: 'Share live location in a WhatsApp chat for 5-60 minutes',
            inputSchema: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    chatJid: { type: 'string' },
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                    accuracy: { type: 'number' },
                    duration: { type: 'number', description: 'Minutes (5-60)' },
                    address: { type: 'string' },
                },
                required: ['userId', 'chatJid', 'latitude', 'longitude', 'accuracy', 'duration'],
            },
        },
        {
            name: 'stop_location_share',
            description: 'Stop sharing live location',
            inputSchema: {
                type: 'object',
                properties: { shareId: { type: 'string' } },
                required: ['shareId'],
            },
        },
        // MENTIONS
        {
            name: 'send_mention',
            description: 'Send @all, @role, or @specific mention in a WhatsApp group',
            inputSchema: {
                type: 'object',
                properties: {
                    chatJid: { type: 'string' },
                    userId: { type: 'string' },
                    message: { type: 'string' },
                    mentionType: { type: 'string', enum: ['all', 'role', 'specific', 'admin'] },
                    targetUsers: { type: 'array', items: { type: 'string' } },
                    targetRole: { type: 'string' },
                    notificationLevel: { type: 'string', enum: ['silent', 'normal', 'high'] },
                },
                required: ['chatJid', 'userId', 'message', 'mentionType'],
            },
        },
        {
            name: 'create_group_role',
            description: 'Create a named role in a WhatsApp group for targeted mentions',
            inputSchema: {
                type: 'object',
                properties: {
                    chatJid: { type: 'string' },
                    roleName: { type: 'string' },
                    userIds: { type: 'array', items: { type: 'string' } },
                },
                required: ['chatJid', 'roleName', 'userIds'],
            },
        },
    ],
}));
// ─── CALL TOOLS ─────────────────────────────────────────────────────────────
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'create_poll': {
                const poll = await pollHandler.createPoll({
                    question: args.question,
                    choices: args.choices,
                    pollType: args.pollType,
                    minSelections: args.minSelections,
                    maxSelections: args.maxSelections,
                    groupJid: args.groupJid,
                    expiresAt: args.expiresAt ? new Date(args.expiresAt) : undefined,
                });
                return { content: [{ type: 'text', text: JSON.stringify(poll, null, 2) }] };
            }
            case 'vote_poll': {
                await pollHandler.votePoll({
                    pollId: args.pollId,
                    userId: args.userId,
                    userPhone: args.userPhone,
                    selectedChoices: args.selectedChoices,
                });
                return { content: [{ type: 'text', text: 'Vote recorded successfully' }] };
            }
            case 'change_vote': {
                await pollHandler.changeVote({
                    pollId: args.pollId,
                    userId: args.userId,
                    newSelectedChoices: args.newSelectedChoices,
                });
                return { content: [{ type: 'text', text: 'Vote updated successfully' }] };
            }
            case 'get_poll_results': {
                const results = await pollHandler.getPollResults(args.pollId);
                return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
            }
            case 'list_polls': {
                const polls = await pollHandler.listPolls(args.groupJid);
                return { content: [{ type: 'text', text: JSON.stringify(polls, null, 2) }] };
            }
            case 'close_poll': {
                await pollHandler.closePoll(args.pollId);
                return { content: [{ type: 'text', text: 'Poll closed' }] };
            }
            case 'add_reaction': {
                await reactionsHandler.addReaction({
                    messageId: args.messageId,
                    userId: args.userId,
                    chatJid: args.chatJid,
                    emoji: args.emoji,
                    effectType: args.effectType,
                    intensity: args.intensity,
                });
                return { content: [{ type: 'text', text: 'Reaction added' }] };
            }
            case 'get_message_reactions': {
                const result = await reactionsHandler.getMessageReactions(args.messageId);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'send_sticker': {
                await stickerManager.sendSticker({
                    chatJid: args.chatJid,
                    stickerId: args.stickerId,
                    packId: args.packId,
                });
                return { content: [{ type: 'text', text: 'Sticker sent' }] };
            }
            case 'get_sticker_packs': {
                const packs = await stickerManager.getAvailablePacks();
                return { content: [{ type: 'text', text: JSON.stringify(packs, null, 2) }] };
            }
            case 'create_status': {
                const status = await statusTools.createStatus({
                    userId: args.userId,
                    type: args.type,
                    content: args.content,
                    caption: args.caption,
                    visibility: args.visibility,
                    effects: args.effects,
                    scheduleTime: args.scheduleTime ? new Date(args.scheduleTime) : undefined,
                });
                return { content: [{ type: 'text', text: JSON.stringify(status, null, 2) }] };
            }
            case 'create_event': {
                const event = await eventPlanner.createEvent({
                    title: args.title,
                    description: args.description,
                    startTime: new Date(args.startTime),
                    endTime: new Date(args.endTime),
                    location: args.location,
                    creator: args.creator,
                    chatJid: args.chatJid,
                    invitees: args.invitees,
                    remindBefore: args.remindBefore,
                });
                return { content: [{ type: 'text', text: JSON.stringify(event, null, 2) }] };
            }
            case 'rsvp_event': {
                await eventPlanner.respondToInvite(args.eventId, args.userId, args.rsvpStatus, args.notes);
                return { content: [{ type: 'text', text: `RSVP: ${args.rsvpStatus}` }] };
            }
            case 'get_event_stats': {
                const stats = await eventPlanner.getEventStats(args.eventId);
                return { content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }] };
            }
            case 'share_location': {
                const share = await locationTracker.shareLocation({
                    userId: args.userId,
                    chatJid: args.chatJid,
                    coordinates: {
                        latitude: args.latitude,
                        longitude: args.longitude,
                        accuracy: args.accuracy,
                    },
                    duration: args.duration,
                    address: args.address,
                });
                return { content: [{ type: 'text', text: JSON.stringify(share, null, 2) }] };
            }
            case 'stop_location_share': {
                await locationTracker.stopSharing(args.shareId);
                return { content: [{ type: 'text', text: 'Location sharing stopped' }] };
            }
            case 'send_mention': {
                const mention = await groupMentions.sendMention({
                    chatJid: args.chatJid,
                    userId: args.userId,
                    message: args.message,
                    mentionType: args.mentionType,
                    targetUsers: args.targetUsers,
                    targetRole: args.targetRole,
                    notificationLevel: args.notificationLevel,
                });
                return { content: [{ type: 'text', text: JSON.stringify(mention, null, 2) }] };
            }
            case 'create_group_role': {
                const role = await groupMentions.createRole(args.chatJid, args.roleName, args.userIds);
                return { content: [{ type: 'text', text: JSON.stringify(role, null, 2) }] };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [{ type: 'text', text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});
// ─── START ───────────────────────────────────────────────────────────────────
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('WhatsApp MCP Automation server running on stdio');
}
main().catch(console.error);
//# sourceMappingURL=server.js.map