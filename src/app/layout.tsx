import "./globals.css";
import { ThemeProvider } from "./providers";
import dynamic from 'next/dynamic';
import { Metadata, Viewport } from 'next';
import Navbar from "@/components/Navbar";
import ClientSecretGame from "@/components/ClientSecretGame";
import { inter, rubik, pressStart2P, vt323 } from './fonts';
import ClientOnly from "@/components/ClientOnly";

// Dynamically import components with loading states
const Footer = dynamic(() => import('@/components/Footer'), { 
  loading: () => null 
});
const AnimatedLayout = dynamic(() => import('@/components/AnimatedLayout'), { 
  loading: () => null 
});

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#60a5fa' },
    { media: '(prefers-color-scheme: dark)', color: '#1e3a8a' },
  ],
};

// SEO Metadata
export const metadata: Metadata = {
  title: {
    template: '%s | XRCraft',
    default: 'XRCraft - VR Optimized Minecraft Server',
  },
  description: 'A VR optimized Minecraft server available on QuestCraft by default. ',
  keywords: ['minecraft', 'vr minecraft', 'questcraft', 'minecraft server', 'vr gaming', 'xrcraft'],
  metadataBase: new URL('https://xrcraftmc.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://xrcraftmc.com',
    siteName: 'XRCraftMC',
    title: 'XRCraftMC - VR Optimized Minecraft Server',
    description: 'A VR optimized Minecraft server available on QuestCraft by default',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'XRCraftMC Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XRCraftMC - VR Optimized Minecraft Server',
    description: 'A VR optimized Minecraft server available on QuestCraft by default',
    images: ['/logo.png'],
  },
  applicationName: 'XRCraftMC',
  appleWebApp: {
    capable: true,
    title: 'XRCraftMC',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable} ${rubik.variable} ${pressStart2P.variable} ${vt323.variable} scroll-smooth`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href={inter.style.fontFamily} />
        <link rel="preload" as="style" href={pressStart2P.style.fontFamily} />
        <link rel="preload" as="style" href={rubik.style.fontFamily} />
        <link rel="preload" as="style" href={vt323.style.fontFamily} />
      </head>
      <body
        className={`${inter.variable} ${pressStart2P.variable} ${rubik.variable} ${vt323.variable} bg-gray-900 text-white font-sans antialiased`}
      >
        <ClientOnly>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            enableColorScheme={false}
          >
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white">
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-grow container mx-auto px-4 pt-20 pb-8 w-full">
              <AnimatedLayout>{children}</AnimatedLayout>
            </main>
            <Footer />
          </ThemeProvider>
        </ClientOnly>
        <ClientSecretGame />
      </body>
    </html>
  );
}
