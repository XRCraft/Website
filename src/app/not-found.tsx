'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Pre-generate particle positions for visual effects
const particles = Array(20).fill(0).map((_, i) => ({
  top: `${(i * 13 + 7) % 97}%`,
  left: `${(i * 17 + 11) % 93}%`,
  opacity: 0.1 + ((i * 3) % 7) * 0.05,
  animationDuration: `${15 + (i * 7) % 10}s`,
  animationDelay: `${(i * 5) % 8}s`,
  scale: 0.5 + ((i * 2) % 5) * 0.1,
}));

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [serverCopied, setServerCopied] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Trigger periodic glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Copy server IP function
  const copyServerIP = async () => {
    try {
      await navigator.clipboard.writeText('play.xrcraftmc.com');
      setServerCopied(true);
      setTimeout(() => setServerCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {particles.map((particle, i) => (
            <div 
              key={i}
              className="absolute bg-red-400 rounded-full"
              style={{
                top: particle.top,
                left: particle.left,
                opacity: particle.opacity,
                width: `${8 * particle.scale}px`,
                height: `${8 * particle.scale}px`,
                animation: `float ${particle.animationDuration} linear infinite`,
                animationDelay: particle.animationDelay
              }}
            />
          ))}
        </div>
      )}

      {/* Main 404 Content */}
      <div 
        className={`relative z-10 text-center p-8 max-w-4xl mx-auto transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-gray-900/40 rounded-lg blur-sm"></div>
        
        <div className="relative bg-black-900/70 backdrop-blur-sm p-8 md:p-12 rounded-lg pixel-border shadow-2xl">
          {/* 404 with glitch effect */}
          <div className="mb-8">
            <h1 
              className={`text-8xl md:text-9xl font-bold text-red-400 pixel-font mb-4 ${
                glitchActive && !prefersReducedMotion ? 'animate-pulse' : ''
              }`}
              style={{
                textShadow: glitchActive && !prefersReducedMotion 
                  ? '3px 0 0 #ff0000, -3px 0 0 #00ffff, 0 3px 0 #ffff00' 
                  : '2px 2px 0 #000'
              }}
            >
              404
            </h1>
            <div className="w-32 h-1 bg-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Error message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 pixel-font">
              You have fallen into the void!
            </h2>
            <p className="text-lg text-gray-400">
              The page you&apos;re looking for doesn&apos;t exist on this server.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 pixel-border flex items-center gap-2 transform hover:scale-105 mc-button"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return Home
            </Link>
            
            <Link 
              href="/servers"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 pixel-border flex items-center gap-2 transform hover:scale-105 mc-button"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 014.5-4.5h15a4.5 4.5 0 014.5 4.5m-4.5 6.75h-15" />
              </svg>
              View Servers
            </Link>
          </div>

          {/* Quick navigation */}
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400 mb-4 font-semibold">Maybe you were looking for:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { path: '/about', name: 'About Us', icon: 'ℹ️' },
                { path: '/rules', name: 'Rules', icon: '📋' },
                { path: '/status', name: 'Status', icon: '📊' },
                { path: '/socials', name: 'Socials', icon: '🌐' },
              ].map((link) => (
                <Link 
                  key={link.path}
                  href={link.path} 
                  className="text-blue-300 hover:text-blue-100 transition-colors bg-black/30 p-3 rounded-md pixel-border hover:bg-black/50 text-center transform hover:scale-105 duration-200"
                >
                  <div className="text-xl mb-1">{link.icon}</div>
                  <div className="text-sm font-medium">{link.name}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Server IP reminder */}
          <div className="mt-8 bg-black/30 p-4 pb-8 rounded-lg pixel-border">
            <p className="text-gray-300 text-sm mb-2">
              Still want to play? Join us at:
            </p>
            <button
              onClick={copyServerIP}
              className={`relative bg-black/30 px-3 py-2 rounded cursor-pointer border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 hover:bg-black/50 active:scale-95 ${serverCopied ? 'ring-2 ring-green-400' : ''}`}
              title="Click to copy server IP"
              aria-label="Copy server IP to clipboard"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
                </svg>
                <code className="text-blue-300 font-mono text-lg">
                  play.xrcraftmc.com
                </code>
              </span>
              {serverCopied && (
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap animate-pulse" role="status">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
}
