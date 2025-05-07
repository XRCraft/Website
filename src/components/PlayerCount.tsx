'use client'

import useSWR from 'swr'

// Function to fetch data from the API
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch server status');
  }
  return res.json();
};

export default function PlayerCount({ serverIp }: { serverIp: string }) {
  const { data, error, isLoading, mutate } = useSWR(
    `https://api.mcsrvstat.us/3/${serverIp}`, 
    fetcher, 
    {
      refreshInterval: 60000, // Refresh every 60 seconds
      errorRetryCount: 3,
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  // Handle manual retry
  const handleRetry = () => {
    mutate(); // Re-fetch data
  };

  if (isLoading) {
    return (
      <span className="text-gray-500 inline-flex items-center">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Checking...
      </span>
    );
  }
  
  if (error || !data) {
    return (
      <span className="text-red-500 inline-flex items-center">
        Server Offline / Error
        <button 
          onClick={handleRetry} 
          className="ml-2 text-blue-500 hover:text-blue-700 underline text-xs"
          aria-label="Retry loading server status"
        >
          Retry
        </button>
      </span>
    );
  }
  
  if (!data.online) {
    return (
      <span className="text-red-500 inline-flex items-center">
        Server Offline
        <button 
          onClick={handleRetry} 
          className="ml-2 text-blue-500 hover:text-blue-700 underline text-xs"
          aria-label="Retry loading server status"
        >
          Retry
        </button>
      </span>
    );
  }

  return (
    <span className="font-semibold">
      {data.players.online} / {data.players.max}
    </span>
  );
}
