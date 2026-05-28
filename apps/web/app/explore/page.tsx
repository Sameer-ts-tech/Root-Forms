"use client";

import Link from "next/link";
import { useGetPublicForms } from "~/hooks/api/form";
import { useUser } from "~/hooks/api/auth";
import { Leaf, Globe, MessageSquare, ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const themeColors: Record<string, { bg: string; border: string; accent: string; text: string }> = {
    forest: { bg: "#0d1b12", border: "#2d6a4f", accent: "#52b788", text: "#d8f3dc" },
    water: { bg: "#03045e", border: "#0077b6", accent: "#00b4d8", text: "#caf0f8" },
    fire: { bg: "#1a0a00", border: "#7c3a00", accent: "#ff6b35", text: "#fff3e0" },
    snow: { bg: "#f0f4ff", border: "#dbeafe", accent: "#3b82f6", text: "#1a1a2e" },
    aurora: { bg: "#0d0d1a", border: "#4c1d95", accent: "#10b981", text: "#e9d5ff" },
    sakura: { bg: "#1a0a12", border: "#880e4f", accent: "#f06292", text: "#fce4ec" },
    desert: { bg: "#1f1409", border: "#5c3a1e", accent: "#d4945a", text: "#f5e6d3" },
    midnight: { bg: "#060618", border: "#312e81", accent: "#6366f1", text: "#e0e7ff" },
    earth: { bg: "#1a0e08", border: "#4a2c1a", accent: "#a0522d", text: "#f5e6d3" },
    storm: { bg: "#0a0e18", border: "#334155", accent: "#38bdf8", text: "#e2e8f0" },
};

const themeEmoji: Record<string, string> = {
    forest: "🌲", water: "🌊", fire: "🔥", snow: "❄️", aurora: "🌌",
    sakura: "🌸", desert: "🏜️", midnight: "🌙", earth: "🌍", storm: "⛈️",
};

export default function ExplorePage() {
    const { user } = useUser();
    const router = useRouter();
    const { forms, isLoading } = useGetPublicForms();
    const [search, setSearch] = useState("");

    const filtered = (forms ?? []).filter(
        (f) =>
            f.title.toLowerCase().includes(search.toLowerCase()) ||
            (f.description ?? "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen" style={{ background: "#060e09" }}>
            {/* BG */}
            <div className="fixed inset-0 pointer-events-none">
                <div style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(45,106,79,0.25) 0%, transparent 70%)" }} className="absolute inset-0" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 backdrop-blur-sm">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #52b788, #2d6a4f)" }}>
                        <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Root <span style={{ color: "#52b788" }}>Forms</span></span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/pricing" className="text-sm text-white/60 hover:text-white">Pricing</Link>
                    {user?.id ? (
                        <button
                            onClick={() => router.push("/dashboard/forms")}
                            className="text-sm font-medium px-4 py-2 rounded-lg"
                            style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}
                        >
                            Dashboard
                        </button>
                    ) : (
                        <>
                            <Link href="/signin" className="text-sm text-white/60 hover:text-white">Sign in</Link>
                            <Link
                                href="/signup"
                                className="text-sm font-medium px-4 py-2 rounded-lg"
                                style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <div className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6 border" style={{ background: "rgba(82,183,136,0.1)", borderColor: "rgba(82,183,136,0.3)", color: "#52b788" }}>
                        <Globe className="w-3 h-3" />
                        Public Forms Gallery
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Explore Public Forms
                    </h1>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Discover and fill forms created by the community. Nature-themed, beautifully designed.
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-md mx-auto mb-12">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search forms..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 border outline-none"
                        style={{ background: "rgba(27,47,35,0.5)", borderColor: "rgba(45,106,79,0.4)" }}
                    />
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 rounded-2xl border animate-pulse" style={{ background: "rgba(27,47,35,0.3)", borderColor: "rgba(45,106,79,0.2)" }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-6xl mb-4">🌿</div>
                        <p className="text-white/60">
                            {search ? "No forms match your search." : "No public forms yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((form) => {
                            const theme = themeColors[form.theme ?? "forest"] ?? themeColors.forest!;
                            const emoji = themeEmoji[form.theme ?? "forest"] ?? "🌿";

                            return (
                                <Link
                                    key={form.id}
                                    href={`/form/${form.id}`}
                                    className="group block rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                                    style={{
                                        background: theme.bg,
                                        borderColor: theme.border,
                                    }}
                                >
                                    {/* Theme color bar */}
                                    <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.border})` }} />

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-3xl">{emoji}</span>
                                            <span
                                                className="text-xs px-2 py-1 rounded-full font-medium"
                                                style={{ background: `${theme.accent}22`, color: theme.accent }}
                                            >
                                                {form.theme ?? "forest"}
                                            </span>
                                        </div>

                                        <h2 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: theme.text }}>
                                            {form.title}
                                        </h2>

                                        {form.description && (
                                            <p className="text-sm line-clamp-2 mb-4" style={{ color: `${theme.text}99` }}>
                                                {form.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-1.5 text-xs" style={{ color: `${theme.text}70` }}>
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                {form.submissionCount} responses
                                            </div>
                                            <div
                                                className="flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all"
                                                style={{ color: theme.accent }}
                                            >
                                                Fill Form
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
