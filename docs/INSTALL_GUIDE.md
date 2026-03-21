# 📦 Installation Guide

## For Different Users

---

## 👨‍💼 Non-Technical Users

### Don't install anything yourself!

1. **Tell your developer:** "I need the WhatsApp poll voting tool"
2. **They will install it** using the Developer Guide below
3. **You just use it** - ask Claude: "Create a poll about..."

---

## 👨‍💻 Developers - Installation

### Step 1: Download the Files

```bash
git clone https://github.com/priyasogani8-star/whatsapp-mcp-automation.git
cd whatsapp-mcp-automation
```

### Step 2: Install Requirements

```bash
npm install
```

This installs all the tools needed (takes 2-3 minutes).

### Step 3: Test Everything

```bash
npm test
```

You should see:
```
✅ All tests passed (23/23)
```

If you see this, everything works!

### Step 4: Build

```bash
npm run build
```

This prepares the tool to be used.

---

## 🤖 For Claude Desktop Users

### Step 1: Install Claude Desktop
Download from: https://claude.ai/download

### Step 2: Configure MCP Server

Edit file: `~/.claude/claude_desktop_config.json`

Add this:
```json
{
  "mcpServers": {
    "whatsapp-polls": {
      "command": "node",
      "args": ["path/to/whatsapp-mcp-automation/combined-server.js"],
      "env": {
        "WHATSAPP_DATA_DIR": "~/.whatsapp-mcp",
        "DATABASE_URL": "sqlite:~/.whatsapp-mcp/polls.db"
      }
    }
  }
}
```

### Step 3: Restart Claude Desktop

Close and open Claude Desktop again.

### Step 4: Use It!

Type: "Create a single-choice poll asking people's favorite fruit"

Claude will do everything automatically!

---

## 🧑‍💻 For Cursor IDE Users

### Step 1: Install Cursor
Download from: https://cursor.sh

### Step 2: Open Settings
Press: `Cmd/Ctrl + Shift + P`
Type: `Preferences: Open Settings`

### Step 3: Find MCP Servers Section
Search for: `MCP Servers`

### Step 4: Add New Server
Click "Add Server"

Fill in:
- **Name:** whatsapp-polls
- **Command:** node
- **Args:** ["path/to/whatsapp-mcp-automation/combined-server.js"]

### Step 5: Restart Cursor
Close and reopen Cursor

### Step 6: Use in Chat
Type: "@whatsapp-polls create a poll..."

---

## 🌪️ For Windsurf Users

### Step 1: Install Windsurf
Download from: https://codeium.com/windsurf

### Step 2: Settings
Open: Settings → MCP Servers

### Step 3: Add Server
Same as Cursor (see above)

### Step 4: Use It!
You can now run polls in parallel using multiple agents!

---

## 🐳 For Docker Users

### Step 1: Build Docker Image
```bash
docker build -t whatsapp-polls .
```

### Step 2: Run Container
```bash
docker run -d \
  -v ~/.whatsapp-mcp:/data \
  -e WHATSAPP_DATA_DIR=/data \
  --name whatsapp-polls \
  whatsapp-polls
```

### Step 3: Configure in Claude/Cursor
Use the command: `docker exec whatsapp-polls node dist/index.js`

---

## 🔧 Troubleshooting

### Problem: "Module not found"
**Solution:**
```bash
rm -rf node_modules
npm install
```

### Problem: "npm command not found"
**Solution:** Install Node.js from https://nodejs.org

### Problem: Tests fail
**Solution:**
```bash
npm test -- --verbose
```
This shows what's failing.

### Problem: Can't find configuration file
**Solution:**
```bash
# For Claude:
mkdir -p ~/.claude
nano ~/.claude/claude_desktop_config.json

# For Cursor:
Press Cmd/Ctrl + Shift + P
Type: "Preferences: Open Settings JSON"
```

---

## ✅ Verification

After installation, test with:

```bash
# Run all tests
npm test

# Expected output:
# ✅ PASS  tests/testRunner.ts
# Tests: 23 passed, 23 total
```

If you see ✅ PASS, you're good to go!

---

## 📞 Need Help?

1. Check TROUBLESHOOTING section above
2. Read the error message carefully
3. Search on Google for the error
4. Contact your developer

---

**Installation complete!** 🎉