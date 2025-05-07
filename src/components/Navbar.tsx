'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/rules", label: "Rules" },
    { href: "/servers", label: "Servers" },
    { href: "/status", label: "Server Status" },
    { href: "/socials", label: "Socials" },
  ]

  return (
    <nav className="bg-mcgreen pixel-border shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="XRCraftMC Logo"
            width={40}
            height={40}
            className="h-10 w-auto mr-2 pixel-border bg-mcbrown"
          />
          <span className="text-xl font-bold text-mcstone font-minecraft hidden sm:inline drop-shadow-md">
            XRCraftMC
          </span>
        </Link>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:bg-mcbrown hover:text-mcsky font-minecraft transition-colors px-3 py-2 rounded pixel-border ${
                pathname === link.href ? 'bg-mcbrown text-mcsky' : ''
              }`}>
              {link.label}
            </Link>
          ))}
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-auto p-1 rounded-md text-mcstone bg-mcbrown pixel-border hover:bg-mcgreen focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mcsky"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-mcgreen pixel-border shadow-lg" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md font-minecraft hover:bg-mcbrown hover:text-mcsky pixel-border transition-colors ${
                  pathname === link.href ? 'bg-mcbrown text-mcsky' : ''
                }`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
