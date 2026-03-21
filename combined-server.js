#!/usr/bin/env node
/**
 * WhatsApp Combined MCP Server
 *
 * Runs both MCP servers together:
 *   - lharries/whatsapp-mcp-server  (read/send messages, contacts, media)
 *   - whatsapp-mcp-automation        (polls, reactions, stickers, events, location, mentions)
 *
 * Usage: node combined-server.js
 *
 * Optional env vars (defaults shown):
 *   WHATSAPP_MCP_SERVER_DIR  - path to the whatsapp-mcp-server Python folder
 *                              default: ./whatsapp-mcp-server  (sibling folder in this repo)
 *   WHATSAPP_DATA_DIR        - where WhatsApp data is stored
 *                              default: ~/.whatsapp-mcp
 *   AUTOMATION_SERVER_PATH   - path to the compiled automation server
 *                              default: ./dist/server.js
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const MCP_SERVER_DIR = process.env.WHATSAPP_MCP_SERVER_DIR ||
  path.join(__dirname, 'whatsapp-mcp-server');

const AUTOMATION_SERVER = process.env.AUTOMATION_SERVER_PATH ||
  path.join(__dirname, 'dist', 'server.js');

const WHATSAPP_DATA_DIR = process.env.WHATSAPP_DATA_DIR ||
  path.join(os.homedir(), '.whatsapp-mcp');

const SERVER_CONFIGS = [
  {
    name: 'lharries',
    cmd: 'uv',
    args: ['run', '--directory', MCP_SERVER_DIR, 'python', 'main.py'],
    env: {}
  },
  {
    name: 'automation',
    cmd: 'node',
    args: [AUTOMATION_SERVER],
    env: { WHATSAPP_DATA_DIR }
  }
];

class MCPMultiplexer {
  constructor() {
    this.servers = [];
    this.toolMap = new Map();
  }

  async start() {
    this.servers = SERVER_CONFIGS.map(cfg => this.spawnServer(cfg));
    await Promise.all(this.servers.map(s => s.initPromise));
    this.pipeStdin();
  }

  spawnServer(cfg) {
    const proc = spawn(cfg.cmd, cfg.args, {
      env: { ...process.env, ...cfg.env },
      stdio: ['pipe', 'pipe', 'inherit']
    });

    const server = {
      name: cfg.name,
      proc,
      tools: [],
      idCounter: 0,
      pending: new Map(),
      lineBuffer: ''
    };

    proc.stdout.on('data', chunk => {
      server.lineBuffer += chunk.toString();
      const lines = server.lineBuffer.split('\n');
      server.lineBuffer = lines.pop();
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        let msg;
        try { msg = JSON.parse(trimmed); } catch { continue; }
        if (msg.id == null) continue;
        const cb = server.pending.get(msg.id);
        if (cb) { server.pending.delete(msg.id); cb.resolve(msg); }
      }
    });

    proc.on('error', err => process.stderr.write(`[${cfg.name}] error: ${err.message}\n`));
    proc.on('exit', code => process.stderr.write(`[${cfg.name}] exited (code ${code})\n`));

    server.initPromise = this.initServer(server);
    return server;
  }

  rpcSend(server, method, params) {
    return new Promise((resolve, reject) => {
      const id = ++server.idCounter;
      server.pending.set(id, { resolve, reject });
      server.proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  }

  notify(server, method, params) {
    server.proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
  }

  async initServer(server) {
    await this.rpcSend(server, 'initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'whatsapp-combined', version: '1.0.0' }
    });
    this.notify(server, 'notifications/initialized', {});
    const resp = await this.rpcSend(server, 'tools/list', {});
    if (resp.result && resp.result.tools) {
      server.tools = resp.result.tools;
      for (const tool of server.tools) this.toolMap.set(tool.name, server);
      process.stderr.write(`[${server.name}] ${server.tools.length} tools ready\n`);
    }
  }

  pipeStdin() {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => {
      buf += chunk;
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        const t = line.trim();
        if (t) this.handleMsg(t);
      }
    });
    process.stdin.on('end', () => process.exit(0));
  }

  respond(id, result) {
    process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
  }

  respondError(id, code, message) {
    process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n');
  }

  async handleMsg(line) {
    let msg;
    try { msg = JSON.parse(line); } catch { return; }
    const { id, method, params } = msg;

    if (method === 'initialize') {
      this.respond(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'whatsapp-combined', version: '1.1.0' }
      });
    } else if (method === 'notifications/initialized') {
      // no-op
    } else if (method === 'tools/list') {
      this.respond(id, { tools: this.servers.flatMap(s => s.tools) });
    } else if (method === 'tools/call') {
      const server = this.toolMap.get(params && params.name);
      if (!server) { this.respondError(id, -32601, `Unknown tool: ${params && params.name}`); return; }
      const resp = await this.rpcSend(server, 'tools/call', params);
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0', id,
        ...(resp.result ? { result: resp.result } : { error: resp.error })
      }) + '\n');
    } else {
      this.respondError(id, -32601, `Method not supported: ${method}`);
    }
  }
}

new MCPMultiplexer().start().catch(err => {
  process.stderr.write(`Fatal: ${err.message}\n`);
  process.exit(1);
});
