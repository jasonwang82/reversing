# manus-speech-to-text - Reverse Engineered Documentation

## Overview

`manus-speech-to-text` transcribes audio and video files to text using the OpenAI Whisper API. Large files are automatically compressed to 64kbps MP3 using ffmpeg before upload.

## API Details

### Endpoint
```
POST https://api.openai.com/v1/audio/transcriptions
```

### Model
```
whisper-1
```

### Authentication
```bash
OPENAI_API_KEY=sk-...
```

### Go Client Library
```
github.com/sashabaranov/go-openai
```

---

## Whisper API Parameters

The tool sends these form fields to the Whisper API:

| Parameter | Description |
|-----------|-------------|
| `model` | Always `whisper-1` |
| `file` | The audio file (original or compressed) |
| `response_format` | `verbose_json` for detailed output |
| `language` | Optional language code (e.g., `en`, `zh`) |
| `prompt` | Optional prompt to guide transcription |
| `temperature` | Sampling temperature |
| `timestamp_granularities[]` | `word` and/or `segment` for timestamps |

### Response Format: verbose_json

Returns detailed segment-level data:

```json
{
  "task": "transcribe",
  "language": "english",
  "duration": 123.45,
  "text": "Full transcription text...",
  "segments": [
    {
      "id": 0,
      "seek": 0,
      "start": 0.0,
      "end": 2.5,
      "text": "Hello world.",
      "tokens": [50364, 2425, 1002, 13, 50489],
      "temperature": 0.0,
      "avg_logprob": -0.234,
      "compression_ratio": 1.23,
      "no_speech_prob": 0.01,
      "transient": false
    }
  ],
  "words": [
    {
      "word": "Hello",
      "start": 0.0,
      "end": 0.5
    },
    {
      "word": "world.",
      "start": 0.6,
      "end": 1.0
    }
  ]
}
```

---

## FFmpeg Audio Conversion

### When Triggered

- Input file is a video format
- File size exceeds 25MB (OpenAI's Whisper limit)

### FFmpeg Command (Inferred)

```bash
ffmpeg -i input.mp4 -vn -acodec libmp3lame -b:a 64k output.mp3
```

| Flag | Purpose |
|------|---------|
| `-i input` | Input file |
| `-vn` | Strip video track (audio only) |
| `-acodec libmp3lame` | Use LAME MP3 encoder |
| `-b:a 64k` | Audio bitrate: 64 kbps |

### Output File Naming

```
{original_name}_converted_{timestamp}.mp3
```

### Limits & Timeouts

| Limit | Value |
|-------|-------|
| Max file size | 25 MB |
| Conversion timeout | 5 minutes |
| Output bitrate | 64 kbps |

---

## Supported Input Formats

### Audio
```
.mp3  .m4a  .wav  .mpga  .mpeg  .webm
```

### Video (auto-converted to audio)
```
.mp4  .avi  .mov  .mkv  .flv
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     INPUT FILE                               │
│              (audio or video, any size)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Validate input path                                      │
│     - Check file exists                                      │
│     - Get file size and format                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Check if conversion needed                               │
│     - Is video? → Convert                                    │
│     - Size > 25MB? → Convert                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
┌──────────────────┐    ┌──────────────────────────────────┐
│  Use original    │    │  3. FFmpeg conversion             │
│  file            │    │     ffmpeg -i input -vn           │
│                  │    │     -acodec libmp3lame            │
│                  │    │     -b:a 64k output.mp3           │
└────────┬─────────┘    └─────────────────┬────────────────┘
         │                                │
         └────────────────┬───────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Call OpenAI Whisper API                                  │
│     POST /v1/audio/transcriptions                            │
│     Headers:                                                 │
│       Authorization: Bearer $OPENAI_API_KEY                  │
│     Body (multipart/form-data):                              │
│       - model: whisper-1                                     │
│       - file: <audio_file>                                   │
│       - response_format: verbose_json                        │
│       - timestamp_granularities[]: word                      │
│       - timestamp_granularities[]: segment                   │
│       - language: (optional)                                 │
│       - prompt: (optional)                                   │
│       - temperature: (optional)                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Parse response                                           │
│     - Extract text, segments, words                          │
│     - Include timing information                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Save transcription result                                │
│     Output: {name}_transcription_{timestamp}.json            │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

### Required
```bash
OPENAI_API_KEY=sk-...    # OpenAI API key for Whisper
```

### Optional
```bash
SENTRY_DSN=...           # Sentry error tracking
SENTRY_ENVIRONMENT=...   # Environment name
APP_ENV=release          # App environment (release/debug)
```

---

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `input file path cannot be empty` | No file argument | Provide file path |
| `Error: File too large: %.1fMB (max: 25MB)` | File exceeds limit after conversion | Use shorter audio |
| `ffmpeg not found. Please install ffmpeg first` | ffmpeg not in PATH | Install ffmpeg |
| `video conversion timeout (exceeded 5 minutes)` | Conversion took too long | Use smaller file |
| `Error: Unsupported file format` | Invalid file extension | Use supported format |
| `transcription failed: %w` | API error | Check API key/quota |
| `opening audio file: %w` | Can't read file | Check file permissions |

---

## Output Files

### Transcription JSON
```
{original_name}_transcription_{timestamp}.json
```

Contains:
- Full text
- Segment-level timestamps
- Word-level timestamps
- Confidence metrics (avg_logprob, no_speech_prob)

### Converted Audio (if applicable)
```
{original_name}_converted_{timestamp}.mp3
```

---

## Usage Examples

```bash
# Basic transcription
./manus-speech-to-text.sh recording.mp3

# Video file (auto-converted)
./manus-speech-to-text.sh meeting.mp4

# Large file (auto-compressed to 64kbps)
./manus-speech-to-text.sh long-podcast.wav
```

---

## Console Output

```
Starting Speech-to-Text conversion...
Transcribing mp3 file: recording.mp3, file size: 5.23 MB
Transcription may take some time depending on file size and audio length...
Transcription completed successfully!
TRANSCRIPTION RESULT:
Complete transcription result saved to: recording_transcription_20260204.json
```

For video files:
```
Starting Speech-to-Text conversion...
File size exceeds limit, converting to audio (64kbps)...
Audio conversion completed. Saved to: meeting_converted_20260204.mp3
Transcribing mp3 file: meeting_converted_20260204.mp3, file size: 2.15 MB
...
```

---

## Source Package

```
gitlab.monica.cn/vida/manus-sandbox/sbx-go-svc/packages/speech-to-text/pkg/speechtotext
```

Key functions:
- `runTranscription` - Main transcription logic
- `saveTranscriptionResult` - Save JSON output
- `convert_speech_to_text` - Entry point

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `github.com/sashabaranov/go-openai` | OpenAI API client |
| `github.com/spf13/cobra` | CLI framework |
| `github.com/getsentry/sentry-go` | Error tracking |

---

## Limitations

1. **Requires OpenAI API key** - Not usable without valid credentials
2. **Requires ffmpeg** - For video/large file conversion
3. **25MB limit** - OpenAI's Whisper API constraint
4. **5 minute timeout** - For video conversion
5. **64kbps quality** - Compressed audio may affect accuracy

---

## Security Notes

1. API key passed via environment variable (not command line)
2. Uses Sentry for error reporting (may send file paths)
3. Temp files created for conversion (should be cleaned up)

---

## See Also

- [MANUS_CLI_README.md](MANUS_CLI_README.md) - General usage guide
- [MANUS_BINARY_ANALYSIS.md](MANUS_BINARY_ANALYSIS.md) - Full binary analysis
- [MANUS_TOOLS_SUMMARY.md](MANUS_TOOLS_SUMMARY.md) - All tools overview
