# mcp-science

Science MCP — free science data APIs

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_iss_location` | Get the current position of the International Space Station. Returns latitude, longitude, altitude, and velocity. |
| `get_earthquakes` | Search recent earthquakes by location and magnitude threshold. Returns magnitude, depth, coordinates, and timestamp for each event. |
| `get_air_quality` | Check air quality at a location (e.g., \'New York\', \'London\'). Returns AQI score, PM2.5, PM10, ozone, and NO2 levels. |
| `get_apod` | Get NASA\'s Astronomy Picture of the Day with image URL, title, and explanation. Optionally specify a date (e.g., \'2024-01-15\'). |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
