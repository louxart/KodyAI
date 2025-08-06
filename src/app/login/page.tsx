import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LoginForm } from '@/components/login-form';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
            <Link href="/" aria-label="Back to homepage">
                <Logo />
            </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight font-headline">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your session.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            <p>Don't have an account?&nbsp;</p>
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
