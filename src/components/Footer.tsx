
'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, ShieldCheck, PackageCheck, Star, Truck } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

const VisaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-500">
    <path d="M3.5 7.5c.31-.83.6-1.6.89-2.29A1.5 1.5 0 0 1 5.7 4h12.6c.83 0 1.5.67 1.5 1.5a2.5 2.5 0 0 1-.6 1.48" />
    <path d="M2.5 12c0-.55.45-1 1-1h17c.55 0 1 .45 1 1v0c0 .55-.45 1-1 1h-17c-.55 0-1-.45-1-1v0z" />
    <path d="M6 18h2l1-4h3c1.66 0 3 1.34 3 3s-1.34 3-3 3H8l-2 4" />
  </svg>
);

const MastercardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-500">
        <circle cx="7" cy="12" r="7"></circle>
        <circle cx="17" cy="12" r="7"></circle>
    </svg>
);

const PayPalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-500">
        <path d="M7.7 21.2c.4.2 1 .3 1.6.3h4.1c3.6 0 6.6-2.5 7.1-6 0-.2.1-.4.1-.6 0-2.3-1.6-4.3-3.8-5-.3-.1-.7-.1-1-.1H7.9c-2.4 0-4.4 1.8-4.4 4.1 0 1.2.5 2.2 1.3 3 .1.1.2.2.3.3z"></path>
        <path d="M8.2 16.1c.4.2.9.3 1.5.3h4.1c2.1 0 3.8-1.5 4.1-3.5 0-.2 0-.4 0-.5 0-1.7-1.3-3.1-3-3.4H8.8c-1.4 0-2.6 1.1-2.6 2.5 0 .7.3 1.3.8 1.8.1.1.2.2.3.3z"></path>
    </svg>
);

const UpiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-500">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path>
    </svg>
);

const trustBadges = [
  { icon: ShieldCheck, text: "Secure Payments" },
  { icon: Star, text: "100% Satisfaction Guarantee" },
  { icon: PackageCheck, text: "Hand-Inspected Before Shipping" },
  { icon: Truck, text: "Easy Returns & Tracking" },
];

const socialLinks = [
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Twitter, label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center">
              <badge.icon className="h-10 w-10 text-primary mb-2" />
              <p className="text-sm font-semibold text-muted-foreground">{badge.text}</p>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src="https://i.postimg.cc/HWX44zYk/logo.jpg" alt="ArtEcho Logo" width={84} height={10} />
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-4">
                <VisaIcon />
                <MastercardIcon />
                <PayPalIcon />
                <UpiIcon />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <Button key={link.label} asChild variant="ghost" size="icon">
                <Link href={link.href} aria-label={link.label}>
                  <link.icon className="h-5 w-5" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground mt-8 pt-8 border-t">
          <p>&copy; {new Date().getFullYear()} ArtEcho. All Rights Reserved.</p>
          <p className="mt-1">A platform for celebrating and discovering authentic craftsmanship.</p>
        </div>
      </div>
    </footer>
  );
}
