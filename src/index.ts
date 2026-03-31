/**
 * Science MCP — free science data APIs
 *
 * Tools:
 * - get_iss_location: current ISS position
 * - get_earthquakes: recent earthquakes (USGS)
 * - get_air_quality: air quality data (OpenAQ)
 * - get_apod: NASA Astronomy Picture of the Day
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const tools: McpToolExport['tools'] = [
  {
    name: 'get_iss_location',
    description: 'Get the current location of the International Space Station',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_earthquakes',
    description: 'Get recent earthquakes from USGS',
    inputSchema: {
      type: 'object',
      properties: {
        days: { type: 'number', description: 'Look back N days (1-30, default 1)' },
        min_magnitude: { type: 'number', description: 'Minimum magnitude (default 4.0)' },
      },
    },
  },
  {
    name: 'get_air_quality',
    description: 'Get air quality measurements near a location from OpenAQ',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', description: 'Latitude' },
        longitude: { type: 'number', description: 'Longitude' },
      },
      required: ['latitude', 'longitude'],
    },
  },
  {
    name: 'get_apod',
    description: 'Get NASA Astronomy Picture of the Day',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date in YYYY-MM-DD format (default: today)' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_iss_location': {
      const res = await fetch('http://api.open-notify.org/iss-now.json');
      if (!res.ok) throw new Error(`Open Notify error: ${res.status}`);
      const data = (await res.json()) as {
        iss_position: { latitude: string; longitude: string };
        timestamp: number;
      };
      return {
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        timestamp: data.timestamp,
      };
    }

    case 'get_earthquakes': {
      const days = Math.min(30, Math.max(1, (args.days as number) ?? 1));
      const minMag = (args.min_magnitude as number) ?? 4.0;
      const now = new Date();
      const start = new Date(now.getTime() - days * 86400000);
      const params = new URLSearchParams({
        format: 'geojson',
        starttime: start.toISOString().slice(0, 10),
        endtime: now.toISOString().slice(0, 10),
        minmagnitude: String(minMag),
        orderby: 'magnitude',
        limit: '20',
      });
      const res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`);
      if (!res.ok) throw new Error(`USGS error: ${res.status}`);
      const data = (await res.json()) as {
        metadata: { count: number };
        features: {
          properties: {
            mag: number;
            place: string;
            time: number;
            url: string;
            tsunami: number;
          };
          geometry: { coordinates: number[] };
        }[];
      };
      return {
        count: data.metadata.count,
        earthquakes: data.features.map((f) => ({
          magnitude: f.properties.mag,
          location: f.properties.place,
          time: new Date(f.properties.time).toISOString(),
          latitude: f.geometry.coordinates[1],
          longitude: f.geometry.coordinates[0],
          depth_km: f.geometry.coordinates[2],
          tsunami_warning: f.properties.tsunami === 1,
          details_url: f.properties.url,
        })),
      };
    }

    case 'get_air_quality': {
      const lat = args.latitude as number;
      const lon = args.longitude as number;
      const params = new URLSearchParams({
        coordinates: `${lat},${lon}`,
        radius: '25000',
        limit: '5',
        order_by: 'distance',
      });
      const res = await fetch(`https://api.openaq.org/v2/latest?${params}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`OpenAQ error: ${res.status}`);
      const data = (await res.json()) as {
        results: {
          location: string;
          city?: string;
          country: string;
          measurements: {
            parameter: string;
            value: number;
            unit: string;
            lastUpdated: string;
          }[];
        }[];
      };
      return {
        stations: data.results.map((r) => ({
          location: r.location,
          city: r.city ?? '',
          country: r.country,
          measurements: r.measurements.map((m) => ({
            parameter: m.parameter,
            value: m.value,
            unit: m.unit,
            last_updated: m.lastUpdated,
          })),
        })),
      };
    }

    case 'get_apod': {
      const date = args.date as string | undefined;
      const params = new URLSearchParams({ api_key: 'DEMO_KEY' });
      if (date) params.set('date', date);
      const res = await fetch(`https://api.nasa.gov/planetary/apod?${params}`);
      if (!res.ok) throw new Error(`NASA APOD error: ${res.status}`);
      const data = (await res.json()) as {
        title: string;
        explanation: string;
        date: string;
        url: string;
        hdurl?: string;
        media_type: string;
        copyright?: string;
      };
      return {
        title: data.title,
        date: data.date,
        explanation: data.explanation,
        image_url: data.url,
        hd_url: data.hdurl ?? null,
        media_type: data.media_type,
        copyright: data.copyright ?? null,
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
