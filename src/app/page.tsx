import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Code, LifeBuoy } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Your AI Partner for Web Development
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Kody AI provides instant guidance, code snippets, and documentation links to accelerate your development workflow.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/register">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="abstract tech"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-card py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Build Faster, Smarter
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Leverage the power of AI to overcome challenges and enhance your code.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="p-3 rounded-full bg-primary/10 w-fit">
                    <Code className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">AI-Powered Assistance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get intelligent code suggestions and solutions for your web development queries in real-time.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="p-3 rounded-full bg-primary/10 w-fit">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Relevant Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Kody AI intelligently provides links to relevant documentation to deepen your understanding.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="p-3 rounded-full bg-primary/10 w-fit">
                    <LifeBuoy className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">One Active Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Focus on one problem at a time with a single, dedicated chat session per user.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
