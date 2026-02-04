# manus-upload-file Environment Variables

## Required Configuration

Based on binary analysis, the `manus-upload-file` tool requires the following:

### 1. Environment File: `/root/.env`

The tool looks for a `.env` file at `/root/.env` inside the container.

### 2. Sandbox API Token File: `/root/.secrets/sandbox_api_token`

A file containing your sandbox API token must be present at this path.

### 3. BizServer Configuration

The tool communicates with a "BizServer" API at `gitlab.monica.cn/vida`. The configuration requires:

- **Host**: BizServer endpoint (likely `gitlab.monica.cn` or similar)
- **Token**: Authentication token for the BizServer API

## Docker Setup Required

Since we're running in Docker, we need to mount these files:

```bash
# Create local config directory
mkdir -p ~/.manus/{secrets,config}

# Create the sandbox token file
echo "YOUR_SANDBOX_API_TOKEN_HERE" > ~/.manus/secrets/sandbox_api_token

# Create the .env file (adjust values as needed)
cat > ~/.manus/config/.env << 'EOF'
# BizServer Configuration
BIZSERVER_HOST=your-bizserver-host.com
BIZSERVER_TOKEN=your-bizserver-token

# Sandbox Configuration  
SANDBOX_ID=your-sandbox-id
EOF

# Run with mounted volumes
docker run --rm \
    -v "$(pwd)/manus-upload-file:/usr/local/bin/manus-upload-file" \
    -v "$(pwd):/data" \
    -v "$HOME/.manus/config/.env:/root/.env:ro" \
    -v "$HOME/.manus/secrets:/root/.secrets:ro" \
    -w /data \
    --platform linux/amd64 \
    alpine:latest \
    /usr/local/bin/manus-upload-file path/to/file.png
```

## Environment Variables (Inferred)

Based on the binary analysis, these appear to be the key environment variables:

### Core Configuration
- `BIZSERVER_HOST` - BizServer API endpoint
- `BIZSERVER_TOKEN` - Authentication token for BizServer
- `SANDBOX_ID` - Your sandbox identifier  
- `SANDBOX_API_TOKEN` - API token for sandbox operations (stored in file)

### Optional/Additional
- `SENTRY_DSN` - Sentry error tracking (if enabled)
- `SENTRY_ENVIRONMENT` - Environment name for Sentry
- `SENTRY_RELEASE` - Release version for Sentry
- `RUNTIME_API_HOST` - Runtime API host (if different from BizServer)

## Internal Architecture

The tool:
1. Loads environment variables from `/root/.env`
2. Reads sandbox API token from `/root/.secrets/sandbox_api_token`
3. Creates a BizServer client using the configuration
4. Calls `SandboxSignUrl` API endpoint to get a presigned S3 URL
5. Uploads the file to S3 using the presigned URL
6. Returns the public CDN URL

## Error Messages

- **"Environment file not found path=/root/.env"** - The .env file is missing
- **"failed to read sandbox token file"** - The token file is missing or unreadable
- **"empty BizServerConfig.Host"** - BIZSERVER_HOST not set in .env
- **"empty BizServerConfig.Token"** - BIZSERVER_TOKEN not set in .env
- **"sandbox token file is empty"** - The token file exists but is empty

## Notes

- This tool is part of the "Manus" platform (vida/manus-sandbox)
- It's designed for sandbox environments with specific API access
- **You'll need actual credentials from the Manus platform to use this tool**
- Without valid credentials, the tool will fail to authenticate with the BizServer

## Unknown Values

To actually use this tool, you would need to:
1. Have access to a Manus sandbox environment
2. Obtain valid API credentials
3. Know the correct BizServer endpoint

These values are platform-specific and not publicly documented in the binary.
