
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthCartSync } from '@/components/AuthCartSync';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'ArtEcho | Discover Unique Artisan Creations',
    template: '%s | ArtEcho',
  },
  description: 'Explore and purchase one-of-a-kind, handcrafted pieces from independent artisans around the world. One-of-a-kind creations made with love.',
  openGraph: {
    title: 'ArtEcho | Discover Unique Artisan Creations',
    description: 'Explore and purchase one-of-a-kind, handcrafted pieces from independent artisans around the world.',
    url: 'https://artecho.com', // Replace with your actual domain
    siteName: 'ArtEcho',
    images: [
      {
        url: 'https://thumbs.dreamstime.com/b/square-design-authentic-handmade-crafts-wooden-background-upscaled-clean-composition-featuring-neutral-commercial-friendly-400343106.jpg', // Replace with a high-quality OG image URL
        width: 1200,
        height: 630,
        alt: 'A collection of beautiful, handcrafted artisan products on a rustic table.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArtEcho | Discover Unique Artisan Creations',
    description: 'Explore and purchase one-of-a-kind, handcrafted pieces from independent artisans around the world.',
    images: ['https://thumbs.dreamstime.com/b/square-design-authentic-handmade-crafts-wooden-background-upscaled-clean-composition-featuring-neutral-commercial-friendly-400343106.jpg'], // Replace with your Twitter card image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className={cn(
          'font-body antialiased',
          'min-h-screen bg-background flex flex-col'
        )}
      >
        <FirebaseClientProvider>
          <AuthCartSync />
          <Header />
          <main className="flex-grow">{children}</main>
          
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
