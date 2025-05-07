'use client';
import React from "react";
import PlayerCount from "@/components/PlayerCount";
import Link from "next/link";

export default function HomeClient() {
  const serverIp = "play.xrcraftmc.com";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* ...existing JSX code for the page... */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to XRCraft!</h1>
        <p className="text-xl text-white mb-6">VR Optimized!</p>
        <div className="inline-block bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-3 rounded-md shadow-md">
          <p className="text-lg font-semibold flex items-center justify-center gap-2">
            Join us at:
            <button
              onClick={handleCopy}
              className={`relative bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded ml-1 cursor-pointer border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 active:scale-95 ${copied ? 'ring-2 ring-green-400' : ''}`}
              title="Click to copy IP"
              type="button"
              style={{ minWidth: 140 }}
            >
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                <code className="font-mono text-base">{serverIp}</code>
              </span>
              {copied && (
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg animate-fade-in-out z-10 whitespace-nowrap">Copied!</span>
              )}
            </button>
          </p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span>Players Online: <PlayerCount serverIp={serverIp} /></span>
            <Link 
              href="/status" 
              className="text-blue-500 hover:text-blue-700 text-sm underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Server Status
            </Link>
          </div>
        </div>
      </section>
      {/* ...rest of the page JSX... */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">What is XRCraft?</h2>
          <p className="mb-2">XRCraft is a VR optimized server that is available on QuestCraft by default.</p>
          <p className="mb-4">The server is VR optimized and works best on VR and PC.</p>
          <div className="flex items-center mt-2">
            <p className="text-sm font-semibold mr-2">Server IP:</p>
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
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Quick Links</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><a href="/about" className="text-blue-600 hover:underline dark:text-blue-400">Learn More About Us</a></li>
            <li><a href="/rules" className="text-blue-600 hover:underline dark:text-blue-400">Server Rules</a></li>
            <li><a href="/servers" className="text-blue-600 hover:underline dark:text-blue-400">Available Servers</a></li>
            <li><a href="/status" className="text-blue-600 hover:underline dark:text-blue-400">Server Status</a></li>
            <li><a href="/socials" className="text-blue-600 hover:underline dark:text-blue-400">Our Socials</a></li>
          </ul>
        </div>
      </section>
      <section className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-600 p-4 rounded-md shadow">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Coming Soon!</h3>
        <p className="text-yellow-700 dark:text-yellow-200">XRCraft is currently in development and slated for release alongside QuestCraft 6.0. Stay tuned!</p>
      </section>
    </div>
  );
}
