# User Message Format

Each user message contains multiple text content blocks:

## 1. User Prompt

The actual user input text.

## 2. User Context (always present)

```xml
<user_context>
Current active sheet ID: {sheetId}
Selected ranges: {SheetName}!{range}
</user_context>
```

## 3. Initial State (first message only)

```xml
<initial_state>
{
  "success": true,
  "fileName": "Book1",
  "sheetsMetadata": [
    {
      "id": 1,
      "name": "Sheet1",
      "maxRows": 0,
      "maxColumns": 0,
      "frozenRows": 0,
      "frozenColumns": 0
    }
  ],
  "totalSheets": 1
}
</initial_state>
```

## Example Structure

```json
{
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": "what is the point of the 3 RPC calls..."
    },
    {
      "type": "text",
      "text": "<user_context>\nCurrent active sheet ID: 1\nSelected ranges: Sheet1!I15\n</user_context>"
    },
    {
      "type": "text",
      "text": "<initial_state>\n{...}\n</initial_state>"
    }
  ]
}
```

## Notes

- `<initial_state>` only appears on the first user message in a conversation
- `<user_context>` is appended to every user message
- Tool results come as separate user messages with `type: "tool_result"`
