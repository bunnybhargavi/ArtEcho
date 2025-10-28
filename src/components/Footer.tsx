
'use client';

import Link from 'next/link';
import { ShieldCheck, PackageCheck, Star, Truck, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

const trustBadges = [
  { icon: ShieldCheck, text: "Secure Payments" },
  { icon: Star, text: "100% Satisfaction Guarantee" },
  { icon: PackageCheck, text: "Hand-Inspected Before Shipping" },
  { icon: Truck, text: "Easy Returns & Tracking" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/artisans", label: "Our Artisans" },
  { href: "/products", label: "Shop" },
  { href: "/contact", label: "Contact Us" },
];

const supportLinks = [
    { href: "#", label: "Shipping & Returns" },
    { href: "/about#faq", label: "FAQs" },
    { href: "#", label: "Track Order" },
    { href: "/contact", label: "Report an Issue" },
];

export default function Footer() {
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    if(email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      (e.target as HTMLFormElement).reset();
    }
  };

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
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
            <div className="md:col-span-2 lg:col-span-1 space-y-4">
                <h3 className="font-headline text-lg font-semibold">Stay updated on new arrivals and artisan stories.</h3>
                <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
                    <Input type="email" name="email" placeholder="Enter your email" required />
                    <Button type="submit">Subscribe</Button>
                </form>
            </div>

             <div className="md:col-start-1 lg:col-start-auto">
                <h3 className="font-headline text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                    {quickLinks.map(link => (
                        <li key={link.href}>
                            <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="font-headline text-lg font-semibold mb-4">Customer Support</h3>
                <ul className="space-y-2">
                    {supportLinks.map(link => (
                        <li key={link.label}>
                            <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="font-headline text-lg font-semibold mb-4">Contact Info</h3>
                <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <Mail className="w-5 h-5 mt-1 text-primary shrink-0" />
                        <a href="mailto:support@artecho.in" className="hover:text-primary">support@artecho.in</a>
                    </li>
                    <li className="flex items-start gap-2">
                        <Phone className="w-5 h-5 mt-1 text-primary shrink-0" />
                        <span>+91 98765 43210</span>
                    </li>
                     <li className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 mt-1 text-primary shrink-0" />
                        <span>Hyderabad, India</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <Separator />
        
        <div className="pt-8 flex flex-col items-center justify-center text-center">
            <div className="text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} ArtEcho. All Rights Reserved.</p>
                <p className="mt-1">A platform for celebrating and discovering authentic craftsmanship.</p>
            </div>
        </div>
      </div>
    </footer>
  );
}
