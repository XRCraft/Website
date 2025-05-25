'use client';
import React, { useEffect, useState } from "react";
import PlayerCount from "@/components/PlayerCount";
import Link from "next/link";
import Image from "next/image";

// Pre-generate static particle positions to avoid hydration mismatch
// Using prime numbers to create less predictable patterns
const particles = Array(15).fill(0).map((_, i) => ({
  top: `${(i * 13 + 7) % 97}%`,
  left: `${(i * 17 + 11) % 93}%`,
  opacity: 0.2 + ((i * 3) % 7) * 0.1,
  animationDuration: `${12 + (i * 7) % 13}s`,
  animationDelay: `${(i * 5) % 7}s`,
  willChange: 'transform'
}));

export default function HomeClient() {
  const serverIp = "play.xrcraftmc.com";
  const [heroCopied, setHeroCopied] = useState(false);
  const [infoCopied, setInfoCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  // Generic copy function that can be reused for different parts of the UI
  const copyServerIP = async (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setter(true);
      setTimeout(() => setter(false), 1500);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const handleHeroCopy = () => copyServerIP(setHeroCopied);
  const handleInfoCopy = () => copyServerIP(setInfoCopied);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className={`relative overflow-hidden transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Background decoration */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/logo.png')] bg-no-repeat bg-center bg-contain will-change-transform"></div>
        </div>
        
        <div className="relative z-10 text-center py-8 md:py-12 bg-gradient-to-r from-black-600/80 to-grey-600/60 rounded-lg shadow-2xl pixel-border overflow-hidden max-w-3xl mx-auto"
          style={{ willChange: 'opacity, transform' }}>
          {/* Animated particles with pre-computed positions */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            {particles.map((particle, i) => (
              <div 
                key={i}
                className="absolute bg-white rounded-full w-2 h-2"
                style={{
                  top: particle.top,
                  left: particle.left,
                  opacity: particle.opacity,
                  animation: `float ${particle.animationDuration} linear infinite`,
                  animationDelay: particle.animationDelay
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Main title with simplified design and logo image */}
            <div className="mb-3 text-center">
              <div className="relative">
                <h2 className="text-4xl md:text-6xl text-white font-minecraft mb-2 relative z-10">
                  Welcome to
                </h2>
              </div>
              <div className="flex justify-center">
                <Image 
                  src="/XRCL.png" 
                  alt="XRCraft Logo" 
                  width={300} 
                  height={80} 
                  className="h-auto w-auto max-w-xs" 
                  priority
                />
              </div>
            </div>
            
            {/* Subtitle in dark box as shown in screenshot */}
            <div className="bg-black/40 py-1 px-8 rounded-md inline-block mb-5">
              <p className="text-lg md:text-xl text-white">
                VR Optimized Minecraft Server
              </p>
            </div>
            
            {/* Join box styled with pixel-border and backdrop blur */}
            <div className="bg-black-900/50 backdrop-blur-sm p-6 rounded-lg pixel-border shadow-2xl max-w-md w-full mx-auto">
               <div className="flex flex-col gap-4">
                {/* Server IP Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2H5z" />
                    </svg>
                    <span className="font-medium">Join us at:</span>
                  </div>
                  <button
                    onClick={handleHeroCopy}
                    className={`relative bg-black/30 px-2 py-1 rounded cursor-pointer border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${heroCopied ? 'ring-2 ring-green-400' : ''}`}
                    title="Click to copy server IP"
                    aria-label="Copy server IP to clipboard"
                  >
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
                      </svg>
                      <code className="font-mono text-blue-200">{serverIp}</code>
                    </span>
                    {heroCopied && (
                      <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap animate-pulse" role="status">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
                
                {/* Player count row */}
                <div className="bg-black/30 px-4 py-3 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white">Players Online:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayerCount serverIp={serverIp} />
                    <Link 
                      href="/status" 
                      className="text-blue-300 hover:text-blue-200 ml-2"
                    >
                      Server Status
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section 
        className={`grid md:grid-cols-2 gap-8 transition-all duration-700 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        style={{ willChange: 'opacity, transform' }}
      >
        <div className="bg-mcbrown p-6 rounded-lg shadow-lg pixel-border mc-card relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 z-0"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-white border-b-2 border-blue-400 pb-2 inline-block pixel-font">
              What is XRCraft?
            </h2>
            <p className="mb-4 text-white">
              XRCraft is a VR optimized Minecraft server that iss included in QuestCraft by default, 
              providing the best experience for VR players while remaining fully compatible with PC!
            </p>
            <p className="mb-6 text-white">
              Explore our gamemodes with a welcoming community.
            </p>
            <div className="flex items-center mt-4 bg-black/20 p-3 rounded-md pixel-border">
              <p className="text-sm font-semibold mr-2 text-white">Server IP:</p>
              <button
                onClick={handleInfoCopy}
                className={`relative bg-black/30 px-2 py-1 rounded cursor-pointer border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm hover:bg-black/50 active:scale-95 mc-button ${infoCopied ? 'ring-2 ring-green-400' : ''}`}
                title="Click to copy server IP"
                type="button"
                aria-label="Copy server IP to clipboard"
              >
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
                  </svg>
                  <code className="font-mono text-base text-blue-200">{serverIp}</code>
                </span>
                {infoCopied && (
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg animate-pulse z-10 whitespace-nowrap" role="status">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-mcbrown p-6 rounded-lg shadow-lg pixel-border mc-card relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 z-0"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-white border-b-2 border-blue-400 pb-2 inline-block pixel-font">
              Quick Links
            </h2>
            <ul className="space-y-3">
              {[
                { path: '/about', name: 'Learn More About Us', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { path: '/rules', name: 'Server Rules', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
                { path: '/servers', name: 'Available Servers', icon: 'M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 014.5-4.5h15a4.5 4.5 0 014.5 4.5m-4.5 6.75h-15' },
                { path: '/status', name: 'Server Status', icon: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z' },
                { path: '/socials', name: 'Our Socials', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.479m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
              ].map((link) => (
                <li key={link.path} className="transform hover:translate-x-2 transition-transform duration-200">
                  <Link 
                    href={link.path} 
                    className="text-blue-300 hover:text-blue-100 transition-colors flex items-center pixel-border bg-black/20 p-2 rounded-md hover:bg-black/30"
                    aria-label={link.name}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                    </svg>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section 
        className={`relative transition-all duration-700 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        style={{ willChange: 'opacity, transform' }}
      >
        <div className="bg-gradient-to-r from-yellow-600/80 to-orange-600/80 p-6 rounded-lg shadow-lg pixel-border overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
            <div className="bg-black/20 rounded-full p-3 flex-shrink-0">
              <svg className="w-10 h-10 text-yellow-300 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2 pixel-font">Coming Soon!</h3>
              <p className="text-yellow-100">
                XRCraft is currently in development and slated for release alongside QuestCraft 6.0.
                Join our Discord to stay updated and be the first to know when we launch!
              </p>
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-0">
              <a 
                href="https://discord.gg/5uNeeUWEFH" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200 flex items-center gap-2 mc-button"
                aria-label="Join our Discord server (opens in a new tab)"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
                  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.02.06.03.09.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
                </svg>
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section 
        className={`transition-all duration-700 delay-600 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        style={{ willChange: 'opacity, transform' }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center border-b-2 border-blue-400 pb-2 inline-block pixel-font">
          What Makes Us Special
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: 'VR Optimized', 
              description: 'Designed specifically for the best possible VR Minecraft experience',
              icon: 'M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z'
            },
            { 
              title: 'QuestCraft Ready', 
              description: 'Available by default on QuestCraft - no configuration needed',
              icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9'
            },
            { 
              title: 'Community Focused', 
              description: 'Built by players, for players, with active development',
              icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.479m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
            },
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-mcbrown p-6 rounded-lg shadow-lg pixel-border mc-card flex flex-col items-center text-center"
              style={{ willChange: 'transform' }}
            >
              <div className="bg-blue-600 rounded-full p-4 mb-4">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={1.5}
                  aria-hidden="true"
                  role="img"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white pixel-font">{feature.title}</h3>
              <p className="text-blue-100">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
