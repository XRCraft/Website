// Fixed fetcher function with correct syntax
const fetcher = async (url: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const res = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache'
      }
      // No need for CORS options since we're using our own API endpoint
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch server status: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    // Provide more specific error messages based on error type
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
      console.error('Network error when fetching server status - possibly CORS or connectivity issue');
      throw new Error('Network connectivity issue. Please check your internet connection.');
    } else if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError') {
      console.error('Request timeout when fetching server status');
      throw new Error('Request timed out. Server may be experiencing high load.');
    } else {
      console.error('Error fetching server status:', error);
      throw error;
    }
  }
};
