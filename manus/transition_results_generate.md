# Generate Mode Transition - Verbatim Tool Result

## Tool Invocation
```
generate_image(
  brief="Triggering generate mode to capture verbatim transition result and available tools.",
  images=[{
    "aspect_ratio": "square",
    "path": "/home/ubuntu/test_generate.png",
    "prompt": "A simple test image for tool analysis"
  }]
)
```

## Verbatim Result Output

```
Image generated at `/home/ubuntu/test_generate.png`
```

## Key Observations

### Result Format
The generate mode provides a minimal, direct response:
- **Output Path**: Absolute file path to the generated asset
- **Status**: Implicit success (no error message = successful generation)
- **Image Output**: Visual representation of the generated content

### Minimal Metadata
Unlike browser mode which provides extensive metadata (viewport elements, screenshots, markdown), the generate mode provides:
- Only the file path
- Implicit success/failure
- The generated asset itself

## Available Subsequent Operations

After entering generate mode, the following specialized tools become available:

### 1. generate_image
Creates new images from text prompts.
- **Parameters**:
  - `brief`: Description of the generation purpose
  - `images`: Array of image objects with:
    - `prompt`: Detailed description of desired image
    - `path`: Output file path (.png or .jpg)
    - `aspect_ratio`: auto, landscape, portrait, or square
    - `references`: Optional array of reference image paths
    - `transparent_background`: Optional hex color for transparency

### 2. generate_image_variation
Edits or refines existing images.
- **Parameters**:
  - `brief`: Description of the edit purpose
  - `prompt`: Description of changes to apply
  - `path`: Path to output image (.png)
  - `references`: Array of images to edit (required)
  - `aspect_ratio`: Optional output ratio (1:1, 4:3, 3:4, 16:9, 9:16, 21:9, 9:21)

### 3. generate_video
Generates videos with optional audio.
- **Parameters**:
  - `brief`: Description of video content
  - `prompt`: Detailed description of video
  - `path`: Output file path (.mp4)
  - `aspect_ratio`: landscape, portrait, or square (required)
  - `duration_seconds`: 4, 6, or 8 seconds (optional, default 8)
  - `generate_audio`: Boolean to include audio (optional, default true)
  - `keyframes`: Optional object with `first` and `last` frame descriptions
  - `references`: Optional array of reference images

### 4. generate_speech
Converts text to speech audio.
- **Parameters**:
  - `brief`: Description of speech generation purpose
  - `text`: Content to convert (max 50,000 characters)
  - `path`: Output file path (.wav)
  - `voice`: male_voice or female_voice (required)

## Workflow Pattern

The generate mode follows a **direct asset generation** pattern:
1. Call `generate_image`, `generate_video`, or `generate_speech` with detailed prompts
2. Receive file path to generated asset
3. Use the asset in subsequent operations (e.g., copy to web project, reference in slides)
4. Optionally refine with `generate_image_variation`

## Key Differences from Other Modes

| Aspect | Browser | Generate | Slides | WebDev |
|--------|---------|----------|--------|--------|
| **Metadata** | Extensive (elements, screenshots, markdown) | Minimal (file path only) | Moderate (presentation URI) | Extensive (project config, templates) |
| **State Persistence** | High (DOM, cookies, login) | Low (only generated files) | Medium (presentation state) | High (project files, dev server) |
| **Output Type** | Interactive elements | Static assets | Presentation | Full project |
| **Subsequent Tools** | 15 browser tools | 4 generation tools | 2 slide tools | 7 webdev tools |

## Implications for Tool Usage

1. **Minimal Feedback**: Generate mode provides minimal feedback compared to other modes
2. **Asset-Centric**: The mode is focused on asset creation, not interaction
3. **Batch Operations**: Multiple images can be generated in a single call (array of image objects)
4. **File Management**: Generated assets are automatically saved; user is responsible for organization
5. **No Rollback**: Unlike WebDev mode, there's no checkpoint/rollback mechanism for generated assets

## Practical Workflow Example

```
1. Call generate_image with detailed prompt for hero image
   → Receive /path/to/hero.png

2. Call generate_image_variation to refine the image
   → Receive /path/to/hero_refined.png

3. Copy refined image to web project public folder
   → /home/ubuntu/project_name/client/public/images/hero.png

4. Reference in React component
   → <img src="/images/hero.png" />
```
