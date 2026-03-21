/**
 * WhatsApp MCP Automation - MCP Server
 * Registers all 7 tools with the Model Context Protocol
 *
 * Usage: node dist/server.js
 * Add to claude_desktop_config.json or Claude Code settings
 */

// @ts-ignore
import { Server } from '@modelcontextprotocol/sdk/dist/cjs/server/index';
// @ts-ignore
import { StdioServerTransport } from '@modelcontextprotocol/sdk/dist/cjs/server/stdio';
// @ts-ignore
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/dist/cjs/types';
import * as path from 'path';

import { PollHandler } from './handlers/pollHandler';
import { PollDatabase } from './storage/pollDatabase';
import { ReactionsHandler } from './handlers/reactionsHandler';
import { StickerManager } from './handlers/stickerManager';
import { StatusTools } from './handlers/statusTools';
import { EventPlanner } from './handlers/eventPlanner';
import { LiveLocationTracker } from './handlers/liveLocationTracker';
import { GroupMentions } from './handlers/groupMentions';

const DATA_DIR =
  process.env.WHATSAPP_DATA_DIR ||
  path.join(process.env.HOME || process.env.USERPROFILE || '~', '.whatsapp-mcp');
const DB_PATH = path.join(DATA_DIR, 'polls.db');

const pollDb = new PollDatabase(DB_PATH);
const pollHandler = new PollHandler(pollDb);
const reactionsHandler = new ReactionsHandler();
const stickerManager = new StickerManager();
const statusTools = new StatusTools();
const eventPlanner = new EventPlanner();
const locationTracker = new LiveLocationTracker();
const groupMentions = new GroupMentions();

const server = new Server(
  { name: 'whatsapp-mcp-automation', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// ─── LIST TOOLS ─────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
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

server.setRequestHandler(CallToolRequestSchema, async (request: { params: { name: string; arguments?: Record<string, unknown> } }) => {
  const { name, arguments: args } = request.params;
  try {
    switch (name) {
      case 'create_poll': {
        const poll = await pollHandler.createPoll({
          question: args!.question as string,
          choices: args!.choices as string[],
          pollType: args!.pollType as 'single' | 'multiple',
          minSelections: args!.minSelections as number | undefined,
          maxSelections: args!.maxSelections as number | undefined,
          groupJid: args!.groupJid as string | undefined,
          expiresAt: args!.expiresAt ? new Date(args!.expiresAt as string) : undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(poll, null, 2) }] };
      }
      case 'vote_poll': {
        await pollHandler.votePoll({
          pollId: args!.pollId as string,
          userId: args!.userId as string,
          userPhone: args!.userPhone as string,
          selectedChoices: args!.selectedChoices as string[],
        });
        return { content: [{ type: 'text', text: 'Vote recorded successfully' }] };
      }
      case 'change_vote': {
        await pollHandler.changeVote({
          pollId: args!.pollId as string,
          userId: args!.userId as string,
          newSelectedChoices: args!.newSelectedChoices as string[],
        });
        return { content: [{ type: 'text', text: 'Vote updated successfully' }] };
      }
      case 'get_poll_results': {
        const results = await pollHandler.getPollResults(args!.pollId as string);
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }
      case 'list_polls': {
        const polls = await pollHandler.listPolls(args!.groupJid as string | undefined);
        return { content: [{ type: 'text', text: JSON.stringify(polls, null, 2) }] };
      }
      case 'close_poll': {
        await pollHandler.closePoll(args!.pollId as string);
        return { content: [{ type: 'text', text: 'Poll closed' }] };
      }
      case 'add_reaction': {
        await reactionsHandler.addReaction({
          messageId: args!.messageId as string,
          userId: args!.userId as string,
          chatJid: args!.chatJid as string,
          emoji: args!.emoji as string,
          effectType: args!.effectType as any,
          intensity: args!.intensity as any,
        });
        return { content: [{ type: 'text', text: 'Reaction added' }] };
      }
      case 'get_message_reactions': {
        const result = await reactionsHandler.getMessageReactions(args!.messageId as string);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }
      case 'send_sticker': {
        await stickerManager.sendSticker({
          chatJid: args!.chatJid as string,
          stickerId: args!.stickerId as string,
          packId: args!.packId as string,
        });
        return { content: [{ type: 'text', text: 'Sticker sent' }] };
      }
      case 'get_sticker_packs': {
        const packs = await stickerManager.getAvailablePacks();
        return { content: [{ type: 'text', text: JSON.stringify(packs, null, 2) }] };
      }
      case 'create_status': {
        const status = await statusTools.createStatus({
          userId: args!.userId as string,
          type: args!.type as any,
          content: args!.content as string,
          caption: args!.caption as string | undefined,
          visibility: args!.visibility as any,
          effects: args!.effects as string[] | undefined,
          scheduleTime: args!.scheduleTime ? new Date(args!.scheduleTime as string) : undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(status, null, 2) }] };
      }
      case 'create_event': {
        const event = await eventPlanner.createEvent({
          title: args!.title as string,
          description: args!.description as string,
          startTime: new Date(args!.startTime as string),
          endTime: new Date(args!.endTime as string),
          location: args!.location as string | undefined,
          creator: args!.creator as string,
          chatJid: args!.chatJid as string,
          invitees: args!.invitees as string[] | undefined,
          remindBefore: args!.remindBefore as number | undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(event, null, 2) }] };
      }
      case 'rsvp_event': {
        await eventPlanner.respondToInvite(
          args!.eventId as string,
          args!.userId as string,
          args!.rsvpStatus as any,
          args!.notes as string | undefined
        );
        return { content: [{ type: 'text', text: `RSVP: ${args!.rsvpStatus}` }] };
      }
      case 'get_event_stats': {
        const stats = await eventPlanner.getEventStats(args!.eventId as string);
        return { content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }] };
      }
      case 'share_location': {
        const share = await locationTracker.shareLocation({
          userId: args!.userId as string,
          chatJid: args!.chatJid as string,
          coordinates: {
            latitude: args!.latitude as number,
            longitude: args!.longitude as number,
            accuracy: args!.accuracy as number,
          },
          duration: args!.duration as number,
          address: args!.address as string | undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(share, null, 2) }] };
      }
      case 'stop_location_share': {
        await locationTracker.stopSharing(args!.shareId as string);
        return { content: [{ type: 'text', text: 'Location sharing stopped' }] };
      }
      case 'send_mention': {
        const mention = await groupMentions.sendMention({
          chatJid: args!.chatJid as string,
          userId: args!.userId as string,
          message: args!.message as string,
          mentionType: args!.mentionType as any,
          targetUsers: args!.targetUsers as string[] | undefined,
          targetRole: args!.targetRole as string | undefined,
          notificationLevel: args!.notificationLevel as any,
        });
        return { content: [{ type: 'text', text: JSON.stringify(mention, null, 2) }] };
      }
      case 'create_group_role': {
        const role = await groupMentions.createRole(
          args!.chatJid as string,
          args!.roleName as string,
          args!.userIds as string[]
        );
        return { content: [{ type: 'text', text: JSON.stringify(role, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
      isError: true,
    };
  }
});

// ─── START ───────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('WhatsApp MCP Automation server running on stdio');
}

main().catch(console.error);
