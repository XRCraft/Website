import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to proxy requests to the Minecraft server status API
 * This route bypasses CORS restrictions that would occur when calling 
 * the API directly from the client.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serverIp = searchParams.get('ip');
  
  if (!serverIp) {
    return NextResponse.json(
      { error: 'Server IP parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(`https://api.mcsrvstat.us/3/${serverIp}`, {
      signal: controller.signal,
      method: 'GET', // Explicitly specify GET method
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'XRCraftMC-Website/1.0', // Add a user agent to avoid being blocked
      },
    });
    
    clearTimeout(timeoutId);
      if (!response.ok) {
      console.error(`Server status API returned ${response.status} for IP: ${serverIp}`);
      
      // Handle specific error codes
      if (response.status === 405) {
        return NextResponse.json(
          { error: 'Method Not Allowed - The API endpoint might have changed or is restricting access.' },
          { status: 500 } // Return as 500 to the client to allow retry
        );
      }
      
      // Try to get more error details from the response
      try {
        const errorBody = await response.text();
        console.error('Error response body:', errorBody);
      } catch (readError) {
        // Ignore read errors
      }
      
      return NextResponse.json(
        { error: `Server returned ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching server status:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout when fetching server status' },
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
