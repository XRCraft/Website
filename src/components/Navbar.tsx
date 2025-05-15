'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'

// Extracted navigation links
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/rules', label: 'Rules' },
  { href: '/servers', label: 'Servers' },
  { href: '/status', label: 'Server Status' },
  { href: '/socials', label: 'Socials' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    }

    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <nav
      role="navigation"
      className={clsx(
        'backdrop-blur-md sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-mcbrown bg-opacity-90 shadow-lg'
          : 'bg-mcgreen bg-opacity-60 pixel-border'
      )}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center group mc-hover">
          <div className="relative overflow-hidden rounded-lg pixel-border bg-black p-1">
            <Image
              src="/logo.png"
              alt="XRCraftMC Logo"
              width={40}
              height={40}
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="text-xl font-bold text-white drop-shadow-md ml-3 hidden sm:inline group-hover:text-mcgold transition-colors pixel-font">
            XRCraftMC
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  'transition-all duration-200 px-3 py-2 rounded mc-button hover:bg-mcbrown hover:text-white',
                  pathname === link.href
                    ? 'bg-mcbrown text-white pixel-border'
                    : 'text-white hover:scale-105'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            id="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-auto p-1 rounded-md text-white bg-mcbrown pixel-border hover:bg-mcgreen focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mcsky mc-button"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
          >
            <span className="sr-only">{isMobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
            {isMobileMenuOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <div
        id="mobile-menu"
        aria-hidden={!isMobileMenuOpen}
        aria-labelledby="mobile-menu-button"
        className={clsx(
          'md:hidden absolute top-full left-0 right-0 bg-mcgreen pixel-border shadow-lg transform transition-all duration-300 overflow-hidden',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  'block px-3 py-2 rounded-md mc-button transition-all duration-200 hover:bg-mcbrown hover:text-white pixel-border',
                  pathname === link.href ? 'bg-mcbrown text-white' : 'text-white'
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
