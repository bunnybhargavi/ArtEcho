
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-1.1 0-1.5.7-1.5 1.5V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/>
    </svg>
);


export default function LoginPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<null | 'google' | 'email'>(null);
    const auth = useAuth();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onEmailSubmit = async (values: LoginFormValues) => {
        setIsLoading('email');
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                toast({ title: "Login Successful", description: "Welcome back!" });
            })
            .catch((error) => {
                toast({ variant: "destructive", title: "Login Failed", description: error.message });
            })
            .finally(() => {
                setIsLoading(null);
            });
    };

    const handleGoogleSignIn = async () => {
        setIsLoading('google');
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                toast({ title: "Sign-In Successful", description: `Welcome, ${result.user.displayName}!` });
            })
            .catch((error) => {
                toast({ variant: "destructive", title: "Google Sign-In Failed", description: error.message });
            })
            .finally(() => {
                setIsLoading(null);
            });
    };

    return (
        <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-md">
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
                           <div className="flex items-center justify-center gap-2">
                                <GoogleIcon /> <span>Sign in with Google</span>
                           </div>
                        </Button>

                        <div className="flex items-center">
                            <Separator className="flex-grow" />
                            <span className="mx-4 text-xs text-muted-foreground">OR CONTINUE WITH</span>
                            <Separator className="flex-grow" />
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
            </Card>
        </div>
    );
}
