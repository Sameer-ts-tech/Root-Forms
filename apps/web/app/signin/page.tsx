// apps/web/app/signin/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";

import { useSignin } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Leaf, Trees, Sprout } from "lucide-react";

export default function SigninPage() {
    const { signInUserWithEmailAndPasswordAsync, isPending, error } = useSignin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await signInUserWithEmailAndPasswordAsync({ email, password });
        localStorage.removeItem("rf_logged_out");
        window.location.href = "/dashboard/forms";
    };

    const handleDemoLogin = async () => {
        const demoEmail = "demo@root-forms.sameerdev.tech";
        const demoPassword = "Demo@12345";
        setEmail(demoEmail);
        setPassword(demoPassword);
        await signInUserWithEmailAndPasswordAsync({ email: demoEmail, password: demoPassword });
        localStorage.removeItem("rf_logged_out");
        window.location.href = "/dashboard/forms";
    };

    return (
        <main
            className="min-h-screen flex"
            style={{ background: "#0a1209" }}
        >
            {/* ── Left panel – branding ── */}
            <div
                className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
                style={{ background: "linear-gradient(160deg, #0d1b12 0%, #112316 60%, #0d2116 100%)" }}
            >
                {/* Decorative radial glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 70% 60% at 30% 60%, rgba(82,183,136,0.12) 0%, transparent 70%)",
                    }}
                />
                {/* Faint grid lines */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(82,183,136,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.08) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-2">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #52b788, #2d6a4f)" }}
                    >
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">
                        Root <span style={{ color: "#52b788" }}>Forms</span>
                    </span>
                </div>

                {/* Central illustration text */}
                <div className="relative z-10 space-y-6">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
                        style={{ background: "rgba(82,183,136,0.1)", borderColor: "rgba(82,183,136,0.3)", color: "#52b788" }}
                    >
                        <Trees className="w-3.5 h-3.5" />
                        Nature-Inspired Forms
                    </div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight">
                        Forms that feel<br />
                        <span style={{ color: "#52b788" }}>alive.</span>
                    </h2>
                    <p className="text-white/50 text-base leading-relaxed max-w-xs">
                        Build breathtaking forms with forest, ocean, fire, and snow themes that leave a lasting impression.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-col gap-3 pt-2">
                        {[
                            "5 immersive nature themes",
                            "10+ field types with validation",
                            "Real-time analytics dashboard",
                        ].map((f) => (
                            <div key={f} className="flex items-center gap-3">
                                <div
                                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(82,183,136,0.15)", border: "1px solid rgba(82,183,136,0.35)" }}
                                >
                                    <Sprout className="w-3 h-3" style={{ color: "#52b788" }} />
                                </div>
                                <span className="text-sm text-white/60">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom quote */}
                <div className="relative z-10">
                    <p className="text-xs text-white/30 italic">
                        "The best form builder with the most beautiful themes."
                    </p>
                </div>

                {/* Decorative corner leaf shapes */}
                <div
                    className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #52b788, transparent)" }}
                />
                <div
                    className="absolute top-32 -right-8 w-32 h-32 rounded-full opacity-5"
                    style={{ background: "#52b788" }}
                />
            </div>

            {/* ── Right panel – form ── */}
            <div
                className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
                style={{ background: "#0a1209" }}
            >
                <div className="w-full max-w-sm space-y-8">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-2 justify-center">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #52b788, #2d6a4f)" }}
                        >
                            <Leaf className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">
                            Root <span style={{ color: "#52b788" }}>Forms</span>
                        </span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                        <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="h-11 rounded-xl text-white placeholder:text-white/20 transition-all"
                                style={{
                                    background: "rgba(27,47,35,0.5)",
                                    border: "1px solid rgba(45,106,79,0.4)",
                                    outline: "none",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(82,183,136,0.7)")}
                                onBlur={(e) => (e.target.style.borderColor = "rgba(45,106,79,0.4)")}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="h-11 rounded-xl text-white placeholder:text-white/20 transition-all"
                                style={{
                                    background: "rgba(27,47,35,0.5)",
                                    border: "1px solid rgba(45,106,79,0.4)",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(82,183,136,0.7)")}
                                onBlur={(e) => (e.target.style.borderColor = "rgba(45,106,79,0.4)")}
                            />
                        </div>

                        {error && (
                            <div
                                className="rounded-xl p-3 text-sm text-center font-medium"
                                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
                            >
                                {error.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-11 w-full rounded-xl text-sm font-semibold transition-all"
                            style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0a1209" }}
                        >
                            {isPending ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-4">
                        <div className="flex-1 h-px" style={{ background: "rgba(45,106,79,0.35)" }} />
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>or</span>
                        <div className="flex-1 h-px" style={{ background: "rgba(45,106,79,0.35)" }} />
                    </div>

                    {/* Demo login */}
                    <button
                        type="button"
                        onClick={handleDemoLogin}
                        disabled={isPending}
                        className="w-full h-11 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 group"
                        style={{
                            background: "rgba(27,47,35,0.6)",
                            border: "1px solid rgba(45,106,79,0.5)",
                            color: "#95d5b2",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(82,183,136,0.7)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(45,106,79,0.5)")}
                    >
                        <Sprout className="w-4 h-4" />
                        Try with Demo Account
                    </button>

                    <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold transition-colors"
                            style={{ color: "#52b788" }}
                        >
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
