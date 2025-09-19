
'use client';

import Link from 'next/link';
import { Menu, User } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navLinks = [
    { href: "/products", label: "Browse" },
    { href: "/dashboard", label: "Artisan Dashboard" },
    { href: "/dashboard/buyer", label: "Buyer Dashboard" },
    { href: "/dashboard/brand", label: "Brand Dashboard" },
];

const Header = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between space-x-4 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://i.postimg.cc/HWX44zYk/logo.jpg" alt="ArtEcho Logo" width={63} height={8} priority />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
                 <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-primary"
                >
                    {link.label}
                </Link>
            ))}
        </nav>

        <div className="flex items-center space-x-2">
            <Button asChild className="hidden sm:inline-flex">
                <Link href="/login">
                    <User className="mr-2" />
                    Login / Sign Up
                </Link>
            </Button>
             
            {/* Mobile Navigation */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                     <div className="flex flex-col h-full">
                        <div className="border-b pb-4">
                             <Link href="/" className="flex items-center space-x-2">
                                <Image src="https://i.postimg.cc/HWX44zYk/logo.jpg" alt="ArtEcho Logo" width={63} height={8} />
                            </Link>
                        </div>
                        <nav className="flex flex-col gap-4 py-4">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-lg font-medium transition-colors hover:text-primary"
                                    onClick={() => setIsSheetOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto border-t pt-4">
                             <Button asChild className="w-full">
                                <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                                    <User className="mr-2" />
                                    Login / Sign Up
                                </Link>
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
