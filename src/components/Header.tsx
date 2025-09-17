import Link from 'next/link';
import { Palette, User } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <Palette className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold">ArtEcho</span>
        </Link>
        <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
                href="/products"
                className="transition-colors hover:text-primary"
            >
                Browse
            </Link>
            <Link
                href="/dashboard"
                className="transition-colors hover:text-primary"
            >
                Artisan Dashboard
            </Link>
            <Link
                href="/dashboard/buyer"
                className="transition-colors hover:text-primary"
            >
                Buyer Dashboard
            </Link>
            <Link
                href="/dashboard/brand"
                className="transition-colors hover:text-primary"
            >
                Brand Dashboard
            </Link>
            </nav>
            <Button asChild>
                <Link href="/login">
                    <div className="flex items-center justify-center">
                        <User className="mr-2" />
                        Login / Sign Up
                    </div>
                </Link>
            </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
