import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RegisterForm } from '@/components/register-form';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function RegisterPage() {
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
            <CardTitle className="text-2xl font-bold tracking-tight font-headline">Create an Account</CardTitle>
            <CardDescription>Enter your details to start your session with Kody AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            <p>Already have an account?&nbsp;</p>
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
