# 🎉 Event Planner Guide

Create and manage group events with RSVP tracking.

## RSVP Options
- `accepted` ✅
- `declined` ❌
- `maybe` 🤷
- `pending` ⏳ (default)

## How to Use

### Create Event
```json
{
  "title": "Team Lunch",
  "description": "Monthly team lunch at Pizza Place",
  "startTime": "2026-03-25T12:00:00.000Z",
  "endTime": "2026-03-25T14:00:00.000Z",
  "location": "Pizza Place, Main Street",
  "creator": "user_1",
  "chatJid": "group_jid@g.us",
  "invitees": ["user_2", "user_3", "user_4"],
  "remindBefore": 60
}
```

### Respond to Invite
```json
{
  "eventId": "evt_xyz",
  "userId": "user_2",
  "rsvpStatus": "accepted",
  "notes": "I'll be there!"
}
```

### Get Event Stats
Returns: total invites, accepted/declined/maybe/pending counts, response rate %.

### Cancel Event
```json
{ "eventId": "evt_xyz" }
```

## Notes
- Reminders are set in minutes before event
- Status flow: draft → scheduled → active → completed/cancelled
- Response rate is calculated automatically
