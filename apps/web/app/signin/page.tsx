// apps/web/app/signin/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useSignin } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function SigninPage() {
    const router = useRouter();
    const { signInUserWithEmailAndPasswordAsync, isPending, isSuccess, error } = useSignin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await signInUserWithEmailAndPasswordAsync({
            email,
            password,
        });

        localStorage.removeItem("rf_logged_out");
        // Hard navigate so React Query starts fresh with the authenticated cookie
        window.location.href = "/dashboard/forms";
    };

    const handleDemoLogin = async () => {
        const demoEmail = "demo@root-forms.sameerdev.tech";
        const demoPassword = "Demo@12345";
        setEmail(demoEmail);
        setPassword(demoPassword);
        
        await signInUserWithEmailAndPasswordAsync({
            email: demoEmail,
            password: demoPassword,
        });
        
        localStorage.removeItem("rf_logged_out");
        // Hard navigate so React Query starts fresh with the authenticated cookie
        window.location.href = "/dashboard/forms";
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 sm:px-6 lg:px-8">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[120px]" />
                <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-white/5 blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                        Welcome back
                    </h1>
                    <p className="mt-4 text-lg text-white/60">
                        Sign in to your account to continue
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-white/80">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="jane@example.com"
                                    className="h-12 border-white/10 bg-black/40 px-4 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-white/80">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="••••••••"
                                    className="h-12 border-white/10 bg-black/40 px-4 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error ? (
                            <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
                                <p className="text-sm text-red-400 text-center font-medium">{error.message}</p>
                            </div>
                        ) : null}
                        {isSuccess ? (
                            <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20">
                                <p className="text-sm text-emerald-400 text-center font-medium">Signed in successfully.</p>
                            </div>
                        ) : null}

                        <Button
                            type="submit"
                            className="h-12 w-full bg-white text-base font-semibold text-black hover:bg-white/90 transition-colors"
                            disabled={isPending}
                        >
                            {isPending ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>

                    <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm font-medium">
                            <span className="bg-black/80 px-4 text-white/50 backdrop-blur-md rounded-full border border-white/10 py-1">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDemoLogin}
                            disabled={isPending}
                            className="h-12 w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all duration-200"
                        >
                            Sign in with Demo Account
                        </Button>
                    </div>

                    <p className="mt-8 text-center text-sm text-white/60">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-semibold text-white hover:text-white/80 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
