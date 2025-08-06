"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAiResponse } from '@/app/chat/actions';
import { MessageContent } from './message-content';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await getAiResponse({ query: input });

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages(prev => prev.slice(0, -1)); // Remove user message if AI fails
    } else if (result.response) {
      const assistantMessage: Message = { role: 'assistant', content: result.response };
      setMessages((prev) => [...prev, assistantMessage]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 md:p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
                <Bot className="h-16 w-16 text-primary/50" />
                <h2 className="mt-4 text-2xl font-semibold font-headline">Welcome to Kody AI</h2>
                <p className="mt-2 text-muted-foreground">Ask me anything about web development.</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : '')}>
              {message.role === 'assistant' && (
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                "max-w-xl rounded-lg p-3 text-sm",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border'
              )}>
                <MessageContent content={message.content} />
              </div>
              {message.role === 'user' && (
                <Avatar className="h-9 w-9 border">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="person avatar"/>
                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9 border">
                    <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                </Avatar>
                <div className="max-w-xl rounded-lg p-3 text-sm bg-card border flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-card p-4 md:p-6">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            placeholder="Type your web development question here..."
            className="min-h-[48px] resize-none pr-16"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
              }
            }}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2" disabled={isLoading || !input.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
