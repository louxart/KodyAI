import { BotMessageSquare } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <BotMessageSquare className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold font-headline">Kody AI</span>
    </div>
  );
}
