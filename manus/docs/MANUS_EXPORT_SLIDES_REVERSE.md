# manus-export-slides - Reverse Engineered Documentation

## Overview

`manus-export-slides` converts Manus Slides (from the Manus platform) to PDF or PPT format by communicating with the Manus BizServer API and triggering a server-side conversion task.

**Source Package:** `gitlab.monica.cn/vida/manus-sandbox/sbx-go-svc/packages/slides_to_pdf`

**Build:** `cb27e3aa (May 26th, 2020)`

---

## API Details

### Base URL
```
https://api.manus.im
```

### Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/session.v1.SessionPublicService/CreateSessionFileConvertTask` | Start conversion job |
| `/session.v1.SessionPublicService/LoopSessionFileConvertTask` | Poll for completion |
| `/session.v1.SessionPublicService/GetSessionPublic` | Get session details |
| `/session.v1.SessionPublicService/ListWebTemplates` | List available templates |
| `/session.v1.SessionPublicService/ListWebTemplatesForSbx` | Sandbox-specific templates |
| `/session.v1.SessionPublicService/ListSlideTemplatesPublic` | Public slide templates |
| `/session.v1.SessionPublicService/ListSessionTemplatesPublic` | Public session templates |
| `/session.v1.SessionPublicService/BatchGetCommunityUsecase` | Community use cases |

---

## Conversion Types (Enum)

```protobuf
enum SessionFileConvertType {
  SESSION_FILE_CONVERT_TYPE_UNSPECIFIED = 0;
  SESSION_FILE_CONVERT_TYPE_HTML_TO_PDF = 1;      // ← Used for PDF export
  SESSION_FILE_CONVERT_TYPE_HTML_TO_PPT = 2;      // ← Used for PPT export
  SESSION_FILE_CONVERT_TYPE_PPTX_TO_PNG = 3;      // Convert PPT to images
  SESSION_FILE_CONVERT_TYPE_MARKDOWN_TO_PDF = 4;  // MD → PDF
  SESSION_FILE_CONVERT_TYPE_MARKDOWN_TO_DOCX = 5; // MD → Word
}
```

## Conversion Status (Enum)

```protobuf
enum SessionFileConvertStatus {
  SESSION_FILE_CONVERT_STATUS_UNSPECIFIED = 0;
  SESSION_FILE_CONVERT_STATUS_PENDING = 1;
  SESSION_FILE_CONVERT_STATUS_CONVERTING = 2;
  SESSION_FILE_CONVERT_STATUS_SUCCESS = 3;
  SESSION_FILE_CONVERT_STATUS_FAILED = 4;
}
```

---

## Protobuf Message Structures

### CreateSessionFileConvertTaskRequest

```protobuf
message CreateSessionFileConvertTaskRequest {
  string session_uid = 1;           // Session identifier
  string session_id = 2;            // Alternative session ID
  SessionFileConvertType convert_type = 3;  // PDF or PPT
  // Additional fields for source data
}
```

### CreateSessionFileConvertTaskResponse

```protobuf
message CreateSessionFileConvertTaskResponse {
  string task_id = 1;               // Task ID for polling
  SessionFileConvertStatus status = 2;  // Initial status
}
```

### LoopSessionFileConvertTaskRequest

```protobuf
message LoopSessionFileConvertTaskRequest {
  string task_id = 1;               // Task to poll
}
```

### LoopSessionFileConvertTaskResponse

```protobuf
message LoopSessionFileConvertTaskResponse {
  string download_url = 1;          // Presigned S3 URL when complete
  SessionFileConvertStatus status = 2;  // Current status
  string cdn_url = 3;               // CDN URL for the file
  string file_url = 4;              // Alternative file URL
}
```

---

## Local Metadata Files

### Version Record Structure

The tool reads from `.slide-versions.json`:

```go
type slideVersionRecord struct {
    VersionID  string `json:"version_id"`
    SlidesURI  string `json:"slides_uri"`
    // Additional metadata fields
}
```

**File Location Resolution:**
1. `$HOME/.manus/.slide-versions.json` (primary)
2. `/opt/.manus/.slide-versions.json` (fallback)

### Example .slide-versions.json

```json
{
  "abc123def456": {
    "version_id": "abc123def456",
    "slides_uri": "manus-slides://abc123def456",
    "name": "My Presentation",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  INPUT: manus-slides://{version_id} pdf|ppt                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  1. validate_slides_uri_scheme                               │
│     - Must start with "manus-slides://"                      │
│     - URI cannot be empty                                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. extract_version_id                                       │
│     - Parse version_id from URI                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  3. validate_export_type                                     │
│     - Only "pdf", "ppt", or "pptx" allowed                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  4. load_version_record                                      │
│     - Read ~/.manus/.slide-versions.json                     │
│     - Find record matching version_id                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  5. request_conversion (CreateSessionFileConvertTask)        │
│     POST https://api.manus.im/session.v1.SessionPublicService│
│         /CreateSessionFileConvertTask                        │
│     Body:                                                    │
│       - session_uid: from version record                     │
│       - convert_type: HTML_TO_PDF or HTML_TO_PPT             │
│     Response:                                                │
│       - task_id: for polling                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Poll Loop (LoopSessionFileConvertTask)                   │
│     POST .../LoopSessionFileConvertTask                      │
│     Body: { task_id: "..." }                                 │
│                                                              │
│     Status Transitions:                                      │
│       PENDING → CONVERTING → SUCCESS/FAILED                  │
│                                                              │
│     On SUCCESS: get download_url                             │
│     On FAILED: return error                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │ SUCCESS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  7. download_converted_file                                  │
│     - Download from presigned S3 URL                         │
│     - Save to local file                                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  OUTPUT: Generated file: {name}.pdf or {name}.pptx           │
└─────────────────────────────────────────────────────────────┘
```

---

## Required Configuration

### Environment Variables

File: `~/.manus/.env`
```bash
BIZSERVER_HOST=api.manus.im
BIZSERVER_TOKEN=your-auth-token
SANDBOX_ID=your-sandbox-id
```

### Sandbox Token

File: `~/.manus/secrets/sandbox_api_token`
```
your-sandbox-api-token
```

### Host ID

File: `/opt/.manus/.host_id`
```
unique-host-identifier
```

---

## CLI Interface

```bash
# Usage
manus-export-slides <slides_uri> <format>

# Examples
manus-export-slides manus-slides://abc123 pdf
manus-export-slides manus-slides://abc123 ppt
manus-export-slides manus-slides://abc123 pptx
```

**Description from binary:**
> Convert Manus Slides to a specific format
> Fetch slides from a manus-slides:// URI and export them to the requested format (PDF or PPT)

---

## Error Messages

### URI Validation Errors

| Error | Cause |
|-------|-------|
| `slides URI must start with manus-slides://` | Invalid URI scheme |
| `slides URI cannot be empty` | Empty version_id in URI |
| `slides not present` | Slides need to be presented first using `slide_present` tool |

### Export Validation Errors

| Error | Cause |
|-------|-------|
| `unsupported export format: %s (only pdf, ppt, or pptx are supported)` | Invalid format argument |

### Configuration Errors

| Error | Cause |
|-------|-------|
| `Environment file not found` | Missing `~/.manus/.env` |
| `failed to read sandbox token file %s: %w` | Missing token file |
| `empty BizServerConfig.Host` | No BIZSERVER_HOST in .env |
| `empty BizServerConfig.Token` | No BIZSERVER_TOKEN in .env |

### Conversion Errors

| Error | Cause |
|-------|-------|
| `failed to load version record: %w` | Can't read .slide-versions.json |
| `failed to parse versions file: %w` | Invalid JSON in versions file |
| `failed to convert HTML to PDF: %w` | Server-side conversion failed |
| `received nil response from conversion API` | API returned empty response |
| `conversion URL is empty` | No download URL in response |
| `failed to download converted file: %w` | Download failed |
| `slides conversion failed: %w` | Generic conversion error |

---

## Session File Types (Related Enums)

```protobuf
enum SessionFileType {
  SESSION_FILE_TYPE_UNSPECIFIED = 0;
  SESSION_FILE_TYPE_FILE = 1;
  SESSION_FILE_TYPE_IMAGE = 2;
  SESSION_FILE_TYPE_SLIDE = 3;
  SESSION_FILE_TYPE_WEBDEV = 4;
  SESSION_FILE_TYPE_WEBSITE = 5;
}

enum SessionFileStage {
  SESSION_FILE_STAGE_UNSPECIFIED = 0;
  SESSION_FILE_STAGE_PROCESS = 1;
  SESSION_FILE_STAGE_PRODUCT = 2;
}

enum SessionFileEditor {
  SESSION_FILE_EDITOR_UNSPECIFIED = 0;
  SESSION_FILE_EDITOR_AI = 1;
  SESSION_FILE_EDITOR_USER_OWNER = 2;
  SESSION_FILE_EDITOR_USER_COLLABORATOR = 3;
}
```

---

## S3 Storage Details

The conversion uses S3 for intermediate storage:

```protobuf
message SourceS3Info {
  string source_s3_key = 1;      // S3 object key
  string source_s3_bucket = 2;   // S3 bucket name
  string source_s3_url = 3;      // Full S3 URL
}
```

Output is delivered via:
- `download_url` - Presigned S3 URL (temporary, expires)
- `cdn_url` - CDN URL (persistent)
- `file_url` - Alternative file access URL

---

## Console Output Examples

### Successful Conversion

```
Starting conversion: manus-slides://abc123 -> pdf
Export format: pdf
Generated file: my-presentation.pdf
```

### Error Output

```
[Error] failed to load version record: file not found
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
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

Errors are reported with context including:
- Session UID
- Conversion type
- Error details

---

## Security Notes

1. **Authentication required** - Needs valid BizServer token + Sandbox token
2. **Presigned URLs** - Download URLs are temporary and expire
3. **Local metadata** - Requires `.slide-versions.json` with session data
4. **No offline mode** - All conversion happens server-side

---

## Limitations

1. **Platform-Specific** - Requires Manus platform access
2. **Server-Side Only** - Cannot work offline
3. **Format Support** - Limited to PDF and PPT/PPTX
4. **Requires Metadata** - Needs `.slide-versions.json` file
5. **Requires Presentation** - Slides must be "presented" first via `slide_present` tool

---

## Usage via Docker

```bash
docker run --rm \
    -v "$(pwd)/manus-export-slides:/app/manus-export-slides" \
    -v "$HOME/.manus:/root/.manus:ro" \
    -v "$(pwd):/data" \
    -w /data \
    --platform linux/amd64 \
    alpine:latest \
    /app/manus-export-slides "manus-slides://your-version-id" pdf
```

---

## See Also

- [MANUS_CLI_README.md](MANUS_CLI_README.md) - General usage guide
- [MANUS_BINARY_ANALYSIS.md](MANUS_BINARY_ANALYSIS.md) - Full binary analysis
- [MANUS_TOOLS_SUMMARY.md](MANUS_TOOLS_SUMMARY.md) - All tools overview
- [MANUS_UPLOAD_FILE_ENV.md](MANUS_UPLOAD_FILE_ENV.md) - Environment configuration
