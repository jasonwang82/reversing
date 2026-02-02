# Claude for Excel - Architecture Deep Dive

This document reverse-engineers how Anthropic's **Claude for Excel** add-in works, focusing on the RPC mechanism that allows Claude to read/write Excel spreadsheets from a cloud-based Python container.

## Overview

Claude for Excel is a Microsoft Office add-in that integrates Claude AI directly into Excel. The key innovation is a **secure RPC bridge** that allows Claude's code execution environment (running in the cloud) to interact with the user's local Excel instance without giving the sandbox direct access.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER'S MACHINE                                   │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    Excel Application                               │ │
│  │  ┌──────────────────┐    ┌───────────────────────────────────────┐ │ │
│  │  │   Spreadsheet    │◄──►│       Task Pane (WebView)             │ │ │
│  │  │   (user data)    │    │  ┌─────────────────────────────────┐  │ │ │
│  │  │                  │    │  │    OfficeJS Add-in (JS/HTML)    │  │ │ │
│  │  └──────────────────┘    │  │    - Excel.run() API access     │  │ │ │
│  │          ▲               │  │    - Chat UI                    │  │ │ │
│  │          │               │  └──────────────┬──────────────────┘  │ │ │
│  │    OfficeJS API          │                 │                     │ │ │
│  │    (in-process)          └─────────────────┼─────────────────────┘ │ │
│  └────────────────────────────────────────────┼───────────────────────┘ │
│                                               │ WebSocket/HTTPS         │
└───────────────────────────────────────────────┼─────────────────────────┘
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    │       ANTHROPIC INFRASTRUCTURE                        │
                    │                           │                           │
                    │                           ▼                           │
                    │  ┌─────────────────────────────────────────────────┐  │
                    │  │               Orchestrator                      │  │
                    │  │  - Receives messages + spreadsheet context      │  │
                    │  │  - Calls Claude API                             │  │
                    │  │  - Manages code execution containers            │  │
                    │  │  - Validates & proxies tool calls               │  │
                    │  │  - Watches for .request files from sandbox      │  │
                    │  │  - Routes Excel operations back to client       │  │
                    │  └────────────────────┬────────────────────────────┘  │
                    │                       │                               │
                    │                       ▼                               │
                    │  ┌─────────────────────────────────────────────────┐  │
                    │  │        gVisor Sandbox (Debian 12 Container)     │  │
                    │  │  - Python 3.11 + pandas, numpy, etc.            │  │
                    │  │  - NO direct network access                     │  │
                    │  │  - NO direct Excel API access                   │  │
                    │  │  - File-based IPC only (.request/.response)     │  │
                    │  │  - 4 CPU cores, 10GB RAM                        │  │
                    │  │  - 5 minute container lifetime                  │  │
                    │  └─────────────────────────────────────────────────┘  │
                    └───────────────────────────────────────────────────────┘
```

## System Prompt Highlights

The system prompt (`system_prompt.md`) establishes Claude as an AI assistant integrated into Excel with:

### Core Behavior

- **Elicitation & Planning**: Ask clarifying questions for complex tasks (DCF models, budgets, financial analysis)
- **Checkpoints**: Pause at milestones for user confirmation on long tasks
- **Read vs Write**: Use READ tools freely for analysis; only use WRITE tools when explicitly asked to modify

### Web Search Guidelines

- **URL Handling**: If user provides a URL, fetch only from that URL; if it fails (403, timeout), tell the user rather than falling back to web search
- **Financial Data**: ONLY use official sources (SEC EDGAR, company IR pages, official press releases). NEVER use third-party sites (Seeking Alpha, Yahoo Finance, etc.) without explicit user confirmation
- **Citations**: Every web-sourced cell MUST have a source comment at write time

### Financial Formatting Standards

| Element              | Format                        |
| -------------------- | ----------------------------- |
| Blue text (#0000FF)  | Hardcoded inputs/assumptions  |
| Black text (#000000) | ALL formulas and calculations |
| Green text (#008000) | Links to other worksheets     |
| Negative numbers     | Parentheses: (123) not -123   |
| Currency             | $#,##0 with units in headers  |
| Percentages          | 0.0% format                   |

### Large Dataset Handling

- **>1000 rows**: MUST process in code execution container
- Read in chunks using `get_range_as_csv` (500 rows default)
- Use `asyncio.gather()` for parallel fetching
- Never print raw large data to stdout

## Tools Available

### READ Tools (can use freely)

| Tool                  | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `get_sheets_metadata` | Get workbook structure info                           |
| `get_cell_ranges`     | Get detailed cell info (values, formulas, formatting) |
| `get_range_as_csv`    | Get data as CSV string (preferred for pandas)         |
| `search_data`         | Search for text across spreadsheet                    |
| `get_all_objects`     | Get pivot tables, charts, tables                      |

### WRITE Tools (require user intent)

| Tool                        | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `set_cell_range`            | Write values, formulas, formatting. Has overwrite protection |
| `modify_sheet_structure`    | Insert/delete/hide/freeze rows/columns                       |
| `modify_workbook_structure` | Create/delete/rename/duplicate sheets                        |
| `modify_object`             | Create/update/delete pivot tables and charts                 |
| `clear_cell_range`          | Clear content and/or formatting                              |
| `resize_range`              | Resize columns/rows                                          |
| `copy_to`                   | Copy ranges with formula translation                         |

### Server Tools

| Tool             | Description                            |
| ---------------- | -------------------------------------- |
| `code_execution` | Run Python code in sandboxed container |
| `web_search`     | Search the web                         |

## User Message Format

Each user message contains multiple content blocks:

```json
{
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": "The actual user question or request"
    },
    {
      "type": "text",
      "text": "<user_context>\nCurrent active sheet ID: 1\nSelected ranges: Sheet1!A1:B10\n</user_context>"
    },
    {
      "type": "text", // ONLY on first message
      "text": "<initial_state>\n{\"success\":true,\"fileName\":\"Book1\",\"sheetsMetadata\":[...],\"totalSheets\":1}\n</initial_state>"
    }
  ]
}
```

### Context Injection

- **`<user_context>`**: Appended to EVERY user message with current sheet ID and selection
- **`<initial_state>`**: Only on FIRST message, contains workbook metadata (sheets, dimensions, frozen panes)

## API Request Structure

### HTTP Headers
```http
POST /v1/messages HTTP/2
Host: api.anthropic.com
Origin: https://pivot.claude.ai
anthropic-version: 2023-06-01
anthropic-beta: oauth-2025-04-20,code-execution-2025-08-25,files-api-2025-04-14,code-execution-with-tools-2025-09-08
anthropic-dangerous-direct-browser-access: true
x-stainless-timeout: 600
```

**Beta features enabled:**
| Beta | Date | Purpose |
|------|------|---------|
| `oauth-2025-04-20` | Apr 2025 | OAuth authentication for the add-in |
| `files-api-2025-04-14` | Apr 2025 | File upload/handling |
| `code-execution-2025-08-25` | Aug 2025 | Basic Python sandbox execution |
| `code-execution-with-tools-2025-09-08` | Sep 2025 | **PTC** - calling tools from within code execution |

> **Note**: `code-execution-with-tools-2025-09-08` predates the public `advanced-tool-use-2025-11-20` beta by ~2 months. This is likely an earlier internal implementation of PTC that Anthropic built for Pivot before generalizing it for public release.

**Notable headers:**
- `Origin: https://pivot.claude.ai` - "Pivot" is the internal codename for Claude for Excel
- `anthropic-dangerous-direct-browser-access: true` - Allows browser to call API directly (no backend proxy needed)
- `x-stainless-timeout: 600` - 10 minute request timeout

### Request Body
```json
{
  "model": "claude-opus-4-5-20251101",
  "max_tokens": 50000,
  "stream": true,
  "container": "container_011CXj1EJg1bFSwXLr4LuboX",
  "metadata": {
    "user_id": "excel-add-in/base64_encoded_email"
  },
  "system": "...(system prompt)...",
  "tools": [...],
  "messages": [...]
}
```

The `container` field links to a persistent code execution environment (reused across turns).

## RPC Mechanism (Python to Excel)

The key innovation is how Python code running in an isolated cloud container can read/write to the user's local Excel instance. This works via **two layers**:

### Layer 1: Anthropic's Programmatic Tool Calling (PTC) API

This is a documented Anthropic beta feature. See: https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling

**Beta headers:**
| Internal (Pivot) | Public API | Purpose |
|------------------|------------|---------|
| `code-execution-2025-08-25` | `code-execution-2025-08-25` | Enables Python sandbox |
| `code-execution-with-tools-2025-09-08` | `advanced-tool-use-2025-11-20` | Enables PTC |

Pivot uses the older internal beta headers. The public `advanced-tool-use` beta (Nov 2025) is likely a generalized version of what Anthropic first built for Pivot (Sep 2025).

**Tool type in request body:** `"type": "code_execution_20250825"`

**How it works at the API level:**

1. Client sends request with `code_execution` tool + other tools marked with `allowed_callers: ["code_execution_20250825"]`
2. Claude generates Python code that calls `await tool_name(params)`
3. **API pauses** and returns a response with:
   - `server_tool_use` block (the code_execution)
   - `tool_use` block with `caller.type: "code_execution_20250825"` (the programmatic call)
   - `stop_reason: "tool_use"`
   - `container.expires_at` timestamp
4. Client executes the tool (in Excel's case, via OfficeJS locally)
5. Client sends tool result back to API
6. API **resumes** code execution with the result
7. Repeat until code completes, then `code_execution_tool_result` is returned

```
┌─────────────┐                      ┌─────────────┐                    ┌─────────────┐
│   Client    │                      │ Anthropic   │                    │  Sandbox    │
│  (OfficeJS) │                      │    API      │                    │ (Container) │
└──────┬──────┘                      └──────┬──────┘                    └──────┬──────┘
       │                                    │                                  │
       │  1. POST /messages                 │                                  │
       │  (tools + code_execution)          │                                  │
       │───────────────────────────────────>│                                  │
       │                                    │  2. Start container,             │
       │                                    │     run Python code              │
       │                                    │─────────────────────────────────>│
       │                                    │                                  │
       │                                    │  3. Code calls await tool()      │
       │                                    │<─────────────────────────────────│
       │                                    │     (container pauses)           │
       │  4. Response with tool_use         │                                  │
       │  (stop_reason: "tool_use")         │                                  │
       │<───────────────────────────────────│                                  │
       │                                    │                                  │
       │  5. Execute tool locally           │                                  │
       │  (OfficeJS → Excel)                │                                  │
       │                                    │                                  │
       │  6. POST /messages                 │                                  │
       │  (tool_result)                     │                                  │
       │───────────────────────────────────>│                                  │
       │                                    │  7. Resume code with result      │
       │                                    │─────────────────────────────────>│
       │                                    │                                  │
       │                                    │  8. Code continues/completes     │
       │                                    │<─────────────────────────────────│
       │  9. Final response                 │                                  │
       │  (code_execution_tool_result)      │                                  │
       │<───────────────────────────────────│                                  │
```

### Layer 2: Sandbox Internal IPC (pfc.py)

Inside the container, the orchestrator injects `pfc.py` which provides async function stubs. When Claude's code calls `await get_range_as_csv({...})`, this is what happens **inside the sandbox**:

```
Python Code → .request file → Orchestrator → (triggers API pause) → Client
                                    ↓
Python Code ← .response file ← Orchestrator ← (API resume) ← Client
```

**The file-based IPC flow:**

1. **Generate Request**: Create unique ID (`uuid.uuid4().hex`), write `.request` JSON file to `/tmp/srvtoolu_xxx/`
2. **Signal Orchestrator**: Log `[TOOL_CALL] {...}` to `_original_stdout` (bypasses captured stdout)
3. **Wait for Response**: `PFCToolCallRegistry` polls for `.response` file every 100ms (4.5min timeout)
4. **Orchestrator detects request**: Triggers the API-level pause, surfaces `tool_use` to client
5. **Client executes & responds**: Tool result comes back via API continuation
6. **Orchestrator writes response**: Creates `{tool_use_id}.response` file
7. **Python resumes**: Registry detects file, signals the waiting coroutine, returns result

### pfc.py - The RPC Stub Code

```python
# Injected into Python container before user code runs

async def _call_client_tool(tool_name: str, **kwargs: Any) -> Any:
    # Generate unique ID for this call
    custom_tool_use_id = uuid.uuid4().hex

    # Build request
    request = {
        "tool": tool_name,
        "parameters": kwargs.get("params", {}),
        "tool_use_id": custom_tool_use_id,
    }

    # Write request file
    with open(f"{pfc_dir}/{custom_tool_use_id}.request", "w") as f:
        json.dump(request, f)

    # Signal orchestrator (bypasses captured stdout)
    _original_stdout.write(f"[TOOL_CALL] {json.dumps(request)}\n")

    # Wait for response file (polls every 100ms)
    await registry.wait_for_response(custom_tool_use_id)

    # Read and return response
    with open(f"{pfc_dir}/{custom_tool_use_id}.response") as f:
        return json.load(f)["content"]

# Thin wrappers
async def get_cell_ranges(params: dict) -> str:
    return await _call_client_tool("get_cell_ranges", **locals())

async def get_range_as_csv(params: dict) -> str:
    return await _call_client_tool("get_range_as_csv", **locals())

async def set_cell_range(params: dict) -> str:
    return await _call_client_tool("set_cell_range", **locals())
```

### Why This Architecture?

**Why PTC at the API level?**

- Client keeps control of tool execution - Anthropic never directly accesses user data
- Tools can be executed locally (OfficeJS → Excel) or remotely
- Client can validate, rate-limit, or reject tool calls before executing
- Natural fit for browser-based add-ins that can't expose raw TCP/WebSocket to the sandbox

**Why file-based IPC inside the sandbox?**

- Sandbox has NO network access - can't make HTTP calls or open sockets
- File I/O is the only permitted side effect in gVisor
- `[TOOL_CALL]` stdout logging provides an audit trail
- The orchestrator can inspect/validate every request before surfacing it to the API
- Polling is simple and doesn't require complex async primitives

**Defense in Depth**:

```
Claude generates code
       ↓
Sandbox (isolated, no network)
       ↓ writes .request file
Orchestrator (validates request)
       ↓ surfaces tool_use via API
Client (validates & executes locally)
       ↓ sends tool_result back
Orchestrator (writes .response file)
       ↓
Sandbox reads result & continues
```

### Enabling PTC for Tools (`allowed_callers`)

For a tool to be callable from within code execution, it must include `allowed_callers` in its definition:

```json
{
  "name": "get_range_as_csv",
  "description": "READ. Returns CSV string ready for pandas...",
  "input_schema": {...},
  "allowed_callers": ["direct", "code_execution_20250825"]
}
```

- `"direct"`: Tool can be called normally by Claude (outside code execution)
- `"code_execution_20250825"`: Tool can be called from within Python code execution

In Claude for Excel, only 3 tools allow programmatic calling:

- `get_cell_ranges` - detailed cell info
- `get_range_as_csv` - CSV format (preferred for pandas)
- `set_cell_range` - write data back

Other tools (like `modify_sheet_structure`, `modify_workbook_structure`) are `direct` only - Claude must call them outside of code execution.

### Conversation Flow with Code Execution

```
Message 1 (user): "Analyze this data"
Message 2 (assistant):
  - text: "Let me analyze..."
  - server_tool_use: { name: "code_execution", input: { code: "..." } }
  - tool_use: { name: "get_range_as_csv", caller: { type: "code_execution_20250825" } }

Message 3 (user):
  - tool_result: { tool_use_id: "...", content: "{csv data}" }

Message 4 (assistant):
  - code_execution_tool_result: { stdout: "...", stderr: "", return_code: 0 }
  - text: "Based on my analysis..."
```

Key observation: Tool calls from within code execution appear as separate `tool_use` blocks with `caller.type: "code_execution_20250825"`, linking them to the parent code execution via `tool_id`.

## Sandbox Environment

| Property | Value                           |
| -------- | ------------------------------- |
| OS       | Debian GNU/Linux 12 (Bookworm)  |
| Kernel   | 4.4.0 (gVisor/runsc)            |
| Python   | 3.11                            |
| CPUs     | 4 cores (Intel, Emerald Rapids) |
| RAM      | 10 GB                           |
| Timeout  | 5 minutes (4.5 min RPC timeout) |
| Network  | None (isolated)                 |

### Available Libraries

- **Data**: pandas, numpy, scipy
- **Spreadsheet**: openpyxl, xlrd, xlsxwriter
- **PDF**: pdfplumber, tabula-py
- **Office**: python-docx, python-pptx
- **Other**: pyarrow

## Custom Function Integrations

The system prompt includes support for financial data terminal add-ins:

| Platform       | Function                     | Example                              |
| -------------- | ---------------------------- | ------------------------------------ |
| Bloomberg      | `=BDP()`, `=BDH()`, `=BDS()` | `=BDP("AAPL US Equity", "PX_LAST")`  |
| FactSet        | `=FDS()`, `=FDSH()`          | `=FDS("AAPL-US", "P_PRICE")`         |
| S&P Capital IQ | `=CIQ()`, `=CIQH()`          | `=CIQ("NYSE:AAPL", "IQ_CLOSEPRICE")` |
| Refinitiv      | `=TR()`                      | `=TR("AAPL.O", "TR.CLOSEPRICE")`     |

If formulas return `#VALUE!` (missing plugin), Claude falls back to web search automatically.

## Security Model

1. **Client-Side Execution**: All Excel operations happen locally via OfficeJS - Anthropic never has direct access to spreadsheet files
2. **Sandboxed Compute**: Python runs in gVisor with no network/filesystem escape
3. **Proxied RPC**: Every tool call is validated by the orchestrator before execution
4. **Audit Trail**: All tool calls are logged via `[TOOL_CALL]` mechanism
5. **Overwrite Protection**: `set_cell_range` fails by default if overwriting data, requires explicit `allow_overwrite=true`

## File Structure

```
claude-for-excel/
├── README.md              # This file
├── system_prompt.md       # Full system prompt
├── tools.json             # Tool definitions (JSON schema)
├── tools.md               # Tool documentation (markdown)
├── user_message_format.md # Message structure docs
├── rpc.md                 # RPC conversation analysis
├── pfc.py                 # Python RPC stub code
└── request.json           # Example API request with conversation history
```
