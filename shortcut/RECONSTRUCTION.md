# Shortcut SSE Stream Reconstruction

## Reconstructed Messages

| Role  | Content                                                                                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Human | "yoo whats up"                                                                                                                                         |
| AI    | "Hey! Not much — just here ready to help with your spreadsheet. Looks like you've got a blank workbook open. What would you like to build or work on?" |

---

## Stack

| Component          | Technology                                                 |
| ------------------ | ---------------------------------------------------------- |
| Agent Framework    | LangGraph 1.0.7 (self-hosted, API v0.7.10)                 |
| LLM                | Claude Opus 4.5 (`claude-opus-4-5-20251101`) via Anthropic |
| Spreadsheet Engine | SpreadJS                                                   |
| Architecture       | State-machine agent with modes: `action`, `ask`, `plan`    |

---

## Toolset

```json
[
  "get_tool_info",
  "execute_tool",
  "execute_code",
  "bash_command",
  "todo_list",
  "prepare_read_session",
  "task",
  "switch_mode"
]
```

### Tool Descriptions

| Tool                   | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `get_tool_info`        | Fetch API docs for SpreadJS functions     |
| `execute_tool`         | Execute spreadsheet commands              |
| `execute_code`         | Run JS/TS code against workbook           |
| `switch_mode`          | Transition between action/ask/plan modes  |
| `todo_list`            | Manage persistent task list               |
| `task`                 | Launch sub-agents or multi-step processes |
| `bash_command`         | Execute terminal commands                 |
| `prepare_read_session` | Optimize context for reading large ranges |

---

## System Instructions (Partial)

No monolithic "system prompt" was found. Instead, instructions are modular and injected via LangGraph config. The following fragments were extracted:

### Skills & Memory Protocol

```markdown
# Skills

You have access to specialized skills that provide additional capabilities.
You must read a skill that is relevant to the task at hand, especially if the skill is user-created.

- Skills require a `SKILL.md` file with YAML frontmatter containing `name` and `description` fields.
- To use a skill, read its `SKILL.md` file for detailed instructions.
- Create custom skills in `/skills/user/`. Copy and edit the template: `/skills/default/_template/SKILL.md`
- Team skills are available at `/skills/team/{team_name}/` (read-only)
- When user selects a skill (for example, [Skill:X selected] in a message), you MUST read the skill's SKILL.md file BEFORE doing anything else

## Built-in Skills

- **sec-edgar** (`/skills/default/sec-edgar/SKILL.md`): Research and download SEC EDGAR filings (10-K, 10-Q, 8-K, etc.) for US public companies.
- **spreadjs-advanced-api** (`/skills/default/spreadjs-advanced-api/SKILL.md`): Access advanced SpreadJS functionality not covered by the standard API. Use when you need low-level spreadsheet operations like sparklines, slicers, cell buttons, advanced conditional formatting, outline groups, or any SpreadJS-specific features.
- **integrations** (`/skills/default/integrations/SKILL.md`): Use when user requests data from financial data providers (Bloomberg, FactSet, Capital IQ, Refinitiv, Morningstar, PitchBook, Preqin, AlphaSense). Each provider has specific Excel formula syntax.

## Memory

Store user facts and preferences in `/skills/user/user-memories/SKILL.md`.

**Save when:** User corrects you, shares stable facts, states preferences, or asks to remember.
**Don't save:** Task-specific context or temporary data.

**Steps:**

1. When you detect something worth remembering, ask the user if they would like you to remember it.
2. If file doesn't exist: `cp -r /skills/default/_user-memories /skills/user/user-memories`
3. Read file, check for duplicates (update if similar exists)
4. Add memory with ID `[mem_YYMMDD]` (e.g., `[mem_250109]` for Jan 9, 2025)
5. Update count in header. Update description to summarize all memories (max 1024 chars).

If a user is satisfied with the result of a task or a workflow, ask the user at the end of the task:

- Whether they would like to save it as a reusable skill
- How general the skill should be (ranging from exact use case to general template)
```

### Spreadsheet Domain Rules (from API Spec)

Key constraints embedded in the API documentation:

- **No Guessing:** "NEVER guess the API... Read and console.log the documentation in FULL without any truncations."
- **Native Features First:** "Always prefer spreadsheet features (pivot tables, tables, conditional formats) over hardcoding values and styles for dynamic updates."
- **Sheet Limits:** "SpreadJS initializes sheets with 50K rows and 200 columns. Writing to cells beyond these limits will SILENTLY FAIL unless you expand first."

### Styling Spec

Fonts must use points (`pt`), not pixels:

- `10pt` (small), `11pt` (default), `12pt` (standard), `14pt` (headers)
- Format: `"[bold] [italic] <size>pt <family>"` e.g. `"bold 14pt Arial"`

---

## Metadata from Stream

```json
{
  "run_id": "019c0a97-f339-7773-a65c-82cd2ad91686",
  "user_id": "aksHHu1r7Od9nz5lDf6VRIHQbSBODNyU",
  "thread_id": "f9f08d1a-41c2-4a02-9606-68b9a188efa8",
  "workspace_id": "d7af99fe-923d-4b5b-be72-31d69b949121",
  "assistant_id": "fe096781-5601-53d2-b2f6-0d3403f7e9ca",
  "agent_mode": "action",
  "platform": "web",
  "langgraph_plan": "developer",
  "langgraph_host": "self-hosted"
}
```

---

## Files

- `stream.txt` - Raw SSE trace
- `api_spec.json` - Full extracted API specification
- `parse_stream.py` - Parser script used for extraction
