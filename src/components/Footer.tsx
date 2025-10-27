
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Facebook, Instagram, Twitter, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Newsletter */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="https://i.postimg.cc/HWX44zYk/logo.jpg" alt="ArtEcho Logo" width={80} height={10} />
            </Link>
            <p className="text-sm">
              Subscribe to our newsletter for updates on new artisans and exclusive offers.
            </p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-background" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary">All Creations</Link></li>
              <li><Link href="#" className="hover:text-primary">New Arrivals</Link></li>
              <li><Link href="#" className="hover:text-primary">Best Sellers</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary">Our Story</Link></li>
              <li><Link href="/artisans" className="hover:text-primary">Our Artisans</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social and Trust */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Follow Us</h4>
            <div className="flex gap-4">
              <Link href="#" aria-label="Facebook"><Facebook className="w-6 h-6 hover:text-primary" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="w-6 h-6 hover:text-primary" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="w-6 h-6 hover:text-primary" /></Link>
            </div>
            <div className="mt-6">
                 <h4 className="font-semibold text-foreground mb-2">Secure Checkout</h4>
                 <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-8 h-8 text-green-600"/>
                    <span>Guaranteed safe and secure.</span>
                 </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted/80 border-t">
        <div className="container mx-auto py-4 px-4 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} ArtEcho. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
