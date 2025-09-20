'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ServersPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedIP, setCopiedIP] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const serverIp = "play.xrcraftmc.com";

  const copyServerIP = async () => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopiedIP(true);
      setTimeout(() => setCopiedIP(false), 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const serversAtLaunch = [
    { 
      name: "Survival", 
      description: "Pure vanilla survival experience with no land protection - build, explore, and survive!",
      icon: "⛏️",
      color: "from-mcgreen to-mcemerald",
      difficulty: "Hard",
      players: "100"
    },
    { 
      name: "Bedwars", 
      description: "Protect your bed and destroy others in this fast-paced PvP gamemode!",
      icon: "🛏️",
      color: "from-mcred to-mcorange",
      difficulty: "Medium",
      players: "16"
    },
    { 
      name: "FFA", 
      description: "Free-for-all PvP arena - test your combat skills against everyone!",
      icon: "⚔️",
      color: "from-mcred to-mcgold",
      difficulty: "Hard",
      players: "50"
    },
    { 
      name: "Parkour", 
      description: "Challenge yourself with precision jumping and battle out with friends!",
      icon: "🏃‍♂️",
      color: "from-mcblue to-mcdiamond",
      difficulty: "Easy",
      players: "200"
    },
    { 
      name: "Minigames", 
      description: "Collection of many fun mini-games to play with friends and have fun!",
      icon: "🎮",
      color: "from-mcpurple to-mcpink",
      difficulty: "Easy",
      players: "32",
      comingSoon: true
    },
  ];

  const serversLater = [
    { 
      name: "Economy", 
      description: "Trade, Claim land, Crash the stock market, and become the richest player on the server!",
      icon: "💰",
      color: "from-mcgold to-mcdiamond",
      difficulty: "Medium",
      players: "100",
      comingSoon: true
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-10">
      {/* Enhanced Header */}
      <div className={`text-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          Our Servers
        </h1>
        <p className="text-xl text-gray-800 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Choose your adventure! Each server offers unique gameplay experiences optimized for both VR and PC players.
        </p>
      </div>

      {/* Available Servers */}
      <section className={`transition-all duration-700 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
            🚀 Available Now
          </h2>
          <p className="text-lg text-gray-800 dark:text-gray-400">Jump in and start playing these amazing game modes!</p>
        </div>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
          {serversAtLaunch.map((server, index) => (
            <div 
              key={index}
              className="glass-container hover:glass-container transition-all duration-300 hover:scale-105 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{server.icon}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold glass-light ${getDifficultyColor(server.difficulty)}`}>
                    {server.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-bold glass-light text-blue-600 dark:text-blue-400">
                    👥 {server.players}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {server.name}
              </h3>
              
              <p className="text-gray-800 dark:text-gray-300 leading-relaxed mb-4 flex-grow min-h-[4rem]">
                {server.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 dark:text-green-400 font-semibold">Available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Servers */}
      <section className={`transition-all duration-700 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            🔮 Coming Soon
          </h2>
          <p className="text-lg text-gray-800 dark:text-gray-400">Exciting new game modes we're working on!</p>
        </div>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
          {serversLater.map((server, index) => (
            <div 
              key={index}
              className="glass-container transition-all duration-300 hover:scale-105 relative overflow-hidden group opacity-75 m-2"
            >
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 bg-purple-600 dark:bg-purple-500 px-3 py-1 rounded-full text-white font-bold text-sm z-20 animate-pulse">
                Coming Soon
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl opacity-60">{server.icon}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold glass-light opacity-50 ${getDifficultyColor(server.difficulty)}`}>
                    {server.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-bold glass-light opacity-50 text-blue-600 dark:text-blue-400">
                    👥 {server.players}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 opacity-80">
                {server.name}
              </h3>
              
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-4 flex-grow min-h-[4rem] opacity-70">
                {server.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">In Development</span>
                </div>
                <button className="glass-btn opacity-50 cursor-not-allowed" disabled>
                  Coming Soon
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className={`text-center transition-all duration-700 delay-600 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="glass-container max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Ready to Play?
          </h3>
          <p className="text-gray-800 dark:text-gray-300 text-lg mb-6">
            Connect to <button
              onClick={copyServerIP}
              className={`glass-light px-2 py-1 rounded font-bold cursor-pointer transition-all duration-200 hover:scale-105 relative text-blue-600 dark:text-blue-400 ${copiedIP ? 'ring-2 ring-green-400' : ''}`}
              title="Click to copy server IP"
            >
              play.xrcraftmc.com
              {copiedIP && (
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap animate-pulse">
                  Copied!
                </span>
              )}
            </button> and start your adventure!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={copyServerIP}
              className={`glass-btn transition-all duration-200 hover:scale-105 relative ${copiedIP ? 'ring-2 ring-green-400' : ''}`}
            >
              🎮 {copiedIP ? 'IP Copied!' : 'Join Now'}
              {copiedIP && (
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded shadow-lg z-10 whitespace-nowrap animate-pulse">
                  Server IP copied to clipboard!
                </span>
              )}
            </button>
            <Link 
              href="/status"
              className="glass-btn text-center hover:scale-105 transition-all duration-200"
            >
              📊 Server Status
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
