
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore, useUser } from '@/lib/auth-store';

const signupSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { login } = useAuthStore();

    useEffect(() => {
        if (!isUserLoading && user) {
            router.push('/');
        }
    }, [user, isUserLoading, router]);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: SignupFormValues) => {
        setIsLoading(true);
        // Simulate a network request
        setTimeout(() => {
            const mockUser = {
                uid: `fake-user-id-${Date.now()}`,
                email: values.email,
                displayName: values.email.split('@')[0],
            };
            login(mockUser);
            toast({ title: "Account Created", description: "Welcome to ArtEcho!" });
            router.push('/');
            setIsLoading(false);
        }, 1000);
    };
    
    if (isUserLoading || user) {
        return null; // Don't render the form if user is logged in or we are still checking
    }

    return (
        <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-5rem)]">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
                    <CardDescription>Join ArtEcho to discover unique creations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                disabled={isLoading}
                                loading={isLoading}
                            >
                                Create Account
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="text-center text-sm text-muted-foreground">
                     <p>Already have an account? <Link href="/login" className="text-primary hover:underline">Log In</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
}
