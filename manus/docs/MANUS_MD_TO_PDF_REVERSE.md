# manus-md-to-pdf - Reverse Engineering Documentation

## Overview

**Purpose:** Convert Markdown files to PDF using headless Chrome  
**Source Package:** `gitlab.monica.cn/vida/manus-sandbox` (inferred)  
**Binary Size:** 12,423,352 bytes  
**Runtime Requirement:** Chrome/Chromium installed on the system

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Markdown File  │────▶│  gomarkdown/     │────▶│  HTML Template   │────▶│  PDF Output │
│  (.md)          │     │  markdown        │     │  + CDN Resources │     │  (.pdf)     │
└─────────────────┘     └──────────────────┘     └────────┬─────────┘     └─────────────┘
                                                          │
                                                          ▼
                                             ┌───────────────────────────┐
                                             │  chromedp (CDP)           │
                                             │  - Load HTML              │
                                             │  - Execute JS             │
                                             │  - Page.printToPDF        │
                                             └───────────────────────────┘
```

---

## CLI Usage

```bash
# Direct usage (requires Chrome/Chromium on system)
manus-md-to-pdf input.md output.pdf

# For local development without Chrome installed,
# run-manus.sh provides a Docker wrapper using zenika/alpine-chrome:with-node
./manus-md-to-pdf.sh input.md output.pdf
```

**Note:** The binary uses `chromedp` to control Chrome via Chrome DevTools Protocol (CDP). It does NOT use Docker internally - Chrome must be installed on the host system (or in the same container if running in Docker).

---

## Processing Pipeline

### Step 1: Markdown Parsing
- Uses `github.com/gomarkdown/markdown`
- Converts Markdown AST to HTML

### Step 2: HTML Template Generation
- Injects HTML content into template
- Templates available:
  - `templates/md2pdf_default.html` - Default template
  - `templates/md2pdf_arabic.html` - RTL Arabic support

### Step 3: Resource Loading (CDN)
```html
<!-- Mermaid.js for diagrams -->
<script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>

<!-- KaTeX for math equations -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/contrib/auto-render.min.js"></script>

<!-- Highlight.js for code syntax -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css">
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
```

### Step 4: Chrome Rendering
- Uses `github.com/chromedp/chromedp` (Chrome DevTools Protocol)
- Launches headless Chrome
- Waits for Mermaid diagrams: `window.mermaidRenderComplete = true`
- Waits for KaTeX math rendering

### Step 5: PDF Generation
- Calls `Page.printToPDF` via CDP
- Configurable options for margins and paper size

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

## PDF Options (chromedp)

| Option | Description |
|--------|-------------|
| `WithPaperWidth` | Paper width in inches |
| `WithPaperHeight` | Paper height in inches |
| `WithMarginTop` | Top margin |
| `WithMarginBottom` | Bottom margin |
| `WithMarginLeft` | Left margin |
| `WithMarginRight` | Right margin |
| `WithLandscape` | Landscape orientation |
| `WithScale` | Scale factor |
| `WithPageRanges` | Specific pages |
| `GenerateTaggedPDF` | Accessibility tags |
| `GenerateDocumentOutline` | PDF outline/TOC |

---

## Mermaid Rendering

```javascript
// Initialize Mermaid with error handling
mermaid.initialize({ startOnLoad: false });

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
        element.innerHTML = '<div class="mermaid-error" style="color: red; border: 2px solid red; padding: 10px; border-radius: 5px; background: #ffeeee;">' +
            '<strong>Mermaid Rendering Error (Diagram ' + (i + 1) + '):</strong><br>' + ... '</div>';
        document.body.classList.add('mermaid-render-failed');
    }
}
window.mermaidHasError = hasError;
window.mermaidRenderComplete = true;
```

---

## Font Support

### Arabic Fonts
```css
"Amiri", "Scheherazade New", "Arial", sans-serif
```

### Font Stacks (Multi-language)
- **Arabic:** `"Noto Sans Arabic", "Amiri", "Tahoma", "Arial", sans-serif`
- **CJK (Chinese):** `"Noto Sans CJK SC", "WenQuanYi Zen Hei", "SimSun"`
- **Japanese:** `"Noto Sans JP", "Hiragino Sans", "Meiryo", "Yu Gothic"`
- **Korean:** `"Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo"`
- **Code:** `"Consolas", "Monaco", "Courier New", monospace`

---

## Image Handling

- Resolves relative image paths
- Resizes images if needed:
```
Resizing image from %dx%d to %dx%d (scale: %.2f)
Warning: Failed to resize image %s: %v
```
- Progress: `[PROGRESS] Resolving image paths...`

---

## Debug Mode

Environment variables for debugging:
- `md_to_pdf_debug_files` - Keep intermediate HTML files

Temp files:
- `md2pdf-*.html` - Intermediate HTML
- `md-to-pdf.log` - Log file

---

## Progress Messages

```
[PROGRESS] Starting Markdown to PDF conversion...
[PROGRESS] Converting markdown to HTML...
[PROGRESS] Resolving image paths...
[PROGRESS] Generating PDF...
```

---

## Error Messages

| Error | Cause |
|-------|-------|
| `failed to convert markdown to HTML: %w` | Markdown parsing error |
| `failed to convert HTML to PDF: %w` | Chrome/PDF generation error |
| `failed to generate HTML content` | Template processing error |
| `failed to write temp HTML file: %w` | Filesystem error |
| `failed to save PDF file: %w` | Output file error |
| `Failed to resolve image paths` | Image path resolution error |
| `mermaid rendering failed: %s` | Mermaid JS error |
| `page load error %s` | Chrome page loading error |

---

## Go Dependencies

| Package | Purpose |
|---------|---------|
| `github.com/gomarkdown/markdown` | Markdown parser |
| `github.com/chromedp/chromedp` | Chrome DevTools Protocol client |
| `github.com/chromedp/cdproto` | CDP protocol bindings |
| `github.com/spf13/cobra` | CLI framework |
| `github.com/spf13/pflag` | Flag parsing |
| `github.com/getsentry/sentry-go` | Error tracking |

---

## Sentry Integration

```
DSN: https://962d173a894df4e4c23c744f8c39d6f3@sentry.butterflyotel.online/9
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              manus-md-to-pdf                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  input.md ──┬──▶ gomarkdown/markdown ──▶ HTML                               │
│             │                            │                                   │
│             │                            ▼                                   │
│             │              ┌─────────────────────────────┐                  │
│             │              │  md2pdf_default.html        │                  │
│             │              │  + Mermaid.js (10.6.1)      │                  │
│             │              │  + KaTeX (0.16.25)          │                  │
│             │              │  + Highlight.js (11.9.0)    │                  │
│             │              └─────────────────────────────┘                  │
│             │                            │                                   │
│             │                            ▼                                   │
│             │              ┌─────────────────────────────┐                  │
│             │              │  Headless Chrome            │                  │
│             │              │  - Load HTML                │                  │
│             │              │  - Render Mermaid diagrams  │                  │
│             │              │  - Render KaTeX math        │                  │
│             │              │  - Highlight code blocks    │                  │
│             │              └─────────────────────────────┘                  │
│             │                            │                                   │
│             │                            ▼                                   │
│             │              ┌─────────────────────────────┐                  │
│             │              │  Page.printToPDF            │                  │
│             │              │  - Paper size               │                  │
│             │              │  - Margins                  │                  │
│             │              │  - Scale                    │                  │
│             │              └─────────────────────────────┘                  │
│             │                            │                                   │
│             └────────────────────────────┼───────────────────────────────▶  │
│                                          ▼                                   │
│                                     output.pdf                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## See Also

- [MANUS_RENDER_DIAGRAM_REVERSE.md](MANUS_RENDER_DIAGRAM_REVERSE.md) - Diagram rendering
- [MANUS_TOOLS_SUMMARY.md](MANUS_TOOLS_SUMMARY.md) - Complete tools overview
- [MANUS_CLI_README.md](MANUS_CLI_README.md) - Usage guide
