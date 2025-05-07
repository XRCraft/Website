import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata, Viewport } from 'next';
import AnimatedLayout from "@/components/AnimatedLayout";

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
    template: '%s | XRCraftMC',
    default: 'XRCraftMC - VR Optimized Minecraft Server',
  },
  description: 'A VR optimized Minecraft server available on QuestCraft by default. Join us for Survival, Bedwars, Minigames and more.',
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
        width: 1200,
        height: 630,
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

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col font-minecraft`}>
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
          <main id="main-content" className="flex-grow container mx-auto px-4 py-8 w-full font-minecraft">
            <AnimatedLayout>{children}</AnimatedLayout>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
