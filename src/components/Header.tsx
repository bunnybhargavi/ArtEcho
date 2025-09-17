import Link from 'next/link';
import { Palette } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <Palette className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold">ArtEcho</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
