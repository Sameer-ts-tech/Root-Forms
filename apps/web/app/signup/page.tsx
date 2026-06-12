// apps/web/app/signup/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";

import { useSignup } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Leaf, Trees, Sprout } from "lucide-react";

export default function SignupPage() {
    const { createUserWithEmailAndPasswordAsync, isPending, error } = useSignup();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await createUserWithEmailAndPasswordAsync({ fullName, email, password });
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
                        Start for free today
                    </div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight">
                        Grow something<br />
                        <span style={{ color: "#52b788" }}>beautiful.</span>
                    </h2>
                    <p className="text-white/50 text-base leading-relaxed max-w-xs">
                        Join creators building stunning, nature-themed forms. No credit card required.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        {[
                            { value: "2,400+", label: "Forms created" },
                            { value: "48k+", label: "Responses" },
                            { value: "1,200+", label: "Active users" },
                            { value: "5", label: "Nature themes" },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="p-4 rounded-2xl"
                                style={{ background: "rgba(27,47,35,0.5)", border: "1px solid rgba(45,106,79,0.35)" }}
                            >
                                <p className="text-2xl font-bold text-white">{s.value}</p>
                                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom note */}
                <div className="relative z-10">
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        🌿 Built with tRPC · Drizzle · Next.js
                    </p>
                </div>

                {/* Decorative glows */}
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
                        <h1 className="text-3xl font-bold text-white tracking-tight">Create your account</h1>
                        <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                            Free forever. No credit card required.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Jane Doe"
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
                            {isPending ? "Creating account…" : "Create account"}
                        </Button>
                    </form>

                    {/* Demo hint */}
                    <div
                        className="rounded-xl p-4 flex items-start gap-3"
                        style={{ background: "rgba(27,47,35,0.4)", border: "1px solid rgba(45,106,79,0.35)" }}
                    >
                        <Sprout className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#52b788" }} />
                        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                            Just browsing?{" "}
                            <Link href="/signin" className="font-semibold" style={{ color: "#52b788" }}>
                                Sign in with the demo account
                            </Link>{" "}
                            to explore the dashboard.
                        </p>
                    </div>

                    <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Already have an account?{" "}
                        <Link
                            href="/signin"
                            className="font-semibold transition-colors"
                            style={{ color: "#52b788" }}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
