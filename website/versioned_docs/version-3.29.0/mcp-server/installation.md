---
id: installation
title: Installation
---

You can install Litmus MCP Server from source, via `go install`, or using Docker. Refer to the repository for the most up-to-date commands.

## From Source

```bash
# Clone the repository
git clone https://github.com/litmuschaos/litmus-mcp-server.git
cd litmus-mcp-server

# Build the binary
make build

# Or install directly
make install
```

## Using Go Install

```bash
go install github.com/litmuschaos/litmus-mcp-server@latest
```

## Using Docker

```bash
# Build the Docker image
make docker-build

# Run with Docker
docker run --rm -it \
  -e CHAOS_CENTER_ENDPOINT=http://your-chaos-center:8080 \
  -e LITMUS_PROJECT_ID=your-project-id \
  -e LITMUS_ACCESS_TOKEN=your-token \
  litmuschaos-mcp-server:latest
```

## Configuration

Configure Litmus MCP Server using environment variables. 

### Environment Variables

```bash
# Required Configuration
export CHAOS_CENTER_ENDPOINT=http://your-chaos-center:8080
export LITMUS_PROJECT_ID=your-project-id
export LITMUS_ACCESS_TOKEN=your-access-token

# Optional Defaults
export DEFAULT_INFRA_ID=your-default-infrastructure-id
export DEFAULT_ENVIRONMENT_ID=production
```

### Getting Your Credentials

1. **Chaos Center Endpoint**: URL of your LitmusChaos installation
2. **Project ID**: Found in Chaos Center project settings
3. **Access Token**: Generate from Chaos Center → Settings → Access Tokens

## Usage

You can run Litmus MCP Server standalone or integrate it with Claude Desktop via the MCP configuration.

### With Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "litmuschaos": {
      "command": "/path/to/litmuschaos-mcp-server",
      "env": {
        "CHAOS_CENTER_ENDPOINT": "http://localhost:8080",
        "LITMUS_PROJECT_ID": "your-project-id",
        "LITMUS_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

### Standalone Usage

```bash
# Using environment variables
./bin/litmuschaos-mcp-server

# Or with make
make run
```

## Learn more

- [Available Tools](./available-tools)
- [Example Interactions](./examples)
- [Troubleshooting](./troubleshooting)
