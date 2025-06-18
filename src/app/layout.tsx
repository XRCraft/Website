import { Inter, Press_Start_2P, VT323, Rubik } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import dynamic from 'next/dynamic';
import { Metadata, Viewport } from 'next';
import Navbar from "@/components/Navbar";

// Dynamically import components that aren't needed for initial page render
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });
const AnimatedLayout = dynamic(() => import('@/components/AnimatedLayout'), { ssr: true });

// Fonts
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-minecraft" });
const vt323 = VT323({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-minecraft-alt" });
const rubik = Rubik({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${inter.variable} ${pressStart2P.variable} ${vt323.variable} ${rubik.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme={false}
        >
          {/* Minecraft particles effect (optional decorative element) */}
          <div className="particles" aria-hidden="true">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full w-1 h-1 opacity-30"
                style={{
                  top: `${(Math.sin(i * 0.5) * 0.5 + 0.5) * 100}%`,
                  left: `${(Math.cos(i * 0.7) * 0.5 + 0.5) * 100}%`,
                  animation: `float ${10 + i % 8 * 2.5}s linear infinite`,
                  animationDelay: `${i * 0.7}s`,
                  willChange: 'transform'
                }}
              />
            ))}
          </div>
          
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white">
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-grow container mx-auto px-4 py-8 w-full">
            <AnimatedLayout>{children}</AnimatedLayout>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
