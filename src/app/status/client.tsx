'use client';

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState, useEffect } from 'react';
import useSWR from 'swr';
import Image from 'next/image';

// Define the Player type
interface Player {
  name: string;
  uuid?: string;
}

// Function to fetch data from the API
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch server status');
  }
  return res.json();
};

// Function to create a clean string representation from MOTD with color codes stripped
function cleanMotdText(text: string): string {
  // Remove color codes and formatting codes
  return text.replace(/§[0-9a-fklmnor#]([0-9A-F]{6})?/gi, '');
}

// Function to parse Minecraft color codes in the format used by XRCraftMC
function parseMinecraftColors(text: string) {
  if (!text) return "";
  
  // Special case for the second MOTD line with emojis and gradient text
  if (text.includes('🎮') && text.includes('Parkour')) {
    // For the second line with colored emojis and gradient text:
    // XRCraft Network uses this pattern:
    // §c🎮 [Gradient colored text] §e🎮
    
    const cleanText = cleanMotdText(text);
    // Remove unused variables: beforeFirstEmoji, afterLastEmoji
    const firstEmojiIndex = cleanText.indexOf('\ud83c\udfae');
    const lastEmojiIndex = cleanText.lastIndexOf('\ud83c\udfae');
    if (firstEmojiIndex !== -1 && lastEmojiIndex !== -1 && firstEmojiIndex !== lastEmojiIndex) {
      // const beforeFirstEmoji = cleanText.substring(0, firstEmojiIndex);
      const betweenEmojis = cleanText.substring(firstEmojiIndex + 1, lastEmojiIndex).trim();
      // const afterLastEmoji = cleanText.substring(lastEmojiIndex + 1);
      
      // Apply gradient to the text between emojis (like "Parkour is open!")
      // Generate a gradient from FF5E55 to FFED55
      const chars = betweenEmojis.split('');
      const startColor = parseInt('FF5E55', 16);
      const endColor = parseInt('FFED55', 16);
      const step = (endColor - startColor) / (chars.length || 1);
      
      let gradientHtml = '';
      chars.forEach((char, i) => {
        if (char === ' ') {
          gradientHtml += ' ';
        } else {
          const color = Math.round(startColor + step * i).toString(16).padStart(6, '0');
          gradientHtml += `<span style="color:#${color}">${char}</span>`;
        }
      });
      
      return `<span style="color:#FF5555">🎮</span> ${gradientHtml} <span style="color:#FFAA00">🎮</span>`;
    }
  }
  
  // For the first line with server name and version
  if (text.includes('XRCraft Network') && text.includes('[')) {
    const cleanText = cleanMotdText(text);
    
    // Find the parts
    const versionStart = cleanText.indexOf('[');
    const versionEnd = cleanText.indexOf(']');
    
    if (versionStart !== -1 && versionEnd !== -1) {
      // const beforeVersion = cleanText.substring(0, versionStart).trim();
      const versionText = cleanText.substring(versionStart, versionEnd + 1);
      
      // Format with proper colors
      return `<span style="color:#FFAA00; font-weight:bold">XRCraft Network</span> <span style="color:#FF5555">${versionText}</span>`;
    }
  }
  
  // Default processing for other text
  let result = '';
  let i = 0;
  
  while (i < text.length) {
    // Handle §r reset sequence
    if (text.slice(i, i+2) === '§r') {
      i += 2;
      continue;
    }
    
    // Handle hex color codes in the format §#RRGGBB
    if (text.slice(i, i+2) === '§#' && i+8 <= text.length) {
      const hexColor = text.slice(i+2, i+8);
      const nextChar = text[i+8] || '';
      
      // Add the colored character
      result += `<span style="color:#${hexColor}">${nextChar}</span>`;
      i += 9; // Move past the color code and the character
      continue;
    }
    
    // Handle standard Minecraft color codes §e, §c, etc.
    if (text[i] === '\u00a7' && i+1 < text.length) {
      // const code = text[i+1].toLowerCase();
      i += 2; // Skip over the color code
      
      // Skip this character (it was a color code)
      continue;
    }
    
    // If no specific formatting was handled, just add the character
    result += text[i];
    i++;
  }
  
  return result;
}

// Function to create a formatted demo MOTD based on your exact format
function createExactDemoMotd() {
  return [
    "§r§e§lXRCraft Network§r§c [1.21.5 - 1.18.2]",
    "§r§o§r§r§c🎮§r§#FF5E55 §r§#FF6755P§r§#FF7055a§r§#FF7955r§r§#FF8255k§r§#FF8B55o§r§#FF9455u§r§#FF9D55r§r§#FFA655 §r§#FFAE55i§r§#FFB755s§r§#FFC055 §r§#FFC955o§r§#FFD255p§r§#FFDB55e§r§#FFE455n§r§#FFED55!§r§#FFF655 §r§e🎮§r"
  ];
}

export default function ServerStatusClient() {
  const serverIp = "play.xrcraftmc.com";
  const [,setRetryCount] = useState(0); 
  const [showRawMotd, setShowRawMotd] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const { data, error, isLoading, mutate } = useSWR(
    `https://api.mcsrvstat.us/3/${serverIp}`, 
    fetcher, 
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      errorRetryCount: 3,
      revalidateOnFocus: true,
    }
  );

  const handleRetry = async () => {
    setIsRefreshing(true);
    setRetryCount(prev => prev + 1);
    await mutate(); // Wait for the data to refresh
    setLastUpdated(new Date());
    
    // Add a slight delay before removing the refreshing state for better UX
    setTimeout(() => {
      setIsRefreshing(false);
    }, 300);
  };
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
      
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">play.xrcraftmc.com</h2>
          <button 
            onClick={handleRetry}
            className={`px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 flex items-center gap-1 ${isRefreshing ? 'opacity-75' : ''}`}
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
          </div>
        ) : error || !data ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="text-red-500 text-xl mb-4">Unable to connect to server</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The server may be offline or under maintenance.
            </p>
            <button 
              onClick={handleRetry}
              className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 ${isRefreshing ? 'opacity-75' : ''}`}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Trying...' : 'Try Again'}
            </button>
          </div>
        ) : !data.online ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="text-red-500 text-xl mb-4">Server Offline</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Minecraft server is currently offline.
            </p>
            <button 
              onClick={handleRetry}
              className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 ${isRefreshing ? 'opacity-75' : ''}`}
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
                <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded font-minecraft border-2 border-gray-300 dark:border-gray-600 shadow-inner overflow-hidden">
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
                    className="text-xs text-blue-500 hover:text-blue-700 underline mr-4"
                  >
                    Show in-game preview
                  </button>
                  
                  <button 
                    onClick={() => setShowRawMotd(!showRawMotd)}
                    className="text-xs text-blue-500 hover:text-blue-700 underline"
                  >
                    {showRawMotd ? 'Show formatted MOTD' : 'Show raw format'}
                  </button>
                  
                  <div id="minecraft-motd-preview" className="hidden mt-3 p-4 bg-gray-900 text-white rounded border border-gray-700 overflow-hidden max-w-md mx-auto shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 mr-2 bg-green-500 rounded-sm flex-shrink-0"></div>
                      <div>
                        <div className="font-bold">play.xrcraftmc.com</div>
                        <div className="text-xs text-gray-400">Minecraft Server</div>
                      </div>
                    </div>
                    
                    {/* Minecraft style MOTD with exact color parsing */}
                    <div className="font-minecraft text-sm mb-3 bg-gray-950 p-2 rounded">
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
                  <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded max-h-40 overflow-y-auto">
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

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">Join the Server</h2>
        <div className="mb-4 flex items-center flex-wrap">
          <p className="mr-2">To join the server, add</p>
          <button
            onClick={handleCopy}
            className={`relative bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded ml-1 cursor-pointer border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 active:scale-95 ${copied ? 'ring-2 ring-green-400' : ''}`}
            title="Click to copy IP"
            type="button"
          >
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
              <code className="font-mono text-base">{serverIp}</code>
            </span>
            {copied && (
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg animate-fade-in-out z-10 whitespace-nowrap">Copied!</span>
            )}
          </button>
          <p className="ml-2">to your Minecraft server list.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Supported Versions:</h3>
            <p>1.18.2 - 1.21.5</p>
          </div>
          <div>
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