
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CreditCard, ShieldCheck, PackageCheck, Truck, Instagram, Facebook } from 'lucide-react';
import Image from 'next/image';

const trustBadges = [
    { icon: <CreditCard />, text: "Secure Payments" },
    { icon: <ShieldCheck />, text: "Satisfaction Guarantee" },
    { icon: <PackageCheck />, text: "Hand-Inspected" },
    { icon: <Truck />, text: "Easy Returns & Tracking" },
];

const PinterestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pinterest">
        <path d="M12.5 6.5c-3.5 0-6.2 2-6.2 5.5 0 2.2 1.3 3.9 3.2 3.9 0.7 0 1.4-0.4 1.6-0.9 0.1-0.2 0.1-0.4 0-0.6C11 14 10.9 13.5 10.9 13.1c0-1 0.4-1.8 1.4-1.8 1.3 0 2.4 1.1 2.4 3.1 0 1.7-1 3.1-2.5 3.1-1.8 0-2.9-1.5-2.9-3.2 0-1.2 0.8-2.3 1.9-2.3 0.6 0 1.1 0.3 1.1 0.8 0 0.5-0.2 1.1-0.3 1.4C12 14.5 11.9 15 11.9 15.5c0 0.6 0.5 1.1 1.1 1.1 1.6 0 2.9-2 2.9-4.8 0-2.8-2.1-5.1-5.4-5.1z" />
    </svg>
);

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t mt-12">
      <div className="container mx-auto pt-12 pb-8 px-4">
        {/* Trust Badges Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-b pb-12">
            {trustBadges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                    <div className="text-primary">{React.cloneElement(badge.icon, { size: 32 })}</div>
                    <span className="font-semibold">{badge.text}</span>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-12">
            {/* About & Social */}
            <div className="col-span-1 md:col-span-2">
                 <Link href="/" className="flex items-center gap-2 mb-4">
                    <Image src="https://i.postimg.cc/HWX44zYk/logo.jpg" alt="ArtEcho Logo" width={15.75} height={2} priority />
                </Link>
                <p className="max-w-md text-muted-foreground mb-6">
                    Discover unique, handcrafted pieces from independent artisans around the world. One-of-a-kind creations made with love.
                </p>
                <div className="flex items-center gap-4">
                    <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram /></a>
                    <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook /></a>
                    <a href="#" aria-label="Pinterest" className="text-muted-foreground hover:text-primary"><PinterestIcon /></a>
                </div>
            </div>

            {/* Links */}
            <div className="col-span-1">
                <h3 className="font-headline text-lg font-semibold mb-4">Explore</h3>
                <ul className="space-y-2">
                    <li><Link href="/products" className="text-muted-foreground hover:text-primary">All Creations</Link></li>
                    <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                    <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-1">
                <h3 className="font-headline text-lg font-semibold mb-4">Join Our Community</h3>
                <p className="text-muted-foreground mb-4 text-sm">Get exclusive offers and stories from our artisans.</p>
                <form className="flex gap-2">
                    <Input type="email" placeholder="Your email" className="bg-background" />
                    <Button type="submit">Subscribe</Button>
                </form>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ArtEcho. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
