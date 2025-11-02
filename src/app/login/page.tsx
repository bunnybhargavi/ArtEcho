
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore, useUser } from '@/lib/auth-store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Mail } from 'lucide-react';

export default function LoginPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { login, mockUsers, initializeAuth } = useAuthStore();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        // If user is loaded and exists, redirect them.
        if (!isUserLoading && user) {
            toast({ title: "Already Logged In", description: "Redirecting you to the homepage." });
            router.push('/');
        }
    }, [user, isUserLoading, router, toast]);

    const handleLogin = (selectedUser: typeof mockUsers[0]) => {
        setIsLoading(selectedUser.uid);
        // Simulate a network request
        setTimeout(() => {
            login(selectedUser);
            toast({ title: "Login Successful", description: `Welcome back, ${selectedUser.displayName}!` });
            router.push('/');
            setIsLoading(null);
        }, 1000);
    };

    // Prevent rendering the form if we are still checking the user state or if user is already logged in
    if (isUserLoading || user) {
        return (
            <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[calc(100vh-5rem)]">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-5rem)]">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Choose an account</CardTitle>
                    <CardDescription>to continue to ArtEcho</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {mockUsers.map((mockUser) => (
                        <button
                            key={mockUser.uid}
                            className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4 disabled:opacity-50"
                            onClick={() => handleLogin(mockUser)}
                            disabled={!!isLoading}
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarFallback>{mockUser.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <p className="font-semibold">{mockUser.displayName}</p>
                                <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                            </div>
                            {isLoading === mockUser.uid && <Loader2 className="h-5 w-5 animate-spin" />}
                        </button>
                    ))}
                     <Separator className="my-4" />
                      <button
                        className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4 disabled:opacity-50"
                        disabled={!!isLoading}
                        onClick={() => toast({ variant: 'destructive', title: "Feature not available", description: "Please select an existing account."})}
                        >
                        <Avatar className="h-10 w-10">
                           <Mail className="w-5 h-5 text-muted-foreground"/>
                        </Avatar>
                        <div>
                             <p className="font-semibold">Use another account</p>
                        </div>
                    </button>
                </CardContent>
                 <CardFooter className="text-center text-sm text-muted-foreground">
                    <p>Don't have an account? <Link href="/signup" className="text-primary hover:underline">Create an account</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
}
