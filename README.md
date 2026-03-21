# 🗳️ WhatsApp Poll Voting Tool

**Think of this tool like creating a poll on Instagram or Facebook, but for WhatsApp!**

---

## 📱 What is This?

This tool lets you create **polls** (questions where people vote) on WhatsApp. You can use it with AI assistants like Claude to automatically run polls in your WhatsApp groups.

### Two Types of Polls:

1. **Single-Choice Polls** - "Pick ONE thing"
   - Like: "Which restaurant?" → User picks ONE
   - User can change their mind anytime

2. **Multiple-Choice Polls** - "Pick MULTIPLE things"
   - Like: "What properties interest you?" → User picks 1, 2, 3, or more
   - User can add or remove selections anytime

---

## 🎯 Real-World Examples

### Single-Choice Example:
```
Question: "Where should we have lunch?"

Options:
- Pizza Place
- Sushi Bar
- Burger King

User picks: "Sushi Bar"

Later, user changes mind to: "Pizza Place"
(Their "Sushi Bar" vote is removed, "Pizza Place" is added)
```

### Multiple-Choice Example:
```
Question: "What properties interest you?"

Options:
- 1 BHK
- 2 BHK  
- 3 BHK
- 4 BHK
- Villa

User can pick: "1 BHK", "2 BHK", AND "3 BHK" (all three!)

Later, user wants to add: "Villa" to their choices
(They now have: "1 BHK", "2 BHK", "3 BHK", "Villa")
```

---

## ✨ Key Features

✅ **Easy to Use** - Simple questions and answers
✅ **Vote Changes Allowed** - Users can change their mind
✅ **Live Results** - See how many people picked each option
✅ **Safe** - No one can hack or cheat the votes
✅ **Fast** - Works with WhatsApp instantly
✅ **Works with AI** - Use with Claude, Cursor, Windsurf

---

## 🚀 How to Use

### Step 1: Create a Poll
```
Tool: create_poll

Input:
- Question: "What's your favorite color?"
- Type: "single" (pick ONE) or "multiple" (pick multiple)
- Choices: ["Red", "Blue", "Green"]
```

### Step 2: People Vote
```
Tool: vote_poll

Input:
- Poll ID: (ID from Step 1)
- User ID: unique_user_123
- Choices: ["Red"] for single, ["Red", "Blue"] for multiple
```

### Step 3: See Results
```
Tool: get_poll_results

Output:
- Red: 3 votes (60%)
- Blue: 2 votes (40%)
- Green: 0 votes (0%)
```

### Step 4: Change Vote (Optional)
```
Tool: change_vote

Input:
- Poll ID: (ID from Step 1)
- User ID: unique_user_123
- New Choices: ["Blue"] for single, ["Blue", "Green"] for multiple
```

---

## 📊 Poll Types Explained

### Single-Choice (Pick 1 Only)
```
User's Journey:
1. Votes for: Pizza
2. Changes to: Sushi
   Result: Pizza vote is DELETED, Sushi vote is ADDED

Final Results:
- Pizza: 0 votes ❌
- Sushi: 1 vote ✅
- Burger: 0 votes ❌
```

### Multiple-Choice (Pick Multiple)
```
User's Journey:
1. Votes for: [1BHK, 2BHK]
2. Adds: 3BHK
   Result: [1BHK, 2BHK, 3BHK]
3. Removes: 1BHK
   Result: [2BHK, 3BHK]

Final Results:
- 1BHK: 0 votes (not selected anymore)
- 2BHK: 1 vote ✅
- 3BHK: 1 vote ✅
- 4BHK: 0 votes ❌
- Villa: 0 votes ❌
```

---

## ⚙️ How It Works Behind The Scenes

**Don't worry if you don't understand this part - it just works!**

1. **Database** - All votes are saved safely in a database
2. **Validation** - The system checks:
   - Did the user pick the right number of options?
   - Is this a real choice?
   - Did they follow the poll rules?
3. **Vote History** - We remember every vote change
4. **Results** - We count votes and show percentages

---

## 🔒 Is It Safe?

**YES!** Here's why:

✅ All data is **encrypted** (scrambled so no one can read it)
✅ **Input validation** - We check everything before accepting it
✅ **No hacking possible** - The system rejects bad votes
✅ **Vote accuracy** - Each user = 1 vote per poll
✅ **Local storage** - Your data stays on YOUR server

---

## 🎨 Visual Examples

### Single-Choice Poll Flow
![Single-Choice Flow](./docs/images/single-choice-flow.svg)

### Multiple-Choice Poll Flow
![Multiple-Choice Flow](./docs/images/multiple-choice-flow.svg)

---

## 🤖 Using with AI Assistants

### Claude Desktop
```
1. Download Claude Desktop
2. Add this tool to your config
3. Ask Claude: "Create a poll asking people's favorite color"
4. Claude will handle everything automatically!
```

### Cursor IDE
```
1. Open Cursor
2. Add this MCP server to settings
3. Type: "@polls create a poll for team preferences"
4. Done!
```

### Windsurf
```
1. Install Windsurf
2. Configure MCP server
3. Multiple agents can run polls simultaneously
```

---

## 📋 Installation Steps

### For Developers:
```bash
# 1. Clone the repository
git clone https://github.com/priyasogani8-star/whatsapp-mcp-poll-voting-tool
cd whatsapp-mcp-poll-voting-tool

# 2. Install dependencies
npm install

# 3. Run tests (to make sure everything works)
npm test

# 4. Build the project
npm run build

# 5. Start using it!
npm start
```

### For Non-Developers:
Just ask your developer to install it for you! They'll take care of everything.

---

## 🐛 Troubleshooting

### "User already voted"
- This means the user already voted on this poll
- They can use `change_vote` to modify their vote

### "Must select at least X options"
- For multiple-choice polls, there's a minimum number of options
- You need to select more options

### "Cannot select more than X options"  
- For multiple-choice polls, there's a maximum limit
- You're trying to pick too many options

### "Invalid choice"
- You picked an option that doesn't exist in this poll
- Check the choices again

---

## 💡 Tips & Tricks

1. **Close a Poll** - Once you're done, close it so no one can vote anymore
2. **See Vote Changes** - You can see the history of who changed their vote
3. **Anonymous Voting** - Votes are tracked by user ID, not shown publicly
4. **Expiry Dates** - Set an expiry date so old polls close automatically

---

## 📞 Questions?

If something doesn't work, check:
1. Are you using the right poll type (single vs multiple)?
2. Did you follow the rules (min/max selections)?
3. Did you pick valid choices?

Still stuck? Contact the developer!

---

## 📄 License

MIT License - Use freely, modify as needed

---

## 🙏 Credits

Built for WhatsApp MCP integration with Claude, Cursor, and Windsurf

**Made with ❤️ for easy polling on WhatsApp**