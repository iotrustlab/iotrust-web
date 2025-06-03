import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from '@/components/theme-provider';
import { SiteLayout } from '@/layouts/site-layout';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://iotrust-lab.com' : 'http://localhost:3000'),
  title: {
    template: '%s | IoTrust Lab',
    default: 'IoTrust Lab',
  },
  description: "Research lab focused on IoT security and trust. Advancing the state of the art in secure Internet of Things systems.",
  keywords: ['IoT', 'security', 'research', 'trust', 'Internet of Things'],
  authors: [{ name: 'IoTrust Lab' }],
  creator: 'IoTrust Lab',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://iotrust-lab.com',
    siteName: 'IoTrust Lab',
    title: 'IoTrust Lab',
    description: 'Research lab focused on IoT security and trust. Advancing the state of the art in secure Internet of Things systems.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'IoTrust Lab',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@iotrustlab',
    creator: '@iotrustlab',
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
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
