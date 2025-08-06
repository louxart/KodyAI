"use client";

import { cn } from '@/lib/utils';
import { Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MessageContent({ content }: { content: string }) {
  const { toast } = useToast();
  const parts = content.split(/(```[\s\S]*?```)/g);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: 'Copied to clipboard!' });
    }, (err) => {
      toast({ title: 'Failed to copy', description: err.message, variant: 'destructive' });
    });
  };

  return (
    <div className="prose prose-sm max-w-none text-inherit">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const code = part.replace(/```(.*?)\n/,'').replace(/```/g, '');
          return (
            <div key={index} className="relative my-2">
              <pre className="bg-background/50 p-4 rounded-md overflow-x-auto text-foreground">
                <code>{code}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(code)}
                className={cn(
                    "absolute top-2 right-2 p-1.5 rounded-md",
                    "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white",
                    "dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white",
                    "transition-colors duration-200"
                )}
                aria-label="Copy code"
              >
                <Clipboard className="h-4 w-4" />
              </button>
            </div>
          );
        }
        return part.split('\n').map((line, i) => <p key={`${index}-${i}`} className="my-0 leading-relaxed">{line}</p>);
      })}
    </div>
  );
}
