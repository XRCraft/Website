import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to proxy requests to the Minecraft server status API
 * This route bypasses CORS restrictions and implements caching
 * to reduce API calls and improve performance.
 */

// Define the structure of our cached data
interface ServerStatusData {
  online?: boolean;
  ip?: string;
  port?: number;
  players?: {
    online?: number;
    max?: number;
    list?: {name: string, id?: string}[];
  };
  motd?: {
    raw?: string[];
    clean?: string[];
    html?: string[];
  };
  version?: string;
  protocol?: number;
  hostname?: string;
  icon?: string;
  software?: string;
  map?: string;
  plugins?: string[];
  mods?: string[];
  [key: string]: any; // Allow for other properties
}

// Set a 2-minute cache in memory for better performance
const CACHE_TIME = 120 * 1000; // 2 minutes in milliseconds
let cachedData: ServerStatusData | null = null;
let lastFetch = 0;
let lastIp = '';
let requestsInProgress: Map<string, Promise<Response>> = new Map();

/**
 * Cleans Minecraft formatting codes from MOTD text
 * Removes all § codes including colors (§a-f, §0-9) and formatting (§l, §o, §n, §m, §k, §r)
 */
function cleanMotdLine(text: string): string {
  if (!text) return '';
  
  // Remove all Minecraft formatting codes
  // This includes:
  // - Color codes: §0-9, §a-f
  // - Formatting codes: §l (bold), §o (italic), §n (underline), §m (strikethrough), §k (obfuscated), §r (reset)
  // - Hex color codes: §#RRGGBB
  return text
    .replace(/§[0-9a-fklmnor]/gi, '') // Standard codes
    .replace(/§#[0-9A-F]{6}/gi, '') // Hex codes
    .trim();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serverIp = searchParams.get('ip');
  
  if (!serverIp) {
    return NextResponse.json(
      { error: 'Server IP parameter is required' },
      { status: 400 }
    );
  }
  
  // Return cached data if it's fresh and for the same IP
  const now = Date.now();
  if (cachedData && lastIp === serverIp && (now - lastFetch < CACHE_TIME)) {
    // Ensure cached data has clean MOTD
    if (cachedData.motd && cachedData.motd.raw && !cachedData.motd.clean) {
      cachedData.motd.clean = cachedData.motd.raw.map((line: string) => cleanMotdLine(line));
    }
    
    // Enhance response with cache info
    return NextResponse.json(
      { ...cachedData, cache: { hit: true, age: Math.floor((now - lastFetch) / 1000) } },
      { 
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
      }
    );
  }
  
  try {
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced timeout
    
    const response = await fetch(`https://api.mcsrvstat.us/3/${serverIp}`, {
      signal: controller.signal,
      method: 'GET', 
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'XRCraftMC-Website/1.0',
      },
      next: { revalidate: 60 } // Use Next.js 13+ cache
    });
    
    clearTimeout(timeoutId);
      if (!response.ok) {
      // In production, don't log as much to avoid filling logs
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Server status API returned ${response.status} for IP: ${serverIp}`);
      }
      
      // Handle specific error codes
      if (response.status === 405) {
        return NextResponse.json(
          { error: 'Method Not Allowed - The API endpoint might have changed or is restricting access.' },
          { 
            status: 500, // Return as 500 to the client to allow retry
            headers: { 'Cache-Control': 'no-store, must-revalidate' }
          }
        );
      }
      
      // Try to get more error details from the response
      try {
        const errorBody = await response.text();
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error response body:', errorBody);
        }
      } catch (readError) {
        // Ignore read errors
      }
      
      return NextResponse.json(
        { error: `Server returned ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Process and clean MOTD if it exists
    if (data.motd && data.motd.raw) {
      data.motd.clean = data.motd.raw.map((line: string) => cleanMotdLine(line));
    }
    
    // Update cache
    cachedData = data;
    lastFetch = now;
    lastIp = serverIp;
    
    return NextResponse.json(
      { ...data, cache: { hit: false, fresh: true } },
      { 
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
      }
    );
  } catch (error) {
    // In development, log full error details
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching server status:', error);
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout when fetching server status', online: false },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
