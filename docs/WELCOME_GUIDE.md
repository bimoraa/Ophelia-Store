# Welcome System Guide

## Setup Welcome Messages

### 1. Configure Welcome Channel

```bash
/welcome setup channel:#welcome
```

This will set the channel where welcome messages will be sent when new members join.

### 2. Enable/Disable Welcome

```bash
/welcome enable   # Enable welcome messages
/welcome disable  # Disable welcome messages
```

### 3. Set Custom Message

```bash
/welcome message text:## Welcome!\n{user}, you've just joined {server}.\nWe're glad to have you here.
```

**Available placeholders:**
- `{user}` - Mentions the new member
- `{username}` - Username of the new member
- `{server}` - Server name

### 4. Test Welcome Message

```bash
/welcome test
```

Sends a test welcome message to the configured channel with your account.

### 5. View Settings

```bash
/welcome info
```

Shows current welcome configuration.

## Component v2 Format

The welcome message uses Discord Component v2 format:

```json
{
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 9,
          "components": [
            {
              "type": 10,
              "content": "## Welcome!\n<@user_id>, you've just joined Server Name.\nWe're glad to have you here."
            }
          ],
          "accessory": {
            "type": 11,
            "media": {
              "url": "user_avatar_url"
            }
          }
        }
      ]
    }
  ]
}
```

**Component Types:**
- Type 17: Container
- Type 9: Section
- Type 10: Text (Markdown supported)
- Type 11: Media/Image accessory

## Database

Welcome settings are stored in MongoDB:
- `guild_id` - Server ID
- `channel_id` - Welcome channel ID
- `enabled` - Enable/disable status
- `custom_message` - Custom welcome message (optional)

## Event Handler

The bot listens to `GuildMemberAdd` event and automatically sends welcome messages when:
1. Welcome is enabled for the server
2. Welcome channel is configured
3. New member joins the server
