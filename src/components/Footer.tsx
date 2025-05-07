'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const serverIp = "play.xrcraftmc.com";
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  const socialLinks = [
    { name: 'Discord', url: 'https://discord.gg/5uNeeUWEFH' },
    { name: 'Bluesky', url: 'https://bsky.app/profile/xrcraftmc.com' },
    { name: 'GitHub', url: 'https://github.com/XRCraft' },
  ];
  
  const footerLinks = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Rules', url: '/rules' },
    { name: 'Servers', url: '/servers' },
    { name: 'Status', url: '/status' },
    { name: 'Socials', url: '/socials' },
  ];
  
  return (
    <footer className="bg-mcbrown pixel-border mt-12 text-mcsky font-minecraft shadow-lg relative">
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About XRCraftMC</h3>
            <p className="text-sm mb-4">
              A VR optimized Minecraft server available on QuestCraft by default. Experience Minecraft like never before!
            </p>
            <p className="text-sm flex items-center gap-2">
              Server IP: 
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
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.url} className="hover:underline transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Connect With Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2 text-sm">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="grass-block-bg" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '40px', zIndex: 0 }} aria-hidden="true"></div>
      <div
        className="absolute left-1/2 bottom-0 z-10"
        style={{
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.5)',
          color: '#232323',
          minHeight: '40px',
          height: '40px',
          borderRadius: '0.5rem 0.5rem 0 0', // Only round the top corners
          padding: '0.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '90vw',
        }}
      >
        <span style={{ textAlign: 'center', fontSize: '0.75rem', lineHeight: '40px', display: 'block', whiteSpace: 'nowrap' }}>
          © {currentYear} XRCraftMC. All rights reserved. XRCraft is not affiliated with Mojang Studios or Microsoft.
        </span>
      </div>
    </footer>
  );
}
