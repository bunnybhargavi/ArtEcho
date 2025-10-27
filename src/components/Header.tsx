
'use client';

import Link from 'next/link';
import { Menu, User, Search, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { useCartStore } from '@/lib/cart-store';

const navLinks = [
    { href: "/products", label: "Creations" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact Us" },
    { href: "/dashboard", label: "Artisan Dashboard" },
    { href: "/dashboard/buyer", label: "Buyer Dashboard" },
    { href: "/dashboard/brand", label: "Brand Dashboard" },
];

const Header = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const router = useRouter();
    const { items, initializeCart } = useCartStore();
    const [isCartInitialized, setIsCartInitialized] = useState(false);

    useEffect(() => {
        initializeCart();
        setIsCartInitialized(true);
    }, [initializeCart]);

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const searchQuery = formData.get('search') as string;
      router.push(`/products?q=${searchQuery}`);
      if (isSheetOpen) {
        setIsSheetOpen(false);
      }
    };

    const cartCount = isCartInitialized ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://i.postimg.cc/HWX44zYk/logo.jpg" alt="ArtEcho Logo" width={15.75} height={2} priority />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
        
        <div className="flex items-center gap-2 flex-1 justify-end">
            <form onSubmit={handleSearch} className="relative hidden sm:block w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="Search creations..."
                className="pl-9"
              />
            </form>

            <Button asChild className="hidden sm:inline-flex" variant="ghost" size="icon">
                <Link href="/login">
                    <User />
                    <span className="sr-only">Login</span>
                </Link>
            </Button>
            
            <Button asChild variant="ghost" size="icon" className="relative hidden sm:inline-flex">
              <Link href="/cart">
                <ShoppingCart />
                <span className="sr-only">Shopping Cart</span>
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">{cartCount}</span>
                )}
              </Link>
            </Button>
             
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                     <div className="border-b pb-4">
                         <Link href="/" onClick={() => setIsSheetOpen(false)}>
                            <Image src="https://i.postimg.cc/HWX44zYk/logo.jpg" alt="ArtEcho Logo" width={15.75} height={2} />
                        </Link>
                    </div>

                    <form onSubmit={handleSearch} className="relative py-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            name="search"
                            placeholder="Search creations..."
                            className="pl-9"
                        />
                    </form>

                    <nav className="flex flex-col gap-4">
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
                    <div className="mt-auto border-t pt-4 flex items-center gap-2">
                         <Button asChild className="w-full">
                            <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                                <User className="mr-2" />
                                Login / Sign Up
                            </Link>
                        </Button>
                         <Button asChild variant="outline" className="w-full">
                            <Link href="/cart" onClick={() => setIsSheetOpen(false)}>
                                <ShoppingCart className="mr-2" />
                                Cart {cartCount > 0 ? `(${cartCount})` : ''}
                            </Link>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
