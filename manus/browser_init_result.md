# Browser Initialization Result

When the `browser_navigate` tool (or the initial `browser` entry point) is successfully invoked, the system returns a structured response containing the page state and specific instructions for the agent.

## Page Metadata
The result includes key information about the loaded page:
- **Title**: The `<title>` of the webpage.
- **URL**: The final URL after any redirects.
- **Screenshot Path**: The absolute path to the rendered viewport screenshot (e.g., `/home/ubuntu/screenshots/...`).
- **Viewport Metrics**: `Pixels above viewport` and `Pixels below viewport` to indicate scroll position.

## Extracted Content
The tool automatically provides:
1. **Viewport Elements**: A list of interactive elements visible in the current viewport in the format `index[:]tag {hint} text`. These indices are used for subsequent actions like `browser_click` or `browser_input`.
2. **Markdown Content**: A full text extraction of the webpage in Markdown format, which allows the agent to read the page content without manually scrolling or parsing HTML.

## System Instructions for Browser Use
The environment provides the following guidelines for using the expanded browser toolset:
- **Element Interaction**: Use the `index` provided in the viewport elements list to reference elements. If an element is visible in the screenshot but not in the list, use coordinates.
- **Multimodal Understanding**: The agent is provided with an annotated screenshot where numbered boxes correspond to the element indices.
- **Information Persistence**: Agents are instructed to actively save key information (especially from images and tables) to text files, as subsequent operations might lose access to multimodal data.
- **State Persistence**: Login states and cookies are persisted across tasks.
- **Downloads**: Files are saved to `/home/ubuntu/Downloads/` by default.
- **Sensitive Operations**: Agents MUST request user confirmation before performing actions like payments or posting content.
- **User Takeover**: If a CAPTCHA or complex login is encountered, the agent should suggest the user take over the browser.

## Tool Transition
As noted in our conversation, once the browser is initialized, the generic `browser` tool is replaced by:
- `browser_navigate`
- `browser_view`
- `browser_click`
- `browser_input`
- `browser_scroll`
- `browser_move_mouse`
- `browser_press_key`
- `browser_select_option`
- `browser_save_image`
- `browser_upload_file`
- `browser_find_keyword`
- `browser_fill_form`
- `browser_console_exec`
- `browser_console_view`
- `browser_close`
