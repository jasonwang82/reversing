# Mode-Switching Tools Analysis

This document details the "mode-switching" tools that transition from generic entry points into specialized, context-specific toolsets.

## Overview

Certain tools act as **gateways** that, when invoked, replace themselves with a suite of specialized tools tailored to the specific domain. This allows for granular control and a richer feature set once the mode is activated.

## 1. Browser Mode

**Entry Tool:** `browser`

**Transition:** Upon initialization, the generic `browser` tool is replaced by specialized browser interaction tools.

**Specialized Tools Available:**
- `browser_navigate` - Navigate to URLs
- `browser_view` - View current page state
- `browser_click` - Click elements
- `browser_input` - Type into fields
- `browser_scroll` - Scroll pages
- `browser_move_mouse` - Move cursor
- `browser_press_key` - Simulate key presses
- `browser_select_option` - Select dropdown items
- `browser_save_image` - Download images
- `browser_upload_file` - Upload files
- `browser_find_keyword` - Search text
- `browser_fill_form` - Fill multiple fields
- `browser_console_exec` - Execute JavaScript
- `browser_console_view` - View console logs
- `browser_close` - Close browser session

**Key Metadata Provided:**
- Page title and URL
- Screenshot path with viewport metrics
- List of interactive elements with indices
- Full page content in Markdown format
- Persistent login state and cookies

---

## 2. Generate Mode

**Entry Tool:** `generate`

**Transition:** Upon invocation, the generic `generate` tool is replaced by specialized media generation tools.

**Specialized Tools Available:**
- `generate_image` - Create images from text prompts
- `generate_image_variation` - Edit/refine existing images
- `generate_video` - Create videos from prompts
- `generate_speech` - Convert text to speech audio

**Parameters & Capabilities:**

### generate_image
Creates new images based on detailed prompts and optional visual references.
- **images**: Array of image objects with:
  - `prompt`: Detailed description of the desired image
  - `path`: Output file path
  - `aspect_ratio`: auto, landscape, portrait, or square
  - `references`: Optional array of reference image paths
  - `transparent_background`: Optional flag for PNG transparency

### generate_image_variation
Edits existing images based on modification prompts.
- **prompt**: Description of changes to apply
- **path**: Path to the image to edit
- **references**: Optional reference images
- **aspect_ratio**: Specific ratio for output (1:1, 4:3, 3:4, 16:9, 9:16, 21:9, 9:21)

### generate_video
Generates videos with optional audio.
- **prompt**: Detailed description of video content
- **path**: Output file path
- **aspect_ratio**: landscape, portrait, or square
- **duration_seconds**: 4, 6, or 8 seconds
- **generate_audio**: Boolean to include audio
- **keyframes**: Optional first and last frame descriptions
- **references**: Optional reference images

### generate_speech
Converts text to speech.
- **text**: Content to convert to speech
- **path**: Output audio file path
- **voice**: male_voice or female_voice

---

## 3. Slides Mode

**Entry Tool:** `slides`

**Transition:** Upon invocation, the generic `slides` tool is replaced by specialized presentation tools.

**Specialized Tools Available:**
- `slides_create` - Create a new presentation from markdown
- `slides_view` - View current presentation state

**Parameters & Capabilities:**

### slides_create
Initializes a new presentation from a markdown outline.
- **slide_content_file_path**: Path to markdown file with slide content
- **slide_count**: Total number of slides
- **generate_mode**: 
  - `html` - Traditional HTML/CSS slides (editable, data-heavy)
  - `image` - Image-based slides (visually stunning, not editable)

**Workflow:**
1. Prepare markdown file with slide content
2. Optionally generate or search for images
3. Call `slides_create` with the markdown path
4. Use `slides_view` to inspect the presentation
5. Export using `manus-export-slides` command-line utility

**Export Formats:**
- PDF: `manus-export-slides manus-slides://{version_id} pdf`
- PowerPoint: `manus-export-slides manus-slides://{version_id} ppt`

---

## 4. Web Development Mode

**Entry Tool:** `webdev_init_project`

**Transition:** Upon successful project initialization, additional specialized web development tools become available.

**Specialized Tools Available:**
- `webdev_check_status` - Monitor project health and dev server state
- `webdev_restart_server` - Restart development services
- `webdev_add_feature` - Extend project with new capabilities
- `webdev_save_checkpoint` - Save project state for recovery
- `webdev_rollback_checkpoint` - Restore to previous checkpoint
- `webdev_execute_sql` - Run SQL queries on database
- `webdev_check_status` - Verify project status and logs

**Parameters & Capabilities:**

### webdev_init_project
Initializes a new web project with scaffolding.
- **name**: Project directory name
- **title**: Display title for the project
- **description**: Project description
- **scaffold**: 
  - `web-static` - Frontend-only (React + Tailwind)
  - `web-db-user` - Full-stack (+ database, auth, backend)
  - `mobile-app` - React Native mobile application

**Project Structure Created:**
```
project_name/
├── client/           # React frontend
│   ├── public/       # Static assets
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
├── server/           # Backend (if web-db-user)
├── shared/           # Shared types
├── package.json
└── .manus-logs/      # Development logs
```

### webdev_add_feature
Extends existing project with additional capabilities.
- **feature**: 
  - `web-db-user` - Upgrade web-static to full-stack
  - `stripe` - Add Stripe payment processing

### webdev_save_checkpoint
Creates a recoverable snapshot of the project.
- **description**: Message describing the checkpoint
- **timeout**: Optional timeout for git operations

### webdev_rollback_checkpoint
Restores project to a previous checkpoint.
- **version_id**: Commit hash or checkpoint identifier

### webdev_execute_sql
Runs SQL queries on the project database.
- **query**: SQL statement or semicolon-separated statements

---

## Common Patterns

### Pattern 1: Gateway Tool Replacement
All mode-switching tools follow this pattern:
1. User invokes the generic entry tool
2. System initializes the mode/environment
3. Generic tool is replaced by specialized tools
4. Specialized tools remain available until the mode is exited or the session ends

### Pattern 2: State Persistence
Each mode maintains state across multiple tool invocations:
- **Browser**: Login state, cookies, and DOM state persist
- **Generate**: Generated assets are saved to disk
- **Slides**: Presentation state is maintained in memory
- **WebDev**: Project files and dev server state persist

### Pattern 3: Metadata Enrichment
Entry tools provide rich metadata to guide subsequent operations:
- **Browser**: Element indices, screenshots, markdown content
- **Generate**: Asset paths, generation parameters
- **Slides**: Presentation URIs, slide count
- **WebDev**: Project paths, dev server URLs, configuration

---

## Usage Guidelines

### When to Use Each Mode

**Browser Mode:**
- Scraping web content
- Automating form submission
- Testing web applications
- Interacting with login-protected sites

**Generate Mode:**
- Creating visual assets for projects
- Generating marketing materials
- Producing audio/video content
- Editing existing media

**Slides Mode:**
- Creating presentations
- Building slide decks
- Exporting to PDF/PowerPoint

**WebDev Mode:**
- Building web applications
- Managing full-stack projects
- Database operations
- Payment processing integration

### Best Practices

1. **Read metadata carefully** - The tool result contains essential information for subsequent operations
2. **Batch operations** - Use specialized tools in sequences to avoid unnecessary mode switches
3. **Persist state** - Leverage the persistence of each mode to maintain context
4. **Handle errors gracefully** - If a mode fails, check the error message for required actions
5. **Clean up** - Use appropriate close/exit tools to properly terminate modes
