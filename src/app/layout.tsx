import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@/components/google-analytics';
import { JsonLd } from '@/components/json-ld';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteLayout } from '@/layouts/site-layout';
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGES,
  absoluteUrl,
  createMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  ...createMetadata(),
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    template: '%s | IOTrust Lab',
    default: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'academic research',
  referrer: 'strict-origin-when-cross-origin',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl(SOCIAL_IMAGES.default),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} social preview`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@iotrustlab',
    creator: '@iotrustlab',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(SOCIAL_IMAGES.default)],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <GoogleAnalytics />
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteLayout>
            {children}
          </SiteLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
