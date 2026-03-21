# WhatsApp MCP Automation

> **7 powerful WhatsApp tools for Claude, Cursor, and Windsurf — features missing from [lharries/whatsapp-mcp](https://github.com/lharries/whatsapp-mcp)**

This is a **companion MCP tool package** that runs *alongside* `lharries/whatsapp-mcp`. It adds features that lharries doesn't support.

---

## What's in lharries/whatsapp-mcp vs This Repo

| Feature | lharries/whatsapp-mcp | This Repo |
|---------|----------------------|-----------|
| Search contacts | ✅ | — |
| List chats | ✅ | — |
| Read messages | ✅ | — |
| Send messages | ✅ | — |
| Send media/files | ✅ | — |
| Download media | ✅ | — |
| **Poll voting** (single & multiple-choice) | ❌ | ✅ |
| **Animated reactions** (confetti, fireworks) | ⚠️ Partial | ✅ Enhanced |
| **Sticker manager** (2026 packs) | ❌ | ✅ |
| **Status creation** (with effects, scheduling) | ❌ | ✅ |
| **Event planner** (RSVP tracking) | ❌ | ✅ |
| **Live location** (real-time sharing) | ⚠️ Basic | ✅ Enhanced |
| **Group mentions** (@all, @role, @specific) | ❌ | ✅ |

---

## The 7 Tools — Explained Simply

### 🗳️ 1. Poll Voting
> *Like creating a poll on Instagram, but for WhatsApp*

**Single-choice** — pick exactly one option:
```
"Where should we eat?" → Pizza / Sushi / Burger
You pick: Pizza ✓  (can change your mind later)
```

**Multiple-choice** — pick several options:
```
"What properties interest you?" → 1BHK / 2BHK / 3BHK / Villa
You pick: 1BHK + 2BHK (can add/remove later)
```

**MCP tools:** `create_poll` · `vote_poll` · `change_vote` · `get_poll_results` · `list_polls` · `close_poll`

---

### 😍 2. Animated Reactions
> *React to a message with more than just a thumbs up — add confetti, fireworks, sparkles*

```
Message: "Happy birthday! 🎂"
→ User 1 reacts: 🎉 with confetti animation (heavy)
→ User 2 reacts: ❤️ with hearts animation
```

**Effect types:** `confetti` · `fireworks` · `sparkles` · `hearts` · `emoji` · `effect`

**MCP tools:** `add_reaction` · `get_message_reactions`

---

### 🎨 3. Sticker Manager
> *Send stickers from packs — comes with a 2026 New Year pack built in*

**Pre-installed packs:**
- 🎉 2026 New Year Vibes (Confetti Pop, Fireworks, Party Sparkles)

**Can also:** create custom packs, add to favorites, track usage stats

**MCP tools:** `send_sticker` · `get_sticker_packs`

---

### 📸 4. Status Tools
> *Post WhatsApp status updates with effects, scheduling, and view tracking*

```
Post: Sunset photo + vintage filter + star stickers
Visibility: Contacts only
Schedule: Tomorrow 8 AM
→ Tracks: 150 views, 45 reactions, 12 saves
```

**Status types:** `text` · `image` · `video` · `gif` · `animated`

**MCP tools:** `create_status`

---

### 🎉 5. Event Planner
> *Create group events and track who is coming — like Google Calendar inside WhatsApp*

```
Event: "Team Lunch" | March 25, 12–2 PM | Pizza Place
Invite: 20 people → 15 accepted, 2 declined, 2 maybe, 1 pending
Reminders: 1 day before + 1 hour before
```

**RSVP options:** `accepted` ✅ · `declined` ❌ · `maybe` 🤷 · `pending` ⏳

**MCP tools:** `create_event` · `rsvp_event` · `get_event_stats`

---

### 📍 6. Live Location Tracker
> *Share your location in a chat for 5–60 minutes, update it in real time*

```
Share location for 30 min → group sees where you are
Update every few minutes as you move
Stop sharing anytime
```

**MCP tools:** `share_location` · `stop_location_share`

---

### 📢 7. Group Mentions
> *Send important messages that notify specific people — @all, @role, or @specific*

```
@all → notifies everyone
@role "Team Leads" → notifies only team leads
@specific user_2 user_3 → notifies just those two
```

**MCP tools:** `send_mention` · `create_group_role`

---

## Architecture

```
┌──────────────────────────────────────────────┐
│       Claude / Cursor / Windsurf              │
└────────────┬────────────────┬────────────────┘
             │                │
   ┌──────────▼──────┐  ┌─────▼──────────────────┐
   │ lharries/       │  │ whatsapp-mcp-automation │
   │ whatsapp-mcp    │  │ (THIS REPO)             │
   │                 │  │                         │
   │ • Read msgs     │  │ • Poll Voting     🗳️   │
   │ • Send msgs     │  │ • Reactions       😍   │
   │ • Contacts      │  │ • Stickers        🎨   │
   │ • Media         │  │ • Status Tools    📸   │
   └─────────────────┘  │ • Event Planner   🎉   │
                        │ • Live Location   📍   │
                        │ • Group Mentions  📢   │
                        └─────────────────────────┘
```

Both run as **separate MCP servers simultaneously** in your AI agent.

---

## Installation

### Step 1: Prerequisites

- Node.js 18+
- [lharries/whatsapp-mcp](https://github.com/lharries/whatsapp-mcp) already set up (for WhatsApp connection)

### Step 2: Clone and Install

```bash
git clone https://github.com/priyasogani8-star/whatsapp-mcp-automation.git
cd whatsapp-mcp-automation
npm install
npm run build
```

### Step 3: Configure Your AI Agent

---

#### Claude Code (Claude Code CLI)

Edit `~/.claude/settings.json` (or local `.claude/settings.json`):

```json
{
  "mcpServers": {
    "whatsapp-automation": {
      "command": "node",
      "args": ["/full/path/to/whatsapp-mcp-automation/dist/server.js"],
      "env": {
        "WHATSAPP_DATA_DIR": "~/.whatsapp-mcp"
      }
    }
  }
}
```

Then restart Claude Code. Ask: *"Create a poll: Where should we eat? Options: Pizza, Sushi, Burger"*

---

#### Claude Desktop

Edit `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "whatsapp-automation": {
      "command": "node",
      "args": ["/full/path/to/whatsapp-mcp-automation/dist/server.js"],
      "env": {
        "WHATSAPP_DATA_DIR": "~/.whatsapp-mcp"
      }
    }
  }
}
```

Restart Claude Desktop. The 18 tools will appear in your tools panel.

---

#### Cursor IDE

1. Press `Ctrl+Shift+P` → `Preferences: Open Settings (JSON)`
2. Add:

```json
{
  "cursor.mcp.servers": {
    "whatsapp-automation": {
      "command": "node",
      "args": ["/full/path/to/whatsapp-mcp-automation/dist/server.js"]
    }
  }
}
```

3. Restart Cursor. Type `@whatsapp-automation create a poll...`

---

#### Windsurf (Codeium)

Open Settings → MCP Servers → Add Server:

```json
{
  "name": "whatsapp-automation",
  "command": "node",
  "args": ["/full/path/to/whatsapp-mcp-automation/dist/server.js"]
}
```

Multiple agents can run polls in parallel using Windsurf's multi-agent mode.

---

## 18 MCP Tools Reference

| Tool | What it does |
|------|-------------|
| `create_poll` | Create single or multiple-choice poll |
| `vote_poll` | Cast a vote |
| `change_vote` | Change an existing vote |
| `get_poll_results` | Get vote counts and percentages |
| `list_polls` | List active polls |
| `close_poll` | Close poll to new votes |
| `add_reaction` | Add animated reaction to message |
| `get_message_reactions` | See all reactions on a message |
| `send_sticker` | Send sticker to chat |
| `get_sticker_packs` | List available packs |
| `create_status` | Post status update |
| `create_event` | Create group event |
| `rsvp_event` | Respond to event invite |
| `get_event_stats` | Get attendance stats |
| `share_location` | Start live location sharing |
| `stop_location_share` | Stop sharing location |
| `send_mention` | Send @all, @role, or @specific mention |
| `create_group_role` | Create named role for targeting |

---

## Running Tests

```bash
npm test
```

Expected output:
```
PASS  tests/testRunner.ts (polls — 23 tests)
PASS  tests/allFeatures.test.ts (all features — 18 tests)
Tests: 41 passed
```

---

## Project Structure

```
whatsapp-mcp-automation/
├── src/
│   ├── server.ts              ← MCP server entry point
│   ├── index.ts               ← Library exports
│   ├── handlers/              ← 7 feature handlers
│   ├── types/                 ← TypeScript types
│   ├── validators/            ← Input validation + XSS protection
│   └── storage/               ← SQLite database layer
├── tests/
│   ├── testRunner.ts          ← Poll voting tests (23 tests)
│   └── allFeatures.test.ts    ← All 7 features tests
├── docs/                      ← Guides for each feature
├── examples/                  ← Example JSON for each tool
├── package.json
├── tsconfig.json
└── jest.config.js
```

---

## Security

- All inputs sanitized (XSS prevention)
- Parameterized SQL queries (no injection)
- No hardcoded credentials
- Local SQLite storage — data never leaves your machine
- MIT License — free to use and modify

---

## What's NOT included (honest limitations)

- **No WhatsApp connection layer** — this repo handles logic only; actual WhatsApp messaging requires `lharries/whatsapp-mcp` (Go + whatsmeow)
- **Video call effects** — framework only, no live call integration
- **Voice/video notes** — framework only, no audio processing

---

## Credits

- Extends [lharries/whatsapp-mcp](https://github.com/lharries/whatsapp-mcp) for the WhatsApp connection layer
- Built for Claude Code, Claude Desktop, Cursor, and Windsurf
