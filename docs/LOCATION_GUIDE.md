# 📍 Live Location Tracker Guide

Share and track live locations in WhatsApp chats.

## Duration Limits
- Minimum: 5 minutes
- Maximum: 60 minutes

## How to Use

### Share Location
```json
{
  "userId": "user_1",
  "chatJid": "group_jid@g.us",
  "coordinates": {
    "latitude": 28.5355,
    "longitude": 77.3910,
    "accuracy": 10
  },
  "duration": 30,
  "address": "Noida Sector 62"
}
```

### Update Live Location
```json
{
  "locationId": "share_xyz",
  "coordinates": {
    "latitude": 28.5400,
    "longitude": 77.3950,
    "accuracy": 8
  }
}
```

### Stop Sharing
```json
{ "shareId": "share_xyz" }
```

### Get Location History
Returns full movement history with timestamps.

## Notes
- Location updates are stored in history automatically
- Viewers list tracks who is watching
- Stop sharing manually or it expires after set duration
