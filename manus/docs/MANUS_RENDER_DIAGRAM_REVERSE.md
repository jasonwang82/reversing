# manus-render-diagram - Reverse Engineering Documentation

## Overview

**Purpose:** Render diagram files to PNG format  
**Source Package:** `gitlab.monica.cn/vida/manus-sandbox` (inferred)  
**Binary Size:** 12,533,944 bytes  
**Runtime Requirements:** 
- Chrome/Chromium (for Mermaid/Markdown rendering)
- `d2` CLI (for D2 diagrams, optional)
- Java + PlantUML JAR (for PlantUML diagrams, optional)

---

## Supported Formats

| Extension | Format | Rendering Engine |
|-----------|--------|------------------|
| `.mmd` | Mermaid | Mermaid.js 10.6.1 (Chrome) |
| `.d2` | D2 | d2 CLI command |
| `.md` | Markdown with Mermaid | Mermaid.js (Chrome) |
| `.puml` | PlantUML | PlantUML Java JAR |

---

## Architecture

```
                         ┌──────────────────────────────────────────────┐
                         │              manus-render-diagram             │
                         └──────────────────────────────────────────────┘
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              ▼                               ▼                               ▼
┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│  Mermaid (.mmd/.md)  │       │  D2 (.d2)            │       │  PlantUML (.puml)    │
├──────────────────────┤       ├──────────────────────┤       ├──────────────────────┤
│  - Load in Chrome    │       │  - d2 CLI command    │       │  - Java JAR          │
│  - Render SVG        │       │  - Native rendering  │       │  - Graphviz (DOT)    │
│  - Screenshot PNG    │       │  - Output PNG        │       │  - Output PNG        │
└──────────────────────┘       └──────────────────────┘       └──────────────────────┘
              │                               │                               │
              └───────────────────────────────┼───────────────────────────────┘
                                              ▼
                                       ┌─────────────┐
                                       │  output.png │
                                       └─────────────┘
```

---

## CLI Usage

```bash
# Direct usage (requires Chrome/Chromium on system for Mermaid)
manus-render-diagram diagram.mmd output.png

# Different formats
manus-render-diagram flowchart.d2 output.png    # requires d2 CLI
manus-render-diagram sequence.puml output.png   # requires Java + PlantUML JAR
manus-render-diagram document.md output.png     # requires Chrome

# For local development, run-manus.sh provides a Docker wrapper
./manus-render-diagram.sh diagram.mmd output.png
```

**Note:** The binary uses `chromedp` to control Chrome via Chrome DevTools Protocol (CDP) for Mermaid/Markdown rendering. D2 and PlantUML use their respective CLI tools directly. No Docker is used internally.

---

## Mermaid Rendering (.mmd / .md)

### Template
Uses `templates/mmd2png.html` template:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mermaid Renderer</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/contrib/auto-render.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
</head>
<body>
    <div class="mermaid">{{.MermaidCode}}</div>
    <script>
        // Initialize and render with error handling
        mermaid.initialize({ startOnLoad: false });
        // ... rendering logic
        window.mermaidRenderComplete = true;
    </script>
</body>
</html>
```

### Mermaid Rendering Logic
```javascript
const mermaidElements = document.querySelectorAll('.mermaid');
for (let i = 0; i < mermaidElements.length; i++) {
    const element = mermaidElements[i];
    const mermaidCode = element.textContent.trim();
    try {
        const { svg } = await mermaid.render('mermaid-diagram-' + i, mermaidCode);
        element.innerHTML = svg;
        console.log('Mermaid diagram ' + (i + 1) + ' rendered successfully');
    } catch (error) {
        console.error('Mermaid rendering error for diagram ' + (i + 1) + ':', error);
        element.innerHTML = '<div class="mermaid-error">...</div>';
        document.body.classList.add('mermaid-render-failed');
    }
}
window.mermaidHasError = hasError;
window.mermaidRenderComplete = true;
```

### Markdown Mermaid Pattern
Extracts Mermaid from Markdown code blocks:
```go
// Regex pattern
(?s)<pre><code class="language-mermaid">(.*?)</code></pre>
```

### Screenshot Capture
- Uses `Page.captureScreenshot` via Chrome DevTools Protocol
- Waits for `window.mermaidRenderComplete = true`

---

## D2 Rendering (.d2)

### Dependency
Requires `d2` command-line tool from [d2lang.com](https://d2lang.com).

### Error Handling
```
d2 command not found
error rendering D2 diagram: %s
```

### Installation Hint
```bash
You can install it with: curl -fsSL https://d2lang.com/install.sh | sh -s --
```

---

## PlantUML Rendering (.puml)

### Dependency
Requires Java and PlantUML JAR file.

### JAR Location
```
/usr/local/bin/plantuml-1.2025.4.jar
```

### Error Handling
```
PlantUML jar file not found at %s
Failed to get home directory: %v
error rendering PlantUML diagram: %s
```

### Installation Hints
```bash
# Java requirement
Please install Java first by running:

# PlantUML JAR download
Please install the PlantUML jar file by running:
sudo wget -O /usr/local/bin/plantuml-1.2025.4.jar https://github.com/plantuml/plantuml/releases/download/v1.2025.4/plantuml-1.2025.4.jar

# Graphviz requirement (for DOT diagrams)
Graphviz is required to render PlantUML diagrams.
sudo apt update && sudo apt install -y graphviz
```

---

## Chrome Configuration

### Browser Flags
```
--headless
--no-sandbox
--no-first-run
--disable-popup-blocking
--disable-default-apps
--disable-hang-monitor
--disable-prompt-on-repost
--disable-sync
--disable-extensions
--disable-dev-shm-usage
--disable-ipc-flooding-protection
--disable-background-networking
--disable-renderer-backgrounding
--disable-backgrounding-occluded-windows
--disable-client-side-phishing-detection
--no-default-browser-check
--enable-automation
--use-mock-keychain
--force-color-profile
--metrics-recording-only
--mute-audio
--user-data-dir=<temp>
--remote-debugging-port=0
```

### Chrome Search Paths
```
/usr/bin/google-chrome
/usr/bin/google-chrome-stable
/usr/bin/google-chrome-beta
/usr/bin/google-chrome-unstable
/snap/bin/chromium
/usr/local/bin/chrome
```

---

## Image Processing

Uses `github.com/disintegration/imaging` for image operations:

```go
// Image resizing
Resizing image from %dx%d to %dx%d (scale: %.2f)
Warning: Failed to resize image %s: %v
Failed to resize image

// Image metrics
Image '%s' original size: %dx%d pixels
```

---

## Debug Mode

Environment variables:
- `md_to_png_debug_files` - Keep intermediate files

Debug files:
- `render-diagram.log` - Log file

---

## Progress Messages

```
[PROGRESS] Starting Mermaid diagram rendering...
[PROGRESS] Starting PlantUML diagram rendering...
[PROGRESS] Starting Markdown to PNG conversion...
[PROGRESS] Generating PNG...
```

---

## Error Messages

| Error | Cause |
|-------|-------|
| `input file not found: %s` | Input file doesn't exist |
| `failed to read mermaid file: %w` | File read error |
| `failed to get absolute path: %w` | Path resolution error |
| `failed to create output directory: %w` | Output path error |
| `failed to write temp HTML file: %w` | Temp file creation |
| `failed to generate HTML from template` | Template error |
| `failed to capture screenshot: %w` | Chrome screenshot error |
| `failed to save PNG file: %w` | Output file error |
| `failed to move generated PNG: %w` | File move error |
| `failed to get element bounds: %w` | DOM query error |
| `mermaid rendering failed: %s` | Mermaid JS error |
| `d2 command not found` | D2 not installed |
| `error rendering D2 diagram: %s` | D2 execution error |
| `PlantUML jar file not found at %s` | JAR missing |
| `error rendering PlantUML diagram: %s` | PlantUML error |
| `Failed to open image %s: %w` | Image processing error |
| `Could not compute box model.` | DOM element bounds error |
| `Render process gone.` | Chrome crash |
| `page load error %s` | Chrome page loading error |

---

## Go Dependencies

| Package | Purpose |
|---------|---------|
| `github.com/gomarkdown/markdown` | Markdown parser (for .md files) |
| `github.com/chromedp/chromedp` | Chrome DevTools Protocol client |
| `github.com/chromedp/cdproto` | CDP protocol bindings |
| `github.com/disintegration/imaging` | Image processing/resizing |
| `github.com/spf13/cobra` | CLI framework |
| `github.com/spf13/pflag` | Flag parsing |
| `github.com/getsentry/sentry-go` | Error tracking |
| `github.com/go-json-experiment/json` | JSON handling |

---

## Sentry Integration

```
DSN: https://962d173a894df4e4c23c744f8c39d6f3@sentry.butterflyotel.online/9
```

---

## Data Flow by Format

### Mermaid (.mmd)
```
diagram.mmd ──▶ Read file ──▶ Inject into mmd2png.html ──▶ Chrome render ──▶ Screenshot ──▶ output.png
```

### D2 (.d2)
```
diagram.d2 ──▶ d2 command ──▶ output.png
```

### PlantUML (.puml)
```
diagram.puml ──▶ java -jar plantuml.jar ──▶ output.png
```

### Markdown (.md)
```
document.md ──▶ Extract mermaid blocks ──▶ Render each ──▶ Screenshot ──▶ output.png
```

---

## Complete Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              manus-render-diagram                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   Input File ───┬──▶ Check extension                                                │
│                 │                                                                   │
│                 ├──▶ .mmd / .md ──────────────────────────┐                         │
│                 │    │                                     │                         │
│                 │    ▼                                     │                         │
│                 │    ┌──────────────────────────────────┐  │                         │
│                 │    │  templates/mmd2png.html          │  │                         │
│                 │    │  + Mermaid.js (10.6.1)           │  │                         │
│                 │    │  + KaTeX (0.16.25)               │  │                         │
│                 │    │  + Highlight.js (11.9.0)         │  │                         │
│                 │    └──────────────────────────────────┘  │                         │
│                 │    │                                     │                         │
│                 │    ▼                                     │                         │
│                 │    Headless Chrome                       │                         │
│                 │    │                                     │                         │
│                 │    ▼                                     │                         │
│                 │    Page.captureScreenshot ───────────────┼──────────▶ output.png   │
│                 │                                          │                         │
│                 ├──▶ .d2 ─────────────────────────────────┤                         │
│                 │    │                                     │                         │
│                 │    ▼                                     │                         │
│                 │    d2 command (native) ──────────────────┼──────────▶ output.png   │
│                 │                                          │                         │
│                 └──▶ .puml ───────────────────────────────┤                         │
│                      │                                     │                         │
│                      ▼                                     │                         │
│                      java -jar plantuml-1.2025.4.jar ──────┼──────────▶ output.png   │
│                                                            │                         │
│                      (Optional: Image resizing via         │                         │
│                       disintegration/imaging)              │                         │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## External Tool Requirements

| Format | Tool Required | Installation |
|--------|---------------|--------------|
| Mermaid | Chrome/Chromium | Pre-installed in Docker image |
| D2 | d2 CLI | `curl -fsSL https://d2lang.com/install.sh \| sh` |
| PlantUML | Java + JAR | Download from GitHub releases |
| PlantUML (DOT) | Graphviz | `apt install graphviz` |

---

## Success Messages

```
Successfully rendered Mermaid diagram to: %s
Successfully rendered PlantUML diagram to: %s
Removed intermediate HTML file: %s
```

---

## See Also

- [MANUS_MD_TO_PDF_REVERSE.md](MANUS_MD_TO_PDF_REVERSE.md) - Markdown to PDF conversion
- [MANUS_TOOLS_SUMMARY.md](MANUS_TOOLS_SUMMARY.md) - Complete tools overview
- [MANUS_CLI_README.md](MANUS_CLI_README.md) - Usage guide
