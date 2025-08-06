import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <Link href="/" className="flex items-center justify-center">
        <Logo />
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/register">Register</Link>
        </Button>
      </nav>
    </header>
  );
}
