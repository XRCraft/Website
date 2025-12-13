'use client';

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState, useEffect } from 'react';
import useSWR from 'swr';
import Image from 'next/image';

// Define the Player type
interface Player {
  name: string;
  uuid?: string;
}

// Function to fetch data from the API with better error handling
const fetcher = async (url: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
      },
      // No need for CORS settings when using our own API
      next: { revalidate: 0 } // Don't cache this request on the client
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch server status: ${res.status}`);
    }
    
    return res.json();  } catch (error) {
    // Provide more specific error messages based on error type
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
      console.error('Network error when fetching server status');
      throw new Error('Unable to connect to server status. Please try again later.');
    } else if (typeof error === 'object' && error !== null && 'name' in error && (error as { name: string }).name === 'AbortError') {
      console.error('Request timeout when fetching server status');
      throw new Error('Request timed out. Our server or the Minecraft server might be experiencing high load.');
    } else if (!navigator.onLine) {
      console.error('Browser is offline');
      throw new Error('Your device appears to be offline. Please check your internet connection.');
    } else {
      console.error('Error fetching server status:', error);
      // Provide a more user-friendly error message
      throw new Error('Unable to fetch server status. Please try refreshing the page.');
    }
  }
};

// Function to parse Minecraft color codes in the format used by XRCraftMC
function parseMinecraftColors(text: string) {
  if (!text) return "";
  
  // Color codes mapping
  const colorMap: Record<string, string> = {
    '0': '#000000', // Black
    '1': '#0000AA', // Dark Blue
    '2': '#00AA00', // Dark Green
    '3': '#00AAAA', // Dark Aqua
    '4': '#AA0000', // Dark Red
    '5': '#AA00AA', // Dark Purple
    '6': '#FFAA00', // Gold
    '7': '#AAAAAA', // Gray
    '8': '#555555', // Dark Gray
    '9': '#5555FF', // Blue
    'a': '#55FF55', // Green
    'b': '#55FFFF', // Aqua
    'c': '#FF5555', // Red
    'd': '#FF55FF', // Light Purple
    'e': '#FFFF55', // Yellow
    'f': '#FFFFFF', // White
  };
  
  // Formatting codes mapping
  const formatMap: Record<string, string> = {
    'l': 'font-weight:bold', // Bold
    'o': 'font-style:italic', // Italic
    'n': 'text-decoration:underline', // Underline
    'm': 'text-decoration:line-through', // Strikethrough
    'k': 'animation:obfuscated 0.1s infinite', // Obfuscated (simplified)
  };

  let result = '';
  let i = 0;
  let openSpans = 0; // Track open spans to properly close them
  let currentColor = '';
  let currentFormats: string[] = [];
  
  const openSpan = (styles: string) => {
    result += `<span style="${styles}">`;
    openSpans++;
  };
  
  const closeSpan = () => {
    if (openSpans > 0) {
      result += '</span>';
      openSpans--;
    }
  };
  
  const closeAllSpans = () => {
    while (openSpans > 0) {
      closeSpan();
    }
  };
  
  const applyCurrentStyles = () => {
    if (currentColor || currentFormats.length > 0) {
      const styles = [];
      if (currentColor) styles.push(`color:${currentColor}`);
      styles.push(...currentFormats);
      openSpan(styles.join(';'));
    }
  };

  while (i < text.length) {
    // Handle Minecraft formatting codes
    if ((text[i] === '§' || text[i] === '\u00a7') && i + 1 < text.length) {
      const code = text[i + 1].toLowerCase();
      
      // Handle reset code
      if (code === 'r') {
        closeAllSpans();
        currentColor = '';
        currentFormats = [];
        i += 2;
        continue;
      }
      
      // Handle hex color codes §#RRGGBB
      if (code === '#' && i + 8 <= text.length) {
        const hexColor = text.slice(i + 2, i + 8);
        if (/^[0-9A-Fa-f]{6}$/.test(hexColor)) {
          closeAllSpans();
          currentColor = `#${hexColor}`;
          currentFormats = []; // Reset formatting when color changes
          applyCurrentStyles();
          i += 8;
          continue;
        }
      }
      
      // Handle standard color codes
      if (colorMap[code]) {
        closeAllSpans();
        currentColor = colorMap[code];
        currentFormats = []; // Reset formatting when color changes
        applyCurrentStyles();
        i += 2;
        continue;
      }
      
      // Handle formatting codes
      if (formatMap[code]) {
        const format = formatMap[code];
        if (!currentFormats.includes(format)) {
          closeAllSpans();
          currentFormats.push(format);
          applyCurrentStyles();
        }
        i += 2;
        continue;
      }
      
      // Skip unknown codes
      i += 2;
      continue;
    }
    
    // Add regular character
    result += text[i];
    i++;
  }
  
  // Close any remaining spans
  closeAllSpans();
  
  return result;
}

// Function to create a formatted demo MOTD based on your exact format
function createExactDemoMotd() {
  return [
    "§r§e§lXRCraft Network§r§c [1.21.10 - 1.18.2]",
    "§r§o§r§r§c🎮§r§#FF5E55 §r§#FF6755P§r§#FF7055a§r§#FF7955r§r§#FF8255k§r§#FF8B55o§r§#FF9455u§r§#FF9D55r§r§#FFA655 §r§#FFAE55i§r§#FFB755s§r§#FFC055 §r§#FFC955o§r§#FFD255p§r§#FFDB55e§r§#FFE455n§r§#FFED55!§r§#FFF655 §r§e🎮§r"
  ];
}

export default function ServerStatusClient() {
  const serverIp = "play.xrcraftmc.com";
  const [,setRetryCount] = useState(0); 
  const [showRawMotd, setShowRawMotd] = useState(false);
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedJoin, setCopiedJoin] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date);
  
  // TODO: Add network connectivity monitoring
  // const [isOnline] = useState(navigator?.onLine ?? true);
  
  // TODO: Implement network connectivity monitoring
  // useEffect(() => {
  //   const handleOnline = () => {
  //     // TODO: Refresh data when connection is restored
  //   };
  //   const handleOffline = () => {
  //     // TODO: Show offline indicator
  //   };

  //   window.addEventListener('online', handleOnline);
  //   window.addEventListener('offline', handleOffline);
    
  //   return () => {
  //     window.removeEventListener('online', handleOnline);
  //     window.removeEventListener('offline', handleOffline);
  //   };
  // }, []);
  const { data, error, isLoading, mutate } = useSWR(
    `https://api.mcsrvstat.us/2/${encodeURIComponent(serverIp)}`, 
    fetcher, 
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      errorRetryCount: 5, // Increased retries
      errorRetryInterval: 5000, // Start with 5 second retry interval
      revalidateOnFocus: true,
      dedupingInterval: 10000, // Deduping interval
      keepPreviousData: true, // Keep showing previous data while revalidating
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Don't retry for specific errors
        if (error.message.includes('connectivity')) return;
        
        // Exponential backoff
        const delay = Math.min(1000 * 2 ** retryCount, 30000);
        setTimeout(() => revalidate({ retryCount }), delay);
      },
      fallbackData: { // Provide fallback data when offline
        online: false,
        motd: { raw: createExactDemoMotd() },
        players: { online: 0, max: 100, list: [] },
        version: "1.21.10"
      }
    }
  );
  const handleRetry = async () => {
    setIsRefreshing(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await mutate(); // Wait for the data to refresh
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error during manual retry:', error);
      // Error is handled by SWR and will update the error state
    } finally {
      // Add a slight delay before removing the refreshing state for better UX
      setTimeout(() => {
        setIsRefreshing(false);
      }, 300);
    }
  };
  
  const handleCopyHeader = async () => {
    await navigator.clipboard.writeText(serverIp);
    setCopiedHeader(true);
    setTimeout(() => setCopiedHeader(false), 1500);
  };

  const handleCopyJoin = async () => {
    await navigator.clipboard.writeText(serverIp);
    setCopiedJoin(true);
    setTimeout(() => setCopiedJoin(false), 1500);
  };
  
  // Get MOTD lines, using our exact demo if none exists
  const getMotdLines = () => {
    if (data?.motd?.raw && data.motd.raw.length > 0) {
      return data.motd.raw;
    }
    return createExactDemoMotd();
  };

  // Update the last updated time when data changes
  useEffect(() => {
    if (data) {
      setLastUpdated(new Date());
    }
  }, [data]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Server Status</h1>
      
      <div className="glass-container">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleCopyHeader}
            className={`text-2xl font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer relative ${copiedHeader ? 'ring-2 ring-green-400 rounded px-2 py-1' : ''}`}
            title="Click to copy server IP"
          >
            play.xrcraftmc.com
            {copiedHeader && (
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap animate-pulse">
                Copied!
              </span>
            )}
          </button>
          <button 
            onClick={handleRetry}
            className={`glass-btn ${isRefreshing ? 'opacity-75' : ''}`}
            aria-label="Refresh server status"
            disabled={isRefreshing}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>        ) : error || !data ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="text-red-500 text-xl mb-4">
              {error?.message || "Unable to connect to server"}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error?.message?.includes('connectivity') 
                ? "Please check your internet connection and try again." 
                : error?.message?.includes('timed out')
                ? "The request timed out. This could be due to server load or network issues."
                : "The server may be offline or under maintenance. We'll keep trying to reconnect."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={handleRetry}
                className={`glass-btn ${isRefreshing ? 'opacity-75' : ''}`}
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Trying...' : 'Try Again'}
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="glass-btn"
                aria-label="Reload the page"
              >
                Reload Page
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Last attempt: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        ) : !data.online ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="text-red-500 text-xl mb-4">Server Offline</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Minecraft server is currently offline.
            </p>
            <button 
              onClick={handleRetry}
              className={`glass-btn ${isRefreshing ? 'opacity-75' : ''}`}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Checking...' : 'Check Again'}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Status</h3>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Online</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Players</h3>
                <p className="text-2xl font-bold">{data.players.online} <span className="text-gray-500 text-lg">/ {data.players.max}</span></p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Version</h3>
                <p>{data.version || "Unknown"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Message of the Day</h3>
                <div className="glass-light p-3 rounded font-minecraft overflow-hidden">
                  {showRawMotd ? (
                    <div className="leading-tight text-xs font-mono overflow-x-auto whitespace-pre">
                      {getMotdLines().map((line: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | null | undefined> | null | undefined, idx: Key | null | undefined) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="leading-tight">
                      {getMotdLines().map((line: string, idx: number) => (
                        <div 
                          key={idx} 
                          dangerouslySetInnerHTML={{ 
                            __html: parseMinecraftColors(line)
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Add a button to show what this would look like in-game */}
                <div className="mt-2 text-center">
                  <button 
                    onClick={() => {
                      const motdContainer = document.getElementById('minecraft-motd-preview');
                      if (motdContainer) {
                        motdContainer.classList.toggle('hidden');
                      }
                    }}
                    className="glass-btn text-sm mr-4"
                  >
                    Show in-game preview
                  </button>
                  
                  <button 
                    onClick={() => setShowRawMotd(!showRawMotd)}
                    className="glass-btn text-sm"
                  >
                    {showRawMotd ? 'Show formatted MOTD' : 'Show raw format'}
                  </button>
                  
                  <div id="minecraft-motd-preview" className="hidden mt-3 p-4 glass-container text-white rounded overflow-hidden max-w-md mx-auto">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 mr-2 bg-green-500 rounded-sm flex-shrink-0"></div>
                      <div>
                        <div className="font-bold">play.xrcraftmc.com</div>
                        <div className="text-xs text-gray-400">Minecraft Server</div>
                      </div>
                    </div>
                    
                    {/* Minecraft style MOTD with exact color parsing */}
                    <div className="font-minecraft text-sm mb-3 glass-light p-2 rounded">
                      {getMotdLines().map((line: string, idx: number) => (
                        <div 
                          key={idx} 
                          dangerouslySetInnerHTML={{ 
                            __html: parseMinecraftColors(line)
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-400 flex justify-between">
                      <span>Players: {data.players.online}/{data.players.max}</span>
                      <span>Version: {data.version || "1.21.1"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {data.players.online > 0 && data.players.list && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Online Players</h3>
                  <div className="glass-light p-3 rounded max-h-40 overflow-y-auto">
                    <ul className="space-y-1">
                      {data.players.list.map((player: Player, index: number) => (
                        <li key={index} className="flex items-center">
                          {typeof player === 'object' && player.name ? (
                            <>
                              {player.uuid && (
                                <Image 
                                  src={`https://crafatar.com/avatars/${player.uuid}?size=24&overlay`} 
                                  alt={`${player.name}'s avatar`}
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 mr-2 rounded-sm"
                                />
                              )}
                              <span>{player.name}</span>
                            </>
                          ) : (
                            <span>{typeof player === 'string' ? player : player.name}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">Last Updated</h3>
                <p>{lastUpdated.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-container">
        <h2 className="text-xl font-semibold mb-4">Join the Server</h2>
        <div className="mb-4 flex items-center flex-wrap">
          <p className="mr-2">To join the server, add</p>
          <button
            onClick={handleCopyJoin}
            className={`relative glass-light px-2 py-1 rounded ml-1 cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 active:scale-95 ${copiedJoin ? 'ring-2 ring-green-400' : ''}`}
            title="Click to copy IP"
            type="button"
          >
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
              <code className="font-mono text-base text-blue-600 dark:text-blue-400">{serverIp}</code>
            </span>
            {copiedJoin && (
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap animate-pulse">Copied!</span>
            )}
          </button>
          <p className="ml-2">to your Minecraft server list.</p>
        </div>
        
        <div className="space-y-4">
          <div className="glass-light p-4 rounded">
            <h3 className="font-semibold">Supported Versions:</h3>
            <p>1.21.10 - 1.19.2</p>
          </div>
          <div className="glass-light p-4 rounded">
            <h3 className="font-semibold">Recommended Mods:</h3>
            <ul className="list-disc list-inside">
              <li>SimpleVoiceChat</li>
              <li>Vivecraft</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
