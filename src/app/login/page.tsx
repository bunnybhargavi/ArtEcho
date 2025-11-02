
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore, useUser } from '@/lib/auth-store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.67-4.66 1.67-3.86 0-6.99-3.14-6.99-7s3.13-7 6.99-7c2.08 0 3.61 1.09 4.49 2.02l-2.72 2.72c-.76-.75-1.73-1.17-2.91-1.17-2.52 0-4.6 2.08-4.6 4.62s2.08 4.62 4.6 4.62c2.86 0 3.97-2.16 4.13-3.28h-4.13z"/>
    </svg>
);


export default function LoginPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<null | 'email' | 'google'>(null);
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { login } = useAuthStore();

    useEffect(() => {
        // If user is loaded and exists, redirect them.
        if (!isUserLoading && user) {
            toast({ title: "Already Logged In", description: "Redirecting you to the homepage." });
            router.push('/');
        }
    }, [user, isUserLoading, router, toast]);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onEmailSubmit = async (values: LoginFormValues) => {
        setIsLoading('email');
        // Simulate a network request
        setTimeout(() => {
            const mockUser = {
                uid: 'fake-user-id-123',
                email: values.email,
                displayName: values.email.split('@')[0],
            };
            login(mockUser);
            toast({ title: "Login Successful", description: "Welcome back!" });
            router.push('/');
            setIsLoading(null);
        }, 1000);
    };

    const handleGoogleSignIn = async () => {
        setIsLoading('google');
        // Simulate a network request
        setTimeout(() => {
            const mockUser = {
                uid: 'fake-google-id-456',
                email: 'user@google.com',
                displayName: 'Google User',
            };
            login(mockUser);
            toast({ title: "Google Sign-In Successful", description: "Welcome!" });
            router.push('/');
            setIsLoading(null);
        }, 1000);
    };

    // Prevent rendering the form if we are still checking the user state or if user is already logged in
    if (isUserLoading || user) {
        return null;
    }


    return (
        <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-5rem)]">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
                    <CardDescription>Sign in to continue to ArtEcho</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignIn}
                            disabled={!!isLoading}
                            loading={isLoading === 'google'}
                        >
                            <GoogleIcon className="mr-2 h-4 w-4" />
                            Sign In with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="you@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!!isLoading}
                                    loading={isLoading === 'email'}
                                >
                                    Sign In with Email
                                </Button>
                            </form>
                        </Form>
                    </div>
                </CardContent>
                <CardFooter className="text-center text-sm text-muted-foreground">
                    <p>Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign Up</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
}
