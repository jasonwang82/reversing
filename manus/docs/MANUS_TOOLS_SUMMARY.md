# Manus CLI Tools - Complete Reverse Engineering Summary

## Tools Overview

| Tool | Local/Remote | Requires Auth | Purpose |
|------|--------------|---------------|---------|
| `manus-md-to-pdf` | Local | ❌ No | Convert Markdown to PDF (uses Chrome headless) |
| `manus-render-diagram` | Local | ❌ No | Render diagrams (.mmd, .d2, .puml) to PNG |
| `manus-upload-file` | Remote | ✅ Yes | Upload files to S3 via BizServer API |
| `manus-export-slides` | Remote | ✅ Yes | Export Manus Slides to PDF/PPT via server conversion |
| `manus-speech-to-text` | Remote | ✅ Yes (OpenAI) | Transcribe audio/video via Whisper API |
| `manus-mcp-cli` | Remote | ✅ Yes | MCP client (tools, prompts, resources, OAuth) |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      MANUS SANDBOX / USER'S MACHINE          │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  manus-*     │    │  ~/.manus/   │    │  Current     │  │
│  │  binaries    │    │              │    │  Directory   │  │
│  │              │    │  ├─ .env     │    │              │  │
│  │  + Chrome    │    │  └─ secrets/ │    │  ├─ files    │  │
│  │  (chromedp)  │◄───┤     └─ ...   │◄───┤  └─ output   │  │
│  │              │    │              │    │              │  │
│  └──────┬───────┘    └──────────────┘    └──────────────┘  │
│         │                                                   │
└─────────┼───────────────────────────────────────────────────┘
          │
          ├──── LOCAL TOOLS (no network)
          │     ├─ manus-md-to-pdf (Markdown → PDF via Chrome)
          │     └─ manus-render-diagram (Mermaid/D2/PlantUML → PNG)
          │
          └──── REMOTE TOOLS (network required)
                │
                ▼
        ┌───────────────────────────────────────┐
        │   MANUS PLATFORM APIs                 │
        │   (gitlab.monica.cn/vida)             │
        │                                       │
        │   ┌─────────────────────────────────┐ │
        │   │  BizServer API                  │ │
        │   │  ├─ /file/v1/SandboxSignUrl     │ │ ← manus-upload-file
        │   │  ├─ /session/v1/Create...Task   │ │ ← manus-export-slides
        │   │  └─ /session/v1/Loop...Task     │ │ ← manus-export-slides
        │   └─────────────────────────────────┘ │
        │                                       │
        │   ┌─────────────────────────────────┐ │
        │   │  S3 Storage                     │ │
        │   │  ├─ Presigned Upload URLs       │ │
        │   │  └─ CDN URLs for downloads      │ │
        │   └─────────────────────────────────┘ │
        └───────────────────────────────────────┘
```

## Data Flow Examples

### 1. manus-upload-file

```
User File
   │
   ▼
┌──────────────────────────────┐
│ 1. Authenticate              │ ← BIZSERVER_TOKEN
│    with BizServer            │   SANDBOX_API_TOKEN
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ 2. Request presigned S3 URL  │
│    POST /file/v1/            │
│    SandboxSignUrl            │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ 3. Upload file to S3         │ ← Presigned URL
│    (direct upload)           │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ 4. Return CDN URL            │ → Public URL
└──────────────────────────────┘
```

### 2. manus-export-slides

```
manus-slides://{version_id}
   │
   ▼
┌──────────────────────────────┐
│ 1. Load local metadata       │ ← ~/.manus/.slide-versions.json
│    Extract version_id        │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ 2. Create conversion task    │ ← BIZSERVER_TOKEN
│    POST /session/v1/         │
│    CreateSessionFile...      │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ 3. Poll for completion       │ ← Task ID
│    GET /session/v1/Loop...   │ ┐
└─────────┬────────────────────┘ │ Repeat until
          │                      │ SUCCESS/FAILED
          ▼                      │
┌──────────────────────────────┐ │
│ Status: CONVERTING?          │─┘
└─────────┬────────────────────┘
          │ SUCCESS
          ▼
┌──────────────────────────────┐
│ 4. Download converted file   │ ← Presigned S3 URL
│    Save as output.pdf/ppt    │
└──────────────────────────────┘
```

### 3. manus-md-to-pdf (Local)

```
input.md
   │
   ▼
┌──────────────────────────────┐
│ 1. Convert Markdown → HTML   │ ← gomarkdown/markdown
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ 2. Inject into HTML template │ ← templates/md2pdf_default.html
│    + Mermaid.js (10.6.1)     │   templates/md2pdf_arabic.html
│    + KaTeX (0.16.25)         │
│    + Highlight.js (11.9.0)   │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ 3. Render in headless Chrome │ ← chromedp/chromedp
│    - Load HTML               │
│    - Render Mermaid diagrams │
│    - Render KaTeX math       │
│    - Highlight code blocks   │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ 4. Page.printToPDF via CDP   │ ← Chrome DevTools Protocol
│    (paper size, margins...)  │
└─────────┬────────────────────┘
          │
          ▼
      output.pdf
```

### 4. manus-render-diagram (Local)

```
input.{mmd,d2,puml,md}
   │
   ├───▶ .mmd/.md ──────────────────────────────────────────────┐
   │     │                                                      │
   │     ▼                                                      │
   │     ┌──────────────────────────────┐                       │
   │     │ 1. Inject into HTML template │ ← templates/mmd2png   │
   │     │    + Mermaid.js (10.6.1)     │                       │
   │     └─────────┬────────────────────┘                       │
   │               │                                            │
   │               ▼                                            │
   │     ┌──────────────────────────────┐                       │
   │     │ 2. Render in headless Chrome │ ← chromedp/chromedp   │
   │     └─────────┬────────────────────┘                       │
   │               │                                            │
   │               ▼                                            │
   │     ┌──────────────────────────────┐                       │
   │     │ 3. Page.captureScreenshot    │ ← PNG output          │
   │     └─────────┬────────────────────┘                       │
   │               │                                            │
   ├───▶ .d2 ──────┼────────────────────────────────────────────┤
   │     │         │                                            │
   │     ▼         │                                            │
   │     d2 CLI ───┼────────────────────────────────────────────┤
   │               │                                            │
   └───▶ .puml ────┼────────────────────────────────────────────┤
         │         │                                            │
         ▼         │                                            │
         java -jar │                                            │
         plantuml  │                                            │
         1.2025.4  │                                            │
                   │                                            │
                   ▼                                            │
              output.png ◀──────────────────────────────────────┘
```

## Required Configuration Files

### For ALL Remote Tools

#### `~/.manus/.env`
```bash
# BizServer Authentication
BIZSERVER_HOST=gitlab.monica.cn
BIZSERVER_TOKEN=your-bizserver-token-here
SANDBOX_ID=your-sandbox-id-here

# Optional: Sentry Error Tracking
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=1.0.0
```

#### `~/.manus/secrets/sandbox_api_token`
```
your-sandbox-api-token-here
```

### For manus-export-slides ONLY

#### `~/.manus/.slide-versions.json`
```json
{
  "versions": [
    {
      "version_id": "abc123...",
      "name": "My Presentation",
      "slides_uri": "manus-slides://abc123...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## API Endpoints Reference

### BizServer File API (`gitlab.monica.cn/vida/sdk/bizserver-go.git/file/v1`)

| Endpoint | Purpose | Used By |
|----------|---------|---------|
| `/file.v1.FileService/SandboxSignUrl` | Get presigned S3 URL for upload | manus-upload-file |
| `/file.v1.FileService/SignUrl` | Get presigned URL (generic) | - |
| `/file.v1.FileService/BatchSignUrl` | Get multiple URLs at once | - |

### BizServer Session API (`gitlab.monica.cn/vida/sdk/bizserver-go.git/session/v1`)

| Endpoint | Purpose | Used By |
|----------|---------|---------|
| `/session.v1.SessionPublicService/CreateSessionFileConvertTask` | Start conversion task | manus-export-slides |
| `/session.v1.SessionPublicService/LoopSessionFileConvertTask` | Poll conversion status | manus-export-slides |
| `/session.v1.SessionPublicService/ListUsecaseSessions` | List sessions | - |
| `/session.v1.SessionPublicService/GetSharedSessionFile` | Get shared files | - |
| `/session.v1.SessionPublicService/SbxConvertHtml` | Convert HTML | - |

## Conversion Types Supported

```go
enum SessionFileConvertType {
  SESSION_FILE_CONVERT_TYPE_UNSPECIFIED = 0;
  SESSION_FILE_CONVERT_TYPE_HTML_TO_PDF = 1;    // ← Used for PDF export
  SESSION_FILE_CONVERT_TYPE_HTML_TO_PPT = 2;    // ← Used for PPT export
  SESSION_FILE_CONVERT_TYPE_PPTX_TO_PNG = 3;
  SESSION_FILE_CONVERT_TYPE_MARKDOWN_TO_PDF = 4;
  SESSION_FILE_CONVERT_TYPE_MARKDOWN_TO_DOCX = 5;
}
```

## Build Information

**Source Repository:** `gitlab.monica.cn/vida/manus-sandbox/sbx-go-svc`

**Packages:**
- `manus-upload-file`: `packages/upload-file`
- `manus-export-slides`: `packages/slides_to_pdf`
- Shared libraries: `packages/shared/pkg/bizserver`

**Build Date:** May 26, 2020 (commit: cb27e3aa)

**Go Version:** Built with Go (statically linked binaries)

**Platform:** Linux x86-64 (ELF 64-bit LSB executable)

## Running the Tools

### Local Tools (No Auth Required)

**Direct usage (requires Chrome/Chromium installed):**
```bash
# Markdown to PDF
./manus-md-to-pdf document.md output.pdf

# Render Mermaid diagram
./manus-render-diagram flowchart.mmd flowchart.png

# Render D2 diagram (requires d2 CLI)
./manus-render-diagram architecture.d2 architecture.png

# Render PlantUML (requires Java + plantuml.jar)
./manus-render-diagram sequence.puml sequence.png
```

**Via Docker wrapper (if no Chrome installed locally):**
```bash
# Uses zenika/alpine-chrome:with-node container
./manus-md-to-pdf.sh document.md output.pdf
./manus-render-diagram.sh flowchart.mmd flowchart.png
```

### Remote Tools (Auth Required)

```bash
# Setup (one-time)
./setup-manus-env-example.sh ~/.manus
nano ~/.manus/.env  # Add your credentials
nano ~/.manus/secrets/sandbox_api_token  # Add your token

# Upload file
./run-manus-with-env.sh ~/.manus manus-upload-file image.png

# Export slides
./run-manus-with-env.sh ~/.manus manus-export-slides manus-slides://version_id pdf
```

## Security Considerations

1. **Credentials Storage:**
   - Tokens stored in `~/.manus/secrets/` (should be chmod 600)
   - Environment variables in `~/.manus/.env` (should be chmod 600)

2. **Network Communication:**
   - All remote tools use HTTPS (Connect RPC protocol)
   - Uses Sentry for error reporting (sends to sentry.butterflyotel.online)

3. **Local Tool Runtime:**
   - Binaries use `chromedp` to control Chrome via CDP (no Docker needed)
   - Chrome/Chromium must be installed on the system
   - For local dev without Chrome: `run-manus.sh` provides Docker wrappers (zenika/alpine-chrome)
   - D2 diagrams require `d2` CLI; PlantUML requires Java + JAR file

4. **Authentication:**
   - Dual authentication: BizServer token + Sandbox API token
   - Tokens passed via files (not environment vars)
   - Presigned URLs with time-based expiration

## Reverse Engineering Insights

### How I Analyzed These Binaries

1. **`strings` command:** Extract all readable strings from the binary
2. **Pattern matching:** Found API endpoints, error messages, file paths
3. **gRPC/Protobuf analysis:** Identified service names and message types
4. **Code structure inference:** Reconstructed function flows from error messages
5. **Configuration discovery:** Found hardcoded paths and environment variable names

### Key Discoveries

- **Connect RPC:** Uses Buf/Connect (modern gRPC-like protocol)
- **Build path leaks:** Full source paths visible (GitLab CI runner paths)
- **Hardcoded URLs:** `https://api.manus.im/` base URL
- **File structure:** `.manus` hidden directory convention
- **Error handling:** Comprehensive error messages that reveal logic flow
- **Platform integration:** Deep integration with "Vida Manus Sandbox" platform

### Limitations of Reverse Engineering

✅ **What I Could Determine:**
- API endpoints and request/response structure
- Required configuration files and format
- Authentication mechanism
- Error conditions and validation rules
- Data flow and architecture

❌ **What I Could NOT Determine:**
- Actual credential values (user-specific)
- Complete protobuf message definitions
- Server-side implementation details
- Rate limits or quotas
- Business logic rules

## Conclusion

The Manus CLI tools are a sophisticated suite of binaries designed for the Manus platform:

- **2 tools work standalone** (md-to-pdf, render-diagram) - fully functional
- **4 tools require authentication** (upload-file, export-slides, speech-to-text, mcp-cli) - need Manus platform access
- **Well-architected:** Clean separation of concerns, proper error handling
- **Production-grade:** Sentry integration, comprehensive logging, proper auth flows
- **Platform-specific:** Tightly coupled to internal Manus infrastructure

**Bottom line:** The local tools are ready to use. The remote tools require legitimate access to the Manus platform (not publicly available), except `manus-speech-to-text` which uses OpenAI's public API.

---

## Detailed Reverse Engineering Docs

### Remote Tools (Require Authentication)
- [MANUS_MCP_CLI_REVERSE.md](MANUS_MCP_CLI_REVERSE.md) - MCP protocol, OAuth, connectors, transports
- [MANUS_SPEECH_TO_TEXT_REVERSE.md](MANUS_SPEECH_TO_TEXT_REVERSE.md) - Whisper API params, ffmpeg conversion
- [MANUS_EXPORT_SLIDES_REVERSE.md](MANUS_EXPORT_SLIDES_REVERSE.md) - Slide conversion flow
- [MANUS_UPLOAD_FILE_REVERSE.md](MANUS_UPLOAD_FILE_REVERSE.md) - S3 presigned URLs, upload flow
- [MANUS_UPLOAD_FILE_ENV.md](MANUS_UPLOAD_FILE_ENV.md) - Environment configuration

### Local Tools (No Authentication Needed)
- [MANUS_MD_TO_PDF_REVERSE.md](MANUS_MD_TO_PDF_REVERSE.md) - Chrome headless, Mermaid/KaTeX/Highlight.js
- [MANUS_RENDER_DIAGRAM_REVERSE.md](MANUS_RENDER_DIAGRAM_REVERSE.md) - Mermaid, D2, PlantUML rendering
