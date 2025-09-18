import Link from 'next/link';
import { User } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://i.postimg.cc/HWX44zYk/logo.jpg" alt="ArtEcho Logo" width={140} height={35} priority />
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
                    <User className="mr-2" />
                    Login / Sign Up
                </Link>
            </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
