# Manus CLI Tools - Reverse Engineering

This directory contains reverse-engineered documentation and binaries for the Manus CLI tools.

## Directory Structure

```
manus/
├── README.md                 # This file
├── binaries/                 # Original ELF binaries (Linux x86-64)
│   ├── manus-export-slides
│   ├── manus-mcp-cli
│   ├── manus-md-to-pdf
│   ├── manus-render-diagram
│   ├── manus-speech-to-text
│   └── manus-upload-file
├── docs/                     # Reverse engineering documentation
│   ├── MANUS_TOOLS_SUMMARY.md        # Complete overview (start here)
│   ├── MANUS_BINARY_ANALYSIS.md      # Binary analysis methodology
│   ├── MANUS_CLI_README.md           # Usage guide
│   ├── MANUS_EXPORT_SLIDES_REVERSE.md
│   ├── MANUS_MCP_CLI_REVERSE.md
│   ├── MANUS_MD_TO_PDF_REVERSE.md
│   ├── MANUS_RENDER_DIAGRAM_REVERSE.md
│   ├── MANUS_SPEECH_TO_TEXT_REVERSE.md
│   ├── MANUS_UPLOAD_FILE_REVERSE.md
│   └── MANUS_UPLOAD_FILE_ENV.md
├── browser_init_result.md         # Browser mode analysis
├── mode_switching_tools_analysis.md
├── tool_schemas.json              # Tool JSON schemas
├── transition_results_*.md        # Mode transition results
└── ...
```

## Tools Overview

| Tool | Works Locally | Purpose |
|------|---------------|---------|
| `manus-md-to-pdf` | ✅ Yes | Convert Markdown to PDF (Chrome headless) |
| `manus-render-diagram` | ✅ Yes | Render .mmd/.d2/.puml/.md to PNG |
| `manus-speech-to-text` | ❌ No | Transcribe audio via OpenAI Whisper |
| `manus-export-slides` | ❌ No | Export Manus slides to PDF/PPT |
| `manus-upload-file` | ❌ No | Upload files to S3 via BizServer |
| `manus-mcp-cli` | ❌ No | MCP client with OAuth 2.1 |

## Quick Start

### Local Tools (No Auth Needed)

These require Chrome/Chromium installed on the system:

```bash
# Markdown to PDF
./binaries/manus-md-to-pdf input.md output.pdf

# Render Mermaid diagram to PNG  
./binaries/manus-render-diagram flowchart.mmd output.png

# Render D2 diagram (requires d2 CLI)
./binaries/manus-render-diagram arch.d2 output.png

# Render PlantUML (requires Java + plantuml.jar)
./binaries/manus-render-diagram seq.puml output.png
```

### Remote Tools (Auth Required)

These require Manus platform credentials and won't work without them.

## Key Findings

### Technology Stack
- **Language:** Go (statically linked ELF binaries)
- **Chrome Control:** `chromedp` via Chrome DevTools Protocol
- **API Protocol:** Connect-RPC (gRPC-compatible)
- **Error Tracking:** Sentry

### CDN Resources (md-to-pdf, render-diagram)
- Mermaid.js 10.6.1
- KaTeX 0.16.25
- Highlight.js 11.9.0

### External Dependencies
- Chrome/Chromium (for Mermaid rendering)
- `d2` CLI from d2lang.com (for D2 diagrams)
- Java + PlantUML JAR (for PlantUML diagrams)

## Documentation

Start with [docs/MANUS_TOOLS_SUMMARY.md](docs/MANUS_TOOLS_SUMMARY.md) for a complete overview.

For individual tool details, see the corresponding `*_REVERSE.md` files.
