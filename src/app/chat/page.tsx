import { ChatInterface } from '@/components/chat/chat-interface';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/image.jpg" alt="User" data-ai-hint="person avatar"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" aria-label="Logout">
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Logout</span>
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
