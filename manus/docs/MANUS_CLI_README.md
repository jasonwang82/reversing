# Manus CLI Tools - Local Usage Guide

## Overview

These are Linux x86-64 binaries that can be run locally on macOS (including Apple Silicon) using Docker. A wrapper script (`run-manus.sh`) handles the Docker execution automatically.

## Available Tools

| Tool | Description |
|------|-------------|
| `manus-md-to-pdf` | Convert Markdown to PDF |
| `manus-render-diagram` | Render diagrams (.mmd, .d2, .puml) or Markdown to PNG |
| `manus-export-slides` | Export manus-slides:// URIs to PDF or PPT |
| `manus-speech-to-text` | Transcribe audio/video files to text |
| `manus-upload-file` | Upload files to S3 and get public URLs |
| `manus-mcp-cli` | Comprehensive MCP (Model Context Protocol) server management |

## Prerequisites

- Docker must be installed and running
- Sufficient disk space for Docker images (~500MB for Chrome-enabled tools)

## Setup

The tools are already set up with convenience wrappers:

```bash
# Use the .sh wrappers (recommended)
./manus-md-to-pdf.sh input.md output.pdf
./manus-render-diagram.sh diagram.mmd diagram.png

# Or use the wrapper directly
./run-manus.sh manus-md-to-pdf input.md output.pdf
```

## Usage Examples

### 1. Markdown to PDF

```bash
./manus-md-to-pdf.sh README.md README.pdf
```

Creates a formatted PDF from your Markdown file.

### 2. Render Diagrams

**Mermaid:**
```bash
./manus-render-diagram.sh flowchart.mmd flowchart.png
```

**D2:**
```bash
./manus-render-diagram.sh architecture.d2 architecture.png
```

**PlantUML:**
```bash
./manus-render-diagram.sh sequence.puml sequence.png
```

### 3. Speech to Text

```bash
./manus-speech-to-text.sh meeting-recording.mp3
```

Transcribes audio/video files. Large files are automatically compressed to 64kbps audio.

### 4. Upload Files

```bash
./manus-upload-file.sh image.png
```

Uploads to S3 and returns a public URL for use with MCP and APIs.

### 5. MCP Server Management

```bash
# List available commands
./manus-mcp-cli.sh --help

# Manage servers
./manus-mcp-cli.sh server list
./manus-mcp-cli.sh server add my-server

# Execute tools
./manus-mcp-cli.sh tool list
./manus-mcp-cli.sh tool execute tool-name

# Work with resources
./manus-mcp-cli.sh resource list
./manus-mcp-cli.sh resource read resource-uri

# Prompts
./manus-mcp-cli.sh prompt list
./manus-mcp-cli.sh prompt get prompt-name

# OAuth authentication
./manus-mcp-cli.sh auth login
./manus-mcp-cli.sh auth status
```

### 6. Export Slides

```bash
./manus-export-slides.sh "manus-slides://{version_id}" pdf
./manus-export-slides.sh "manus-slides://{version_id}" ppt
```

## How It Works

The `run-manus.sh` wrapper:

1. Detects which tool you're calling
2. Selects appropriate Docker image:
   - `zenika/alpine-chrome:with-node` for tools needing Chrome (md-to-pdf, render-diagram)
   - `alpine:latest` for other tools
3. Mounts your current directory as `/data` (working directory)
4. Mounts the tools directory as `/workspace`
5. Executes the binary with your arguments

## File Path Handling

- All paths are relative to your **current directory** when running the command
- Input files must be in or relative to your current directory
- Output files are written to your current directory (or specified path)

Example:
```bash
cd ~/Documents
./path/to/manus-md-to-pdf.sh report.md report.pdf
# Reads ~/Documents/report.md
# Writes ~/Documents/report.pdf
```

## Tested Features

✅ Markdown to PDF conversion (verified)
✅ Mermaid diagram rendering (verified)
⏳ D2 diagrams (not tested)
⏳ PlantUML diagrams (not tested)
⏳ Speech to text (not tested - may require API keys)
⏳ File upload (not tested - requires S3 credentials)
⏳ MCP CLI features (not tested - requires MCP servers)

## Troubleshooting

### "cannot execute binary file"
The binaries are Linux x86-64. Always use the wrapper scripts, not the binaries directly.

### "Image not found" errors
First run will download Docker images. This is normal and only happens once.

### "Permission denied"
```bash
chmod +x run-manus.sh manus-*.sh
```

### Docker not running
```bash
# Start Docker Desktop or run:
open -a Docker
```

### File not found in container
Make sure you're in the correct directory. The container sees your **current directory**, not the directory where the tools are located.

## Advanced: Adding to PATH

To use these tools from anywhere:

```bash
# Add to your ~/.zshrc or ~/.bashrc
export PATH="$PATH:/Users/m1a1/Developer/.throwaways"

# Or create aliases
alias manus-md-to-pdf='/Users/m1a1/Developer/.throwaways/manus-md-to-pdf.sh'
alias manus-render-diagram='/Users/m1a1/Developer/.throwaways/manus-render-diagram.sh'
# ... etc
```

## Original Binaries

The original Linux binaries are:
- `manus-export-slides` (11M)
- `manus-mcp-cli` (11M)
- `manus-md-to-pdf` (12M)
- `manus-render-diagram` (12M)
- `manus-speech-to-text` (7.1M)
- `manus-upload-file` (8.9M)

Source: `~/Downloads/manus_cli_binaries.zip`

## Notes

- These tools appear to be part of a larger "Manus" platform/service
- Some features may require API keys or authentication
- The MCP CLI seems to be for managing Model Context Protocol servers
- File upload likely requires S3 credentials to be configured

---

## Special Configuration: manus-upload-file

The `manus-upload-file` tool requires additional environment configuration to authenticate with the Manus BizServer API.

### Required Files

1. **`.env`** - Environment variables file
2. **`secrets/sandbox_api_token`** - Your sandbox API token

### Setup

```bash
# 1. Create environment template
./setup-manus-env-example.sh ~/.manus

# 2. Edit the configuration files with your actual credentials
nano ~/.manus/.env
nano ~/.manus/secrets/sandbox_api_token

# 3. Use the enhanced wrapper
./run-manus-with-env.sh ~/.manus manus-upload-file image.png
```

### Required Environment Variables

In `~/.manus/.env`:
```bash
BIZSERVER_HOST=your-bizserver-host.com
BIZSERVER_TOKEN=your-bizserver-authentication-token
SANDBOX_ID=your-sandbox-identifier
```

In `~/.manus/secrets/sandbox_api_token`:
```
your-sandbox-api-token-here
```

### What It Does

1. Authenticates with the Manus BizServer API
2. Requests a presigned S3 URL for uploading
3. Uploads your file to S3
4. Returns a public CDN URL

### Note on Credentials

⚠️ **You need access to a Manus sandbox environment to use this tool.** The credentials are platform-specific and must be obtained from your Manus administrator.

See [MANUS_UPLOAD_FILE_ENV.md](MANUS_UPLOAD_FILE_ENV.md) for detailed configuration documentation.

