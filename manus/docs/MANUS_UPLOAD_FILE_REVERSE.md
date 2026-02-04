# manus-upload-file - Reverse Engineered Documentation

## Overview

`manus-upload-file` uploads files to S3 via the Manus BizServer API and returns public CDN URLs. It requests presigned URLs from the API, uploads files directly to S3, and provides CDN URLs for access.

**Source Package:** `gitlab.monica.cn/vida/manus-sandbox/sbx-go-svc/packages/shared/pkg/bizserver/file_svc`

**SDK:** `gitlab.monica.cn/vida/sdk/bizserver-go.git/file/v1`

**Build:** `cb27e3aa (May 26th, 2020)`

---

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/file.v1.FileService/SignUrl` | Get presigned URL for single file |
| `/file.v1.FileService/BatchSignUrl` | Get presigned URLs for multiple files |
| `/file.v1.FileService/SandboxSignUrl` | Get presigned URL in sandbox context |

---

## Protobuf Message Structures

### SignUrlRequest

```protobuf
message SignUrlRequest {
  string filename = 1;           // Original filename
  PreSignModule module = 2;      // Upload module/category
  // Additional fields
}
```

### SignUrlResponse

```protobuf
message SignUrlResponse {
  string pre_sign_url = 1;       // Presigned S3 upload URL
  string object_url = 2;         // S3 object URL
  string cdn_url = 3;            // Public CDN URL
}
```

### BatchSignUrlRequest

```protobuf
message BatchSignUrlRequest {
  repeated SignUrlRequest urls = 1;  // Multiple file requests
}
```

### BatchSignUrlResponse

```protobuf
message BatchSignUrlResponse {
  repeated SignUrlResponse sign_url_list = 1;  // Multiple responses
}
```

### SandboxSignUrlRequest

```protobuf
message SandboxSignUrlRequest {
  string filename = 1;           // Original filename
  PreSignModule module = 2;      // Upload module
  string sdtoken = 3;            // Sandbox token
}
```

### SandboxSignUrlResponse

```protobuf
message SandboxSignUrlResponse {
  string pre_sign_url = 1;       // Presigned S3 upload URL
  string cdn_url = 3;            // Public CDN URL
}
```

---

## Enums

### PreSignModule

Defines the upload category/destination:

```protobuf
enum PreSignModule {
  PRE_SIGN_MODULE_UNSPECIFIED = 0;
  PRE_SIGN_MODULE_ANONYMOUS = 1;       // Anonymous uploads
  PRE_SIGN_MODULE_MARKDOWN = 2;        // Markdown file assets
  PRE_SIGN_MODULE_SESSION_FILE = 3;    // Session attachments
  PRE_SIGN_MODULE_SLIDE_IMAGE = 4;     // Slide images
  PRE_SIGN_MODULE_SLIDE_TEMPLATE = 5;  // Slide templates
  PRE_SIGN_MODULE_WEB_DEV_LOGO = 6;    // Web dev logos
}
```

### AdminPreSignModule

Admin-specific upload categories:

```protobuf
enum AdminPreSignModule {
  ADMIN_PRE_SIGN_MODULE_UNSPECIFIED = 0;
  ADMIN_PRE_SIGN_MODULE_MATERIALS = 1; // Admin materials
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  INPUT: File path                                            │
│  Example: ./image.png                                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  1. validate_file_exists                                     │
│     - Check file exists                                      │
│     - Verify it's a file, not directory                      │
│     - Get file info (size, name)                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. get_file_info                                            │
│     - Read file size                                         │
│     - Extract filename                                       │
│     - Determine content type                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  3. new_bizserver_client                                     │
│     - Load config from ~/.manus/.env                         │
│     - Read sandbox token                                     │
│     - Create Connect-RPC client                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  4. get_presigned_url (SandboxSignUrl API)                   │
│     POST https://api.manus.im/file.v1.FileService/           │
│         SandboxSignUrl                                       │
│     Request:                                                 │
│       - filename: "image.png"                                │
│       - module: PRE_SIGN_MODULE_SESSION_FILE                 │
│       - sdtoken: <sandbox_api_token>                         │
│     Response:                                                │
│       - pre_sign_url: S3 presigned PUT URL                   │
│       - cdn_url: Public CDN URL                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  5. upload_file_to_s3                                        │
│     PUT <pre_sign_url>                                       │
│     Headers:                                                 │
│       - Content-Type: <detected_mime_type>                   │
│       - Content-Length: <file_size>                          │
│     Body: <file_contents>                                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Output CDN URL                                           │
│     CDN URL: https://cdn.example.com/path/to/image.png       │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

### Environment File

**Path:** `~/.manus/.env` or `/root/.env` (in container)

```bash
# BizServer Configuration
BIZSERVER_HOST=api.manus.im
BIZSERVER_TOKEN=your-bizserver-authentication-token
SANDBOX_ID=your-sandbox-identifier
```

### Sandbox Token File

**Path:** `~/.manus/secrets/sandbox_api_token` or `/root/.secrets/sandbox_api_token`

```
your-sandbox-api-token-here
```

### Host ID

**Path:** `/opt/.manus/.host_id`

```
unique-host-identifier
```

---

## CLI Usage

```bash
# Basic usage
manus-upload-file <file_path>

# Examples
manus-upload-file ./image.png
manus-upload-file /path/to/document.pdf
manus-upload-file ./screenshot.jpg
```

---

## Console Output

### Successful Upload

```
Uploading file: image.png (size: 12345 bytes)
CDN URL: https://cdn.manus.im/files/abc123/image.png
```

### Error Output

```
[Error] failed to upload file: context deadline exceeded
```

---

## Error Messages

### File Errors

| Error | Cause |
|-------|-------|
| `path is a directory, not a file: %s` | Provided path is a directory |
| `file does not exist` | File not found at path |
| `file already exists` | Conflict (shouldn't occur for uploads) |
| `permission denied` | Cannot read file |

### Configuration Errors

| Error | Cause |
|-------|-------|
| `Environment file not found` | Missing ~/.manus/.env |
| `empty BizServerConfig.Host` | No BIZSERVER_HOST in .env |
| `empty BizServerConfig.Token` | No BIZSERVER_TOKEN in .env |
| `sandbox token file is empty` | Token file exists but empty |
| `failed to load bizserver config: %w` | Config loading failed |

### API Errors

| Error | Cause |
|-------|-------|
| `empty CDN URL in response` | API returned no CDN URL |
| `failed to upload file: %w` | Upload to S3 failed |
| `Upload timeout: %v` | Upload timed out |
| `unauthenticated` | Invalid credentials |
| `permission_denied` | Not authorized |

---

## Supported Content Types

The tool auto-detects MIME types based on file extension:

| Extension | Content Type |
|-----------|--------------|
| `.png` | `image/png` |
| `.jpg`, `.jpeg` | `image/jpeg` |
| `.gif` | `image/gif` |
| `.webp` | `image/webp` |
| `.avif` | `image/avif` |
| `.pdf` | `application/pdf` |
| `.json` | `application/json` |
| `.mp3` | `audio/mpeg` |
| `.wav` | `audio/wave` |
| `.webm` | `video/webm` |
| `.mp4` | `video/mp4` |
| (other) | `application/octet-stream` |

---

## Docker Usage

```bash
# Run with Docker (required for macOS/ARM)
docker run --rm \
    -v "$(pwd)/manus-upload-file:/usr/local/bin/manus-upload-file" \
    -v "$(pwd):/data" \
    -v "$HOME/.manus/.env:/root/.env:ro" \
    -v "$HOME/.manus/secrets:/root/.secrets:ro" \
    -w /data \
    --platform linux/amd64 \
    alpine:latest \
    /usr/local/bin/manus-upload-file /data/image.png
```

### Using the Enhanced Wrapper

```bash
# Setup (one-time)
./setup-manus-env-example.sh ~/.manus

# Edit credentials
nano ~/.manus/.env
nano ~/.manus/secrets/sandbox_api_token

# Upload file
./run-manus-with-env.sh ~/.manus manus-upload-file image.png
```

---

## Internal Functions

| Function | Purpose |
|----------|---------|
| `validate_file_exists` | Check file exists and is not directory |
| `get_file_info` | Get file size and metadata |
| `new_bizserver_client` | Create API client |
| `get_presigned_url` | Request presigned URL from API |
| `upload_file_to_s3` | PUT file to S3 using presigned URL |

---

## Logging

Log file: `upload-file.log`

Sentry integration for error tracking:
```
DSN: https://962d173a894df4e4c23c744f8c39d6f3@sentry.butterflyotel.online/9
```

---

## S3 Upload Process

### Presigned URL Structure

The presigned URL contains:
- S3 bucket endpoint
- Object key (path)
- Signature parameters (AWSAccessKeyId, Signature, Expires)
- Content-Type constraint

### Upload Request

```http
PUT <presigned_url>
Host: s3.amazonaws.com
Content-Type: image/png
Content-Length: 12345

<binary file data>
```

### Response

On success, S3 returns HTTP 200 with empty body.
The tool then outputs the CDN URL from the original API response.

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

## Security Notes

1. **Presigned URLs** - Time-limited, single-use upload URLs
2. **Sandbox Token** - Required for sandbox-specific uploads
3. **CDN URLs** - Public, no authentication required
4. **Credential Files** - Should be chmod 600

---

## Limitations

1. **Requires Platform Access** - Needs Manus BizServer credentials
2. **Single File** - Uploads one file at a time
3. **File Size** - S3 presigned URLs may have size limits
4. **Network Required** - Needs API and S3 connectivity

---

## Integration with Other Tools

The CDN URL returned can be used with:
- `manus-mcp-cli` - For MCP tool inputs
- `manus-export-slides` - For slide assets
- Manus AI Agent - For file references in conversations

---

## See Also

- [MANUS_UPLOAD_FILE_ENV.md](MANUS_UPLOAD_FILE_ENV.md) - Environment setup details
- [MANUS_CLI_README.md](MANUS_CLI_README.md) - General usage guide
- [MANUS_BINARY_ANALYSIS.md](MANUS_BINARY_ANALYSIS.md) - Full binary analysis
- [MANUS_TOOLS_SUMMARY.md](MANUS_TOOLS_SUMMARY.md) - All tools overview
