# mcp-science

Science MCP — free science data APIs

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_iss_location` | Fetch the International Space Station's current latitude, longitude, and Unix timestamp from the Open Notify API. No inputs required; returns a real-time position fix. |
| `get_earthquakes` | Retrieve up to 20 globally recent earthquakes from the USGS FDSN service, filtered by lookback period (1–30 days, default 1) and minimum magnitude (default 4.0). Returns magnitude, location name, depth (km), coordinates, time, and tsunami warning flag. |
| `get_air_quality` | Check current air quality at a latitude/longitude. Returns US AQI score and category plus PM2.5, PM10, ozone, NO2, and CO levels. |
| `get_apod` | Get NASA's Astronomy Picture of the Day with image URL, title, and explanation. Optionally specify a date (e.g., '2024-01-15'). |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "science": {
      "url": "https://gateway.pipeworx.io/science/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Science data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
