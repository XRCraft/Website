'use client';
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

// Footer links
const FOOTER_LINKS = [
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about' },
  { name: 'Rules', url: '/rules' },
  { name: 'Servers', url: '/servers' },
  { name: 'Status', url: '/status' },
  { name: 'Socials', url: '/socials' }
]
const SOCIAL_LINKS = [
  { 
    name: 'Discord', 
    url: 'https://discord.gg/5uNeeUWEFH',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Bluesky_logo_%28black%29.svg/1200px-Bluesky_logo_%28black%29.svg.png">
        <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.02.06.03.09.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
      </svg>
    )
  },
  { 
    name: 'Bluesky', 
    url: 'https://bsky.app/profile/xrcraftmc.com',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 288 288" xmlns="http://www.w3.org/2000/svg">
        <path d="M144 0C64.47 0 0 64.47 0 144c0 79.53 64.47 144 144 144s144-64.47 144-144C288 64.47 223.53 0 144 0zm47.16 91c.96 0 1.73.77 1.73 1.73v76.58c-.09 11.67-8.61 21.77-20.26 23.76-1.51.16-3.19.31-4.89.31-17.99 0-32.59-14.61-32.59-32.6 0-17.99 14.6-32.6 32.59-32.6 1.72 0 3.38.15 5.08.45.92.15 1.54 1.02 1.4 1.94-.15.92-1.04 1.56-1.94 1.4a29.738 29.738 0 0 0-4.53-.39c-16.08 0-29.17 13.09-29.17 29.2 0 16.09 13.09 29.19 29.17 29.19 1.6 0 3.13-.14 4.5-.28 9.74-1.69 16.93-10.1 17-19.97V94.61h-38.43c-.96 0-1.74-.78-1.74-1.73 0-.96.78-1.73 1.74-1.73h38.43l.05-.02 1.86-.13zm-86.89 43.05c5.67 0 11.1 1.3 16.15 3.91.87.45 1.21 1.52.76 2.38-.45.86-1.51 1.2-2.38.76a29.764 29.764 0 0 0-14.53-3.58c-16.09 0-29.2 13.09-29.2 29.2 0 16.08 13.11 29.17 29.2 29.17 11.69 0 22.13-6.93 26.74-17.66.32-.74 1.18-1.08 1.91-.76.74.32 1.08 1.17.76 1.91-5.13 11.99-16.97 19.71-29.42 19.71-17.99 0-32.6-14.61-32.6-32.6 0-17.99 14.61-32.59 32.6-32.59l.01.15z"/>
      </svg>
    )
  },
  { 
    name: 'GitHub', 
    url: 'https://github.com/XRCraft',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    )
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const serverIp = 'play.xrcraftmc.com'
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy text: ', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = serverIp;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (err) {
        console.error('Fallback copy method failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };
  
  return (
    <footer className="mt-12 relative text-white">
      {/* Decorative top grass border */}
      <div className="grass-block-bg rotate-180" aria-hidden="true" />
      
      <div className="bg-mcbrown pixel-border pt-12 pb-16 shadow-xl relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* About Section */}
            <div className="md:pr-6">
              <div className="flex items-center mb-4">
                <div className="relative mr-3 pixel-border bg-black p-1 rounded-lg overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="XRCraftMC Logo"
                    width={40}
                    height={40}
                    className="h-8 w-8"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
                </div>
                <h3 className="text-lg font-semibold pixel-font">XRCraftMC</h3>
              </div>
              <p className="text-sm mb-4">
                A VR optimized Minecraft server available on QuestCraft by default. Experience Minecraft like never before!
              </p>
              <div className="flex items-center gap-2 bg-black/20 p-3 rounded-md pixel-border">
                <span className="text-sm">Server IP:</span>
                <button
                  onClick={handleCopy}
                  className={clsx(
                    'relative bg-black/30 px-2 py-1 rounded cursor-pointer border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mc-button',
                    { 'ring-2 ring-green-400': copied }
                  )}
                  title="Click to copy IP"
                  type="button"
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                    <code className="font-mono text-base text-blue-300">{serverIp}</code>
                  </span>
                  {copied && (
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Quick Links */}
            <nav aria-label="Quick Links">
              <h3 className="text-lg font-semibold mb-4 pb-1 border-b-2 border-blue-400 pixel-font">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.url}
                      className="flex items-center hover:text-blue-300 transition-transform duration-200 transform hover:translate-x-2"
                      aria-label={`Go to ${link.name} page`}
                    >
                      <span className="w-3 h-3 mr-2 inline-block" aria-hidden="true">
                        {/* Arrow icon */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                          <path d="M9 6L15 12L9 18" />
                        </svg>
                      </span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Connect With Us */}
            <section aria-labelledby="social-heading">
              <h3 id="social-heading" className="text-lg font-semibold mb-4 pb-1 border-b-2 border-blue-400 pixel-font">Connect With Us</h3>
              <ul className="space-y-3 text-sm">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full px-3 py-2 bg-black/20 hover:bg-black/30 rounded-md pixel-border transition-colors"
                      aria-label={`${link.name} - opens in a new tab`}
                    >
                      <span className="w-6 h-6 mr-2 flex items-center justify-center" aria-hidden="true">{link.icon}</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
      
      {/* Bottom grass border */}
      <div className="grass-block-bg" aria-hidden="true" />
      
      {/* Copyright Bar */}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 z-10 bg-black/80 backdrop-blur-sm text-white rounded-t-lg py-2 px-6 text-center max-w-[90vw] shadow-lg border-2 border-white/10 border-b-0">
        <span className="text-xs whitespace-nowrap">
          © {currentYear} XRCraftMC. All rights reserved. XRCraft is not affiliated with Mojang Studios or Microsoft.
        </span>
      </div>
    </footer>
  );
}
