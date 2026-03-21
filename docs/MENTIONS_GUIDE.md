# 📢 Group Mentions Guide

Send targeted notifications in WhatsApp groups.

## Mention Types
- `all`:Mentions everyone in the group
- `role`:Mentions users assigned to a role
- `specific`:Mentions specific user IDs
- `admin`:Mentions group admins only

## Notification Levels
- `silent`:No sound
- `normal`:Default notification
- `high`:Priority notification

## How to Use

### Create Group Role
```json
{
  "chatJid": "group_jid@g.us",
  "roleName": "Team Leads",
  "userIds": ["user_1", "user_2", "user_3"]
}
```

### Send @all Mention
```json
{
  "chatJid": "group_jid@g.us",
  "userId": "sender_1",
  "message": "Important: Meeting at 3 PM today!",
  "mentionType": "all",
  "notificationLevel": "high"
}
```

### Send Role Mention
```json
{
  "chatJid": "group_jid@g.us",
  "userId": "sender_1",
  "message": "Team leads, please review the report.",
  "mentionType": "role",
  "targetRole": "Team Leads"
}
```

### Send Specific Mention
```json
{
  "chatJid": "group_jid@g.us",
  "userId": "sender_1",
  "message": "Hey @user_2 and @user_3, can you join the call?",
  "mentionType": "specific",
  "targetUsers": ["user_2", "user_3"]
}
```

## Notes
- Mention stats are tracked per chat
- Notifications track sent/delivered/read status
- Use high notification level for urgent messages
