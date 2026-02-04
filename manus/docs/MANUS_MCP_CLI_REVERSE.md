# manus-mcp-cli - Reverse Engineered Documentation

## Overview

`manus-mcp-cli` is a comprehensive MCP (Model Context Protocol) client for managing and interacting with MCP servers. It supports multiple transport types, OAuth authentication, and integrates with the Manus BizServer API for connector management.

**Source Package:** `gitlab.monica.cn/vida/manus-sandbox/sbx-go-svc/packages/mcp-cli`

**MCP Library:** `gitlab.monica.cn/vida/mcp-go`

**Build:** `cb27e3aa (May 26th, 2020)`

---

## CLI Command Structure

```
mcp-cli
├── server          # Manage MCP servers
│   ├── list        # List enabled MCP servers and check connectivity
│   └── check       # Check connectivity to MCP servers
├── tool            # Manage and execute MCP tools
│   ├── list        # List all tools available on servers
│   └── execute     # Execute a tool with JSON input parameters
├── prompt          # Work with MCP server prompts
│   ├── list        # List all prompts available on servers
│   └── execute     # Execute a prompt with JSON arguments
├── resource        # Work with MCP resources
│   ├── list        # List all resources available on servers
│   └── read        # Read and display resource content by URI
└── auth            # OAuth authentication management
    ├── status      # Show authentication status
    ├── login       # Start OAuth 2.1 authentication flow
    └── clean       # Remove OAuth tokens for servers
```

---

## API Endpoints

### MCP Service (Internal)

```
/mcp.v1.MCPService/CallTool
```

### Connectors Sandbox Service

| Endpoint | Purpose |
|----------|---------|
| `/connectors.v1.ConnectorsSandboxService/SandboxListConnectors` | List available connectors |
| `/connectors.v1.ConnectorsSandboxService/SandboxGetConnector` | Get connector details |
| `/connectors.v1.ConnectorsSandboxService/CreateOrUpdateToken` | Manage OAuth tokens |
| `/connectors.v1.ConnectorsSandboxService/CleanToken` | Clean stored tokens |
| `/connectors.v1.ConnectorsSandboxService/LoopStatus` | Poll connector status |
| `/connectors.v1.ConnectorsSandboxService/PushOAuthUrl` | Push OAuth redirect URL |
| `/connectors.v1.ConnectorsSandboxService/InstantOauthCallback` | Handle OAuth callback |
| `/connectors.v1.ConnectorsSandboxService/RecordConnectorUsage` | Track connector usage |
| `/connectors.v1.ConnectorsSandboxService/GetMCPManifest` | Get MCP server manifest |
| `/connectors.v1.ConnectorsSandboxService/UploadOrOverwriteMCPManifest` | Upload MCP manifest |

---

## Enums

### Connector Types

```protobuf
enum ConnectorType {
  CONNECTOR_TYPE_UNSPECIFIED = 0;
  CONNECTOR_TYPE_BUILTIN = 1;    // Built-in connectors (Gmail, GitHub, etc.)
  CONNECTOR_TYPE_BYOK = 2;       // Bring Your Own Key
  CONNECTOR_TYPE_MCP = 3;        // Custom MCP servers
}
```

### Built-in Connector IDs

```protobuf
enum BuiltinID {
  BUILTIN_ID_UNSPECIFIED = 0;
  BUILTIN_ID_GMAIL = 1;
  BUILTIN_ID_GOOGLE_CALENDAR = 2;
  BUILTIN_ID_GITHUB = 3;
  BUILTIN_ID_GOOGLE_DRIVE = 4;
  BUILTIN_ID_ONE_DRIVE_PERSONAL = 5;
  BUILTIN_ID_ONE_DRIVE_BUSINESS = 6;
  BUILTIN_ID_FIGMA = 7;
  BUILTIN_ID_MICROSOFT_CALENDAR = 8;
  BUILTIN_ID_MICROSOFT_OUTLOOK = 9;
}
```

### MCP Transport Types

```protobuf
enum MCPTransportType {
  MCP_TRANSPORT_TYPE_UNSPECIFIED = 0;
  MCP_TRANSPORT_TYPE_STDIO = 1;   // Standard I/O (subprocess)
  MCP_TRANSPORT_TYPE_SSE = 2;     // Server-Sent Events
  MCP_TRANSPORT_TYPE_HTTP = 3;    // HTTP/REST
}
```

### Display Groups

```protobuf
enum DisplayGroup {
  DISPLAY_GROUP_UNSPECIFIED = 0;
  DISPLAY_GROUP_INTGRATION = 1;   // Integration connectors
  DISPLAY_GROUP_BYOK = 2;         // BYOK connectors
  DISPLAY_GROUP_MCP = 3;          // MCP servers
}
```

### Variable Types

```protobuf
enum VariableType {
  VARIABLE_TYPE_UNSPECIFIED = 0;
  VARIABLE_TYPE_ARGS = 1;         // Command arguments
  VARIABLE_TYPE_ENV = 2;          // Environment variables
  VARIABLE_TYPE_HEADER = 3;       // HTTP headers
  VARIABLE_TYPE_SERVER_URL = 4;   // Server URL
}
```

### GitHub Status

```protobuf
enum GithubStatus {
  GITHUB_STATUS_UNSPECIFIED = 0;
  GITHUB_STATUS_NOT_CONNECTED = 1;
  GITHUB_STATUS_CONNECTED = 2;
  GITHUB_STATUS_REPO_ADDED = 3;
}
```

### Suggestion Status

```protobuf
enum SuggestionStatus {
  SUGGESTION_STATUS_UNSPECIFIED = 0;
  SUGGESTION_STATUS_SUGGESTED = 1;
  SUGGESTION_STATUS_ACCEPTED = 2;
  SUGGESTION_STATUS_REJECTED = 3;
  SUGGESTION_STATUS_IGNORED = 4;
  SUGGESTION_STATUS_OUTDATED = 5;
}
```

---

## Transport Types

### STDIO Transport
- Spawns MCP server as subprocess
- Communicates via stdin/stdout
- Used for local MCP servers

### SSE (Server-Sent Events) Transport
- HTTP-based streaming
- Supports OAuth authentication
- Used for remote MCP servers

### HTTP Transport
- Standard REST API calls
- Supports OAuth authentication
- Used for HTTP-based MCP servers

---

## OAuth 2.1 Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. Check if server requires OAuth                           │
│     - Test connection without auth                           │
│     - Check server metadata at /.well-known/openid-config   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Generate Authorization URL                               │
│     - Request auth URL from BizServer                        │
│     - Push OAuth URL via PushOAuthUrl API                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  3. User completes OAuth in browser                          │
│     - Redirect to authorization server                       │
│     - User grants permissions                                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Receive callback                                         │
│     - InstantOauthCallback processes the response            │
│     - Exchange code for tokens                               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Store tokens                                             │
│     - CreateOrUpdateToken saves tokens                       │
│     - Token store manages credentials                        │
└─────────────────────────────────────────────────────────────┘
```

---

## DXT Package Support

The CLI supports Anthropic's DXT (Desktop Extension) packages:

### MCPB Tool Integration
```
@anthropic-ai/mcpb
```

**Installation:** Automatically installed via npm if not present

**Operations:**
- Download DXT packages from S3
- Extract with `mcpb unpack`
- Parse `manifest.json`
- Install dependencies

### DXT File Handling
```
bundle.dxt                    # Downloaded package
manifest.json                 # Package manifest
/tmp/manus-mcp/              # Extraction directory
/tmp/manus-mcp/builtin_tools.json  # Cached builtin tools
```

---

## Protobuf Message Structures

### CallToolRequest

```protobuf
message CallToolRequest {
  string server_uid = 1;      // Server identifier
  string tool_name = 2;       // Tool to execute
  bytes input_json = 3;       // JSON input parameters
  bool is_builtin = 4;        // Is builtin connector
}
```

### CallToolResponse

```protobuf
message CallToolResponse {
  // Tool execution result
}
```

### Connector Metadata

```protobuf
message ConnectorMetadata {
  ConnectorType type = 1;
  BuiltinID builtin_id = 2;
  string server_url = 3;
  MCPTransportType transport_type = 4;
  // Additional configuration
}
```

---

## Configuration Files

### Environment File
```bash
# ~/.manus/.env
BIZSERVER_HOST=api.manus.im
BIZSERVER_TOKEN=your-auth-token
SANDBOX_ID=your-sandbox-id
```

### Sandbox Token
```
# ~/.manus/secrets/sandbox_api_token
your-sandbox-api-token
```

### Host ID
```
# /opt/.manus/.host_id
unique-host-identifier
```

### Builtin Tools Cache
```
# /tmp/manus-mcp/builtin_tools.json
{
  "tools": [...]
}
```

---

## CLI Usage Examples

### List Servers
```bash
mcp-cli server list
# Lists enabled MCP servers with connectivity status
```

### List Tools
```bash
mcp-cli tool list
# List all tools available on specified server or all enabled servers

mcp-cli tool list --server my-server
# List tools for specific server
```

### Execute Tool
```bash
mcp-cli tool execute my-tool --input '{"param": "value"}'
# Execute a tool with optional JSON input parameters

mcp-cli tool execute my-tool --server my-server --input '{"key": "value"}'
# Execute on specific server
```

### List Prompts
```bash
mcp-cli prompt list
# List all prompts available on specified server or all enabled servers
```

### Execute Prompt
```bash
mcp-cli prompt execute my-prompt --args '{"arg1": "value"}'
# Execute a prompt with optional JSON arguments and display the result
```

### List Resources
```bash
mcp-cli resource list
# List all resources available on specified server or all enabled servers
```

### Read Resource
```bash
mcp-cli resource read resource://my-resource
# Read and display the content of a resource by its URI
```

### Authentication
```bash
mcp-cli auth status
# Show authentication status for all servers

mcp-cli auth login --server my-server
# Start OAuth 2.1 authentication flow for the specified server

mcp-cli auth clean
# Remove OAuth tokens for a specific server or clear all stored tokens
```

---

## Error Messages

### Connection Errors

| Error | Cause |
|-------|-------|
| `failed to start client: %w` | Cannot connect to MCP server |
| `transport not started yet` | Transport layer not initialized |
| `transport has been closed` | Connection closed |
| `connection has been closed` | Server disconnected |
| `failed to listen to server. retry in 1 second: %v` | Connection retry |
| `maximum connections reached (%d)` | Connection pool exhausted |

### Authentication Errors

| Error | Cause |
|-------|-------|
| `OAuth authorization required. Starting authorization flow...` | Auth needed |
| `Server is not authenticated but OAuth is available` | Needs OAuth |
| `authorization token is nil` | No stored token |
| `token store is nil` | Token storage not initialized |
| `Failed to connect during OAuth compatibility check` | OAuth check failed |
| `server does not support dynamic client registration` | OAuth not supported |

### Tool/Resource Errors

| Error | Cause |
|-------|-------|
| `tool not found` | Tool doesn't exist |
| `tool '%s' not found on server '%s'` | Tool not on server |
| `tool '%s' not found on builtin server '%s'. Did you mean: %s?` | Typo suggestion |
| `no available tools` | No tools registered |
| `resource not found` | Resource doesn't exist |
| `prompt not found` | Prompt doesn't exist |
| `no available prompts` | No prompts registered |
| `no available resources` | No resources registered |

### Configuration Errors

| Error | Cause |
|-------|-------|
| `Environment file not found` | Missing .env file |
| `empty BizServerConfig.Host` | No host configured |
| `nil BizServerConfig` | Config not loaded |
| `STDIO configuration is nil` | Missing STDIO config |
| `server name is empty` | No server name provided |
| `no connector found for server: %s` | Server not in connectors |

---

## Internal Architecture

### Connection Management

```go
type Manager struct {
    connections map[string]*ManagedConnection
    // Connection pooling and lifecycle management
}

type ManagedConnection struct {
    // Individual server connection state
}
```

### Auth Management

```go
type OAuthManager struct {
    tokenStore TokenStore
    // OAuth flow handling
}
```

---

## Transport-Specific Notes

### STDIO Transport
- Spawns process with configured command
- Creates stdin/stdout/stderr pipes
- Handles process lifecycle
- Error: `failed to create STDIO client: %w`
- Error: `failed to close stdin: %w`
- Error: `failed to close stderr: %w`

### SSE Transport
- Creates SSE client connection
- Handles streaming responses
- Supports reconnection
- Log: `Creating SSE client`
- Log: `listening to server forever`

### HTTP Transport
- Standard HTTP client
- Requires auth manager for OAuth
- Error: `auth manager is required for HTTP-based transport but is nil`
- Warning: `Using Basic Auth in HTTP mode is not secure, use HTTPS`

---

## NPM/MCPB Integration

When DXT packages are needed:

1. Check if `mcpb` command exists
2. If not, install via: `npm install -g @anthropic-ai/mcpb`
3. Download `.dxt` package from S3
4. Extract with: `mcpb unpack bundle.dxt`
5. Parse `manifest.json`
6. Execute MCP server

**Errors:**
- `npm command not found. Please install Node.js and npm first`
- `failed to install @anthropic-ai/mcpb via npm (output: %s): %w`
- `failed to extract DXT package with mcpb unpack (output: %s): %w`
- `DXT S3 URL is empty`
- `DXT version is empty`

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `gitlab.monica.cn/vida/mcp-go` | MCP protocol implementation |
| `github.com/spf13/cobra` | CLI framework |
| `github.com/go-resty/resty` | HTTP client |
| `github.com/getsentry/sentry-go` | Error tracking |
| `connectrpc.com/connect` | Connect-RPC client |
| `google.golang.org/protobuf` | Protobuf serialization |

---

## Sentry Error Tracking

```
DSN: https://962d173a894df4e4c23c744f8c39d6f3@sentry.butterflyotel.online/9
```

---

## Security Notes

1. **OAuth 2.1** - Modern OAuth flow for secure authentication
2. **Token Storage** - Tokens managed via BizServer, not stored locally
3. **HTTPS Warning** - Basic auth over HTTP triggers security warning
4. **Credential Isolation** - Each server has isolated credentials

---

## Limitations

1. **Requires Platform Access** - Needs Manus BizServer credentials
2. **NPM Dependency** - DXT packages require Node.js/npm
3. **Network Required** - Most operations need API connectivity
4. **OAuth Complexity** - Some servers require browser-based OAuth

---

## See Also

- [MANUS_CLI_README.md](MANUS_CLI_README.md) - General usage guide
- [MANUS_BINARY_ANALYSIS.md](MANUS_BINARY_ANALYSIS.md) - Full binary analysis
- [MANUS_TOOLS_SUMMARY.md](MANUS_TOOLS_SUMMARY.md) - All tools overview
- [MANUS_UPLOAD_FILE_ENV.md](MANUS_UPLOAD_FILE_ENV.md) - Environment configuration
