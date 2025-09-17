'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import { useTripleClick } from '@/hooks/useSecrets'

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
  const [secretActivated, setSecretActivated] = useState(false)
  const pathname = usePathname()

  // Secret game activation via triple click
  const activateSecret = () => {
    setSecretActivated(true)
    // Dispatch custom event for SecretGameWrapper
    window.dispatchEvent(new CustomEvent('activateSecretGame'))
  }
  
  const handleTripleClick = useTripleClick(activateSecret)

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
          ? 'bg-white/10 shadow-lg border-b border-white/20'
          : 'bg-white/5 border-b border-white/10'
      )}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo with secret triple-click */}
        <div onClick={handleTripleClick} className="cursor-pointer">
          <Link href="/" className="flex items-center group mc-hover">
            <div className="relative overflow-hidden rounded-lg pixel-border bg-black p-1">
              <Image
                src="/logo.png"
                alt="XRCraftMC Logo"
                width={40}
                height={40}
                className={clsx(
                  "h-10 w-auto transition-transform duration-300 group-hover:scale-110",
                  secretActivated && "animate-pulse"
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold text-white drop-shadow-md ml-3 hidden sm:inline group-hover:text-mcgold transition-colors pixel-font">
              XRCraftMC
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  'glass-nav-link',
                  pathname === link.href && 'active'
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
            className={clsx(
              'glass-btn p-2',
              isMobileMenuOpen && 'active'
            )}
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
          'md:hidden bg-white/10 backdrop-blur-md shadow-lg border-t border-white/10 transform transition-all duration-300 overflow-hidden',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="text-center">
              <Link
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  'glass-nav-link block w-full text-center',
                  pathname === link.href && 'active'
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
