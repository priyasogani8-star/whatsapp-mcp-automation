# 📸 Status Tools Guide

Create animated WhatsApp status updates with effects and scheduling.

## Status Types
- `text`:Text-only status
- `image`:Image with optional caption
- `video`:Video status
- `gif`:Animated GIF
- `animated`:Text with animation effects

## Visibility Options
- `public`:Everyone
- `contacts`:Only contacts
- `private`:Hidden

## How to Use

### Create Status
```json
{
  "userId": "user_1",
  "type": "image",
  "content": "https://example.com/photo.jpg",
  "caption": "Beautiful sunset! 🌅",
  "visibility": "contacts",
  "effects": ["vintage-filter"],
  "stickers": ["star-sticker-id"]
}
```

### Schedule Status
```json
{
  "userId": "user_1",
  "type": "text",
  "content": "Good morning! ☀️",
  "visibility": "contacts",
  "scheduleTime": "2026-03-22T08:00:00.000Z"
}
```

### Track Views
Returns: total views, viewer list, reactions, share count, save count.

## Notes
- Status expires automatically after 24 hours
- Reactions are tracked per emoji
- Schedule posts for optimal engagement times
