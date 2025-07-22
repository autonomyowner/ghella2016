import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Cairo } from 'next/font/google'
import "./globals.css";
import "./performance.css";
import ClientLayout from "@/components/ClientLayout";

type Viewport = {
  themeColor: string
  width: string
  initialScale: number
  maximumScale: number
  userScalable: boolean
}

// Optimized font loading with display swap
const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-cairo',
  preload: true,
  weight: ['300', '400', '600', '700', '900'],
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
})

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: "الغلة - منصة التكنولوجيا الزراعية",
  description: "منصة متطورة تربط المزارعين والمشترين والموردين في جميع أنحاء الجزائر. تجارة المنتجات الزراعية والأدوات والأراضي بتقنية 2030",
  keywords: "زراعة, الجزائر, مزارع, منتجات زراعية, معدات زراعية, أراضي زراعية",
  authors: [{ name: "الغلة" }],
  creator: "الغلة",
  publisher: "الغلة",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://elghella.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "الغلة - منصة التكنولوجيا الزراعية",
    description: "منصة متطورة تربط المزارعين والمشترين والموردين في جميع أنحاء الجزائر",
    url: 'https://elghella.com',
    siteName: 'الغلة',
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: '/assets/n7l1.webp',
        width: 1200,
        height: 630,
        alt: 'الغلة - منصة التكنولوجيا الزراعية',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "الغلة - منصة التكنولوجيا الزراعية",
    description: "منصة متطورة تربط المزارعين والمشترين والموردين في جميع أنحاء الجزائر",
    images: ['/assets/n7l1.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'الغلة',
    'application-name': 'الغلة',
    'msapplication-TileColor': '#2d5016',
    'theme-color': '#2d5016',
  },
};

export const viewport: Viewport = {
  themeColor: '#2d5016',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable} font-sans`} suppressHydrationWarning>
      <head>
        {/* Critical resource preloading */}
        <link rel="preload" href="/assets/Videoplayback1.mp4" as="video" type="video/mp4" fetchPriority="high" />
        <link rel="preload" href="/assets/n7l1.webp" as="image" type="image/webp" fetchPriority="high" />
        <link rel="preload" href="/assets/n7l2.webp" as="image" type="image/webp" fetchPriority="high" />
        
        {/* Font preloading with optimized loading */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" as="style" />
        <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" as="style" />
        
        {/* Load Font Awesome for icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="//firebase.co" />
        <link rel="dns-prefetch" href="//firebasestorage.googleapis.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" href="/globe.svg?v=3" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/placeholder.png?v=3" />
        <link rel="manifest" href="/manifest.json?v=3" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#2d5016" />
        <meta name="msapplication-TileColor" content="#2d5016" />
        
        {/* Performance hints */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Cache control for development */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* PWA meta tags */}
        <meta name="application-name" content="الغلة" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="الغلة" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/marketplace" />
        <link rel="prefetch" href="/equipment" />
        <link rel="prefetch" href="/land" />
        <link rel="prefetch" href="/services" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
