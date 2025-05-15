'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'

// Function to fetch data from the API
const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) }); // 5 second timeout
    if (!res.ok) {
      throw new Error(`Failed to fetch server status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching server status:', error);
    throw error;
  }
};

export default function PlayerCount({ serverIp }: { serverIp: string }) {
  const [animate, setAnimate] = useState(false);
  
  // Animation effect on successful updates
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const { data, error, isLoading, mutate } = useSWR(
    `https://api.mcsrvstat.us/3/${serverIp}`, 
    fetcher, 
    {
      refreshInterval: 60000, // Refresh every 60 seconds
      errorRetryCount: 3,
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      onSuccess: () => setAnimate(true),
      suspense: false,
      keepPreviousData: true,
      shouldRetryOnError: (err) => {
        console.warn('Error in PlayerCount fetcher:', err);
        return true; // Still retry on error
      }
    }
  );

  // Handle manual retry
  const handleRetry = () => {
    mutate(); // Re-fetch data
  };

  if (isLoading) {
    return (
      <span className="inline-flex items-center">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="font-minecraft-alt text-blue-200">Checking...</span>
      </span>
    );
  }
  
  if (error || !data) {
    return (
      <span className="inline-flex items-center gap-2 bg-red-900/30 px-2 py-1 rounded-md">
        <svg className="h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-red-300 font-minecraft-alt">Offline</span>
        <button 
          onClick={handleRetry} 
          className="ml-1 text-blue-300 hover:text-blue-200 text-xs bg-blue-900/30 px-2 py-0.5 rounded transition-colors"
          aria-label="Retry loading server status"
        >
          Retry
        </button>
      </span>
    );
  }
  
  if (!data.online) {
    return (
      <span className="inline-flex items-center gap-2 bg-red-900/30 px-2 py-1 rounded-md">
        <svg className="h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-red-300 font-minecraft-alt">Offline</span>
        <button 
          onClick={handleRetry} 
          className="ml-1 text-blue-300 hover:text-blue-200 text-xs bg-blue-900/30 px-2 py-0.5 rounded transition-colors"
          aria-label="Retry loading server status"
        >
          Retry
        </button>
      </span>
    );
  }

  // Calculate percentage of server capacity
  const percentFull = (data.players.online / data.players.max) * 100;
  let statusColor = 'bg-green-500';
  let statusIndicator = '';
  
  if (percentFull > 90) {
    statusColor = 'bg-red-500';
    statusIndicator = 'Almost full!';
  } else if (percentFull > 70) {
    statusColor = 'bg-yellow-500';
    statusIndicator = 'Quite busy';
  } else if (percentFull > 40) {
    statusColor = 'bg-blue-500';
    statusIndicator = 'Active';
  } else {
    statusIndicator = 'Open';
  }

  return (
    <span className={`font-semibold inline-flex items-center gap-2 transition-all duration-300 ${animate ? 'scale-110' : 'scale-100'}`}>
      <span className="relative h-5 w-20 bg-black/30 rounded-full overflow-hidden">
        <span 
          className={`absolute h-full rounded-full transition-all duration-700 ease-in-out ${statusColor}`} 
          style={{ width: `${percentFull}%` }}
          title={statusIndicator}
          role="progressbar"
          aria-valuenow={data.players.online}
          aria-valuemin={0}
          aria-valuemax={data.players.max}
          aria-label={`${data.players.online} of ${data.players.max} players online. Status: ${statusIndicator}`}
        ></span>
        <span className="absolute inset-0 flex items-center justify-center text-xs text-white drop-shadow-md">
          <span className="translate-y-px">{data.players.online} / {data.players.max}</span>
        </span>
      </span>
    </span>
  );
}
