# Manus Binary Reverse Engineering Analysis

**Analysis Date:** 2026-01-23  
**Tool Used:** Ghidra 12.0.1 + strings

## Binary Overview

| Binary | Size | Type | Purpose |
|--------|------|------|---------|
| `manus-upload-file` | 9.3 MB | ELF x86-64, static, stripped | Upload files to S3, get public URLs |
| `manus-mcp-cli` | 11.8 MB | ELF x86-64, static, stripped | MCP (Model Context Protocol) client |
| `manus-export-slides` | 11.5 MB | ELF x86-64, static, stripped | Export sessions to slides/HTML |
| `manus-md-to-pdf` | 12.4 MB | ELF x86-64, static, stripped | Convert Markdown to PDF |
| `manus-render-diagram` | 12.5 MB | ELF x86-64, static, stripped | Render diagrams (mermaid, d2, plantuml) |
| `manus-speech-to-text` | 7.5 MB | ELF x86-64, static, stripped | Speech transcription via OpenAI |

All binaries are **Go** applications (statically linked, stripped).

---

## Key Findings

### 1. API Endpoint
```
https://api.manus.im
```

### 2. Sentry Error Tracking
```
DSN: https://962d173a894df4e4c23c744f8c39d6f3@sentry.butterflyotel.online/9
```

### 3. Host ID Configuration
```
/opt/.manus/.host_id
```

### 4. Source Repository
```
gitlab.monica.cn/vida/manus-sandbox/sbx-go-svc
```

Packages:
- `packages/shared/pkg/bizserver/config` - Configuration
- `packages/shared/pkg/logger` - Logging
- `packages/mcp-cli/sdk/go/mcp/v1` - MCP SDK
- `packages/md-to-pdf/pkg/*` - PDF conversion
- `packages/speech-to-text/pkg/speechtotext` - STT

### 5. SDK Dependencies
```
gitlab.monica.cn/vida/sdk/bizserver-go.git
├── session/v1 - Session management
├── file/v1 - File operations (signing URLs)
└── connectors/v1 - OAuth & connector management

gitlab.monica.cn/vida/mcp-go - MCP Go client
```

---

## Service Details by Binary

### manus-upload-file
- **gRPC Service:** `file.v1.FileService/SandboxSignUrl`
- **Function:** Upload files to S3, get presigned URLs, return CDN URLs
- **Key Methods:**
  - `SignUrl` - Single file presigned URL
  - `BatchSignUrl` - Multiple files
  - `SandboxSignUrl` - Sandbox-specific uploads
- **Modules:** SESSION_FILE, SLIDE_IMAGE, MARKDOWN, WEB_DEV_LOGO, etc.
- **See:** [MANUS_UPLOAD_FILE_REVERSE.md](MANUS_UPLOAD_FILE_REVERSE.md) for full details

### manus-mcp-cli
- **gRPC Service:** `mcp.v1.McpService/CallTool`
- **Connectors API:** `connectors.v1.ConnectorsSandboxService/*`
- **Function:** MCP client for tools, prompts, resources, OAuth
- **Transport Types:** STDIO, SSE, HTTP
- **Built-in Connectors:** Gmail, GitHub, Google Drive, OneDrive, Figma, etc.
- **Key Methods:**
  - `CallTool` - Execute MCP tools
  - `CleanToken`, `CreateOrUpdateToken` - OAuth token management
  - `SandboxGetConnector`, `SandboxListConnectors` - Connector management
  - `GetMCPManifest`, `UploadOrOverwriteMCPManifest` - Manifest handling
  - `InstantOauthCallback`, `PushOAuthUrl` - OAuth flow
- **See:** [MANUS_MCP_CLI_REVERSE.md](MANUS_MCP_CLI_REVERSE.md) for full details

### manus-export-slides
- **gRPC Service:** `session.v1.SessionService/*`
- **Function:** Export sessions to HTML/slides
- **Key Methods:**
  - `GetSessionPublic`
  - `ListWebTemplates`
  - `SbxConvertHtml`
  - `CreateSessionFileConvertTask`
  - `GetSharedSessionFile`

### manus-md-to-pdf
- **Function:** Convert Markdown to PDF
- **External Dependencies:**
  - `cdn.jsdelivr.net/npm/mermaid` - Mermaid diagrams
  - `cdn.jsdelivr.net/npm/katex` - LaTeX math
  - `cdn.jsdelivr.net/gh/highlightjs/cdn-release` - Code highlighting

### manus-render-diagram
- **Function:** Render diagrams
- **Supported Formats:**
  - Mermaid
  - D2 (`d2lang.com`)
  - PlantUML (downloads `plantuml-1.2025.4.jar`)
- **External Dependencies:** Same as md-to-pdf

### manus-speech-to-text
- **External API:** `https://api.openai.com/v1/audio/transcriptions`
- **Model:** `whisper-1`
- **Function:** Transcribe audio using OpenAI Whisper
- **Go Client:** `github.com/sashabaranov/go-openai`
- **FFmpeg:** Converts video/large files to 64kbps MP3
- **See:** [MANUS_SPEECH_TO_TEXT_REVERSE.md](MANUS_SPEECH_TO_TEXT_REVERSE.md) for full details

---

## Go Dependencies

| Package | Purpose |
|---------|---------|
| `github.com/spf13/cobra` | CLI framework |
| `github.com/spf13/pflag` | Flag parsing |
| `github.com/getsentry/sentry-go` | Error tracking |
| `github.com/go-resty/resty` | HTTP client |
| `google.golang.org/protobuf` | Protocol Buffers |
| `connectrpc.com` | Connect-RPC (gRPC alternative) |
| `golang.org/x/text` | Text processing |

---

## Environment Variables (Inferred)

Based on string analysis:
- `APP_ENV` - Environment (release/debug)
- `RUNTIME_API_HOST` - API host override
- `BASH_COMP_DEBUG_FILE` - Shell completion debug
- `SENTRY_RELEASE` - Sentry release version

---

## Protocol

Uses **Connect-RPC** (https://connectrpc.com) - a protocol compatible with gRPC but also works over HTTP/1.1 with JSON.

All services communicate with `https://api.manus.im` using Connect-RPC with protobuf encoding.

---

## Security Notes

1. Binaries contain hardcoded Sentry DSN (not a major security issue, but leaks project info)
2. Host identification via `/opt/.manus/.host_id`
3. All communication appears to use TLS (HTTPS)
4. OAuth token management for connectors

---

## Related Documentation

See also:
- `MANUS_CLI_README.md`
- `MANUS_TOOLS_SUMMARY.md`
- `MANUS_UPLOAD_FILE_ENV.md`
