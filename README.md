# @pipeworx/mcp-science

MCP server for science data — NASA APOD, ISS location, and earthquake monitoring.

## Tools

| Tool | Description |
|------|-------------|
| `get_iss_location` | Get the current location of the International Space Station |
| `get_earthquakes` | Get recent earthquakes from USGS |
| `get_air_quality` | Get air quality measurements near a location from OpenAQ |
| `get_apod` | Get NASA Astronomy Picture of the Day |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "science": {
      "url": "https://gateway.pipeworx.io/science/mcp"
    }
  }
}
```

## CLI Usage

```bash
npx pipeworx use science
```

## License

MIT
