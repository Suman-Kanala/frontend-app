import { ReactNode } from 'react';
import { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Providers from './providers';
import ClientLayout from './client-layout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://saanvicareers.com'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  title: {
    default: 'Saanvi Careers - Careers Connected | Professional Employment Services',
    template: '%s | Saanvi Careers',
  },
  description:
    'Saanvi Careers connects talent with opportunities across IT, Engineering, Healthcare, Finance sectors globally.',
  keywords: ['careers', 'jobs', 'Gen AI', 'LMS', 'interview support', 'online courses', 'placement'],
  openGraph: {
    siteName: 'Saanvi Careers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface OrgSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  sameAs: string[];
}

const orgSchema: OrgSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Saanvi Careers',
  url: 'https://saanvicareers.com',
  description: 'Professional employment services and online learning platform',
  sameAs: [],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}',{page_path:window.location.pathname});`}
            </Script>
          </>
        )}
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
