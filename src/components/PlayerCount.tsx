'use client'

import useSWR from 'swr'

// Function to fetch data from the API
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PlayerCount({ serverIp }: { serverIp: string }) {
  const { data, error, isLoading } = useSWR(`https://api.mcsrvstat.us/3/${serverIp}`, fetcher, {
    refreshInterval: 60000 // Refresh every 60 seconds
  });

  if (isLoading) return <span className="text-gray-500">Loading players...</span>
  if (error || !data) return <span className="text-red-500">Server Offline / Error</span>
  if (!data.online) return <span className="text-red-500">Server Offline</span>

  return (
    <span className="font-semibold">
      {data.players.online} / {data.players.max}
    </span>
  );
}
