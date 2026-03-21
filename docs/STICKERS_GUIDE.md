# 🎨 Sticker Manager Guide

Send fun stickers and manage sticker packs in WhatsApp.

## Available Packs

### 🎉 2026 New Year Pack (Pre-installed)
- Confetti Pop 🎉
- Fireworks 🎆
- Party Sparkles ✨

## How to Use

### Send a Sticker
```json
{
  "chatJid": "1234567890@s.whatsapp.net",
  "stickerId": "<sticker_id>",
  "packId": "<pack_id>"
}
```

### Create Custom Pack
```json
{
  "userId": "user_1",
  "name": "My Custom Pack",
  "stickers": [
    { "id": "s1", "name": "Happy", "emoji": "😊" },
    { "id": "s2", "name": "Cool", "emoji": "😎" }
  ]
}
```

### Add to Favorites
```json
{
  "userId": "user_1",
  "stickerId": "<sticker_id>"
}
```

## Tips
- Usage stats are automatically tracked
- Each sticker has a popularity rank
- Recently used stickers are cached per user
