"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "~/hooks/api/auth";
import {
    Leaf,
    Zap,
    BarChart3,
    Share2,
    Globe,
    Lock,
    ArrowRight,
    CheckCircle2,
    FileText,
    Eye,
    Users,
    Trees,
    Volume2,
    VolumeX,
    Droplets
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { env } from "~/env.js";
import "./cinematic.css";

const WateringCanScene = dynamic(() => import("~/components/watering-can-scene"), { ssr: false });

const themes = [
    { name: "Forest", emoji: "🌲", bg: "#0d1b12", accent: "#52b788", border: "#2d6a4f", desc: "Cinematic forest parallax" },
    { name: "Water", emoji: "🌊", bg: "#03045e", accent: "#00b4d8", border: "#0077b6", desc: "Interactive ripples" },
    { name: "Snow", emoji: "❄️", bg: "#020617", accent: "#38bdf8", border: "#1e293b", desc: "Pixel snowfall simulation" },
    { name: "Fire", emoji: "🔥", bg: "#0a0a0a", accent: "#ef4444", border: "#451a1a", desc: "Liquid ether fluid sim" },
    { name: "Desert", emoji: "🏜️", bg: "#1c140d", accent: "#e1a555", border: "#8c6b4a", desc: "Interactive dune waves" },
];

const features = [
    {
        icon: Zap,
        title: "Lightning Fast Builder",
        desc: "Drag & drop interface with real-time preview. Build forms in minutes, not hours.",
        color: "#52b788",
    },
    {
        icon: Share2,
        title: "Public & Unlisted Links",
        desc: "Share publicly on explore pages or keep it unlisted — accessible only via direct link.",
        color: "#00b4d8",
    },
    {
        icon: BarChart3,
        title: "Rich Analytics",
        desc: "Beautiful response charts, daily timelines, and per-field breakdowns out of the box.",
        color: "#ff6b35",
    },
    {
        icon: Globe,
        title: "No Login Required",
        desc: "Respondents can fill your forms without creating an account. Zero friction.",
        color: "#f06292",
    },
    {
        icon: Lock,
        title: "Smart Validation",
        desc: "Zod-powered validation with min/max, regex patterns, and required field controls.",
        color: "#a78bfa",
    },
    {
        icon: FileText,
        title: "10+ Field Types",
        desc: "Text, email, number, rating, date, select, multi-select, checkbox and more.",
        color: "#fbbf24",
    },
];

const fieldTypes = ["Short Text", "Long Text", "Email", "Number", "Rating ⭐", "Date 📅", "Single Select", "Multi Select", "Checkbox", "Yes/No"];

const stats = [
    { label: "Forms Created", value: "2,400+", icon: FileText },
    { label: "Responses Collected", value: "48,000+", icon: CheckCircle2 },
    { label: "Active Users", value: "1,200+", icon: Users },
    { label: "Themes Available", value: "5", icon: Leaf },
];

export default function LandingPage() {
    const { user } = useUser();
    const router = useRouter();
    const audioRef = useRef<HTMLAudioElement>(null);
    // Check sessionStorage so the watering animation only plays once per session.
    // On return visits (e.g. after logout) we skip straight to the landing page.
    const [entered, setEntered] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("rf_entered") === "true";
        }
        return false;
    });
    const [muted, setMuted] = useState(false);
    const [isWatering, setIsWatering] = useState(false);

    useEffect(() => {
        if (entered) {
            // Trigger cinematic animations
            setTimeout(() => {
                document.body.classList.add("is-loaded");
            }, 100);
            
            // Play background audio
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.error("Audio playback failed", e));
                audioRef.current.volume = 0.5;
            }
        }
        
        return () => {
            document.body.classList.remove("is-loaded");
        };
    }, [entered]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !muted;
            setMuted(!muted);
        }
    };

    const handleWatered = () => {
        sessionStorage.setItem("rf_entered", "true");
        setEntered(true);
    };

    if (!entered) {
        return (
            <div className="fixed inset-0 bg-[#ffffff] z-[99999] flex flex-col items-center justify-center overflow-hidden">
                <div className="w-full max-w-sm h-64 -mb-12 z-20">
                    <WateringCanScene 
                        onWatered={handleWatered} 
                        onHoldStart={() => setIsWatering(true)} 
                        onHoldEnd={() => setIsWatering(false)} 
                    />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    {isWatering && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 z-10 pointer-events-none">
                            {[0, 1, 2].map((i) => (
                                <Droplets 
                                    key={i} 
                                    className="w-5 h-5 text-blue-400/80 opacity-0"
                                    style={{ 
                                        animation: `waterDrop 0.8s ease-in ${i * 0.15}s infinite`
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    <img 
                        src="/assets/5b9641626708aa1edfe306c0_pine_tree_loader.gif" 
                        alt="Loading" 
                        className={`w-10 transition-transform duration-700 ${isWatering ? 'scale-110' : 'scale-100'}`} 
                    />
                </div>
                
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes waterDrop {
                        0% { transform: translateY(-10px); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: translateY(40px) scale(0.8); opacity: 0; }
                    }
                `}} />
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: "#121513" }}>
            <audio ref={audioRef} src="/assets/morning-birds-chirping.mp3" loop />
            
            {/* Audio Toggle */}
            <button 
                onClick={toggleMute}
                className="fixed bottom-6 left-6 z-[999] p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-colors"
            >
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Cinematic Opening Preloader transition */}
            <div className="section_preloader pointer-events-none" id="preloader">
                <div className="pre_loader">
                    <img src="/assets/5b9641626708aa1edfe306c0_pine_tree_loader.gif" alt="Pine Tree Loader" className="loader_gif" />
                </div>
            </div>

            {/* Cinematic Opening Animation Layers */}
            <div className="section_opening" id="opening-section">
                <div className="hero-forest-bkgrnd" id="forest-bkgrnd"></div>
                <img src="/assets/cloud_cover_top_left.png" alt="Cloud Cover Top Left" className="hero-cloud hero-cloud-top-left" />
                <img src="/assets/cloud_cover_bottom_right.png" alt="Cloud Cover Bottom Right" className="hero-cloud hero-cloud-bottom-right" />
                <img src="/assets/cloud_cover_small_2.png" alt="Cloud Cover Small" className="hero-cloud hero-cloud-cover_small" />
                <img src="/assets/cloud_cover_big_2.png" alt="Cloud Cover Big" className="hero-cloud hero-cloud-cover_big" />
                
                <div className="hero-floor-bkgrnd">
                    <div className="hero-floor-mist-top"></div>
                    <div className="hero-floor-mist-bottom"></div>
                </div>
                
                <div className="particle_section">
                    <div className="particles"></div>
                </div>
            </div>

            {/* Main Next.js Content (Fades in over the cinematic background) */}
            <div className="section_home_content">

            {/* ======================== NAVBAR ======================== */}
            <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 backdrop-blur-sm">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #52b788, #2d6a4f)" }}>
                        <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">
                        Root <span style={{ color: "#52b788" }}>Forms</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/explore" className="text-sm text-white/60 hover:text-white transition-colors">Explore</Link>
                    <Link href="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
                    <Link href={env.NEXT_PUBLIC_API_URL?.replace("/trpc", "/docs") ?? "http://localhost:8000/docs"} target="_blank" className="text-sm text-white/60 hover:text-white transition-colors">API Docs</Link>
                </div>

                <div className="flex items-center gap-3">
                    {user?.id ? (
                        <Button
                            onClick={() => router.push("/dashboard/forms")}
                            className="text-sm font-medium"
                            style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}
                        >
                            Dashboard
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => router.push("/signin")} className="text-white/70 hover:text-black cursor-pointer text-sm">
                                Sign in
                            </Button>
                            <Button
                                onClick={() => router.push("/signup")}
                                className="text-sm font-medium cursor-pointer"
                                style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}
                            >
                                Get Started Free
                            </Button>
                        </>
                    )}
                </div>
            </nav>

            {/* ======================== HERO ======================== */}
            <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-32 max-w-6xl mx-auto">
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 border"
                    style={{ background: "rgba(82,183,136,0.1)", borderColor: "rgba(82,183,136,0.3)", color: "#52b788" }}
                >
                    <Trees className="w-3 h-3" />
                    Nature-Inspired Form Builder
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up">
                    Forms that feel like
                    <span className="block shimmer-text">nature itself</span>
                </h1>

                <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed animate-fade-in-up delay-100">
                    Build stunning, Typeform-style forms with breathtaking nature themes.
                    Forest, ocean, fire, snow — your forms will leave an impression.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-fade-in-up delay-200">
                    <Button
                        size="lg"
                        onClick={() => router.push(user?.id ? "/dashboard/forms" : "/signup")}
                        className="h-12 px-8 text-base font-semibold rounded-xl animate-pulse-glow"
                        style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}
                    >
                        Start Building for Free
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => router.push("/explore")}
                        className="h-12 px-8 text-base font-semibold rounded-xl border-white/20 text-black hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                        <Eye className="mr-2 w-4 h-4" />
                        Explore Public Forms
                    </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl animate-fade-in-up delay-300">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center p-4 rounded-2xl border"
                            style={{ background: "rgba(27,47,35,0.5)", borderColor: "rgba(45,106,79,0.4)" }}
                        >
                            <stat.icon className="w-5 h-5 mb-2" style={{ color: "#52b788" }} />
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                            <span className="text-xs text-white/50 mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ======================== THEMES GALLERY ======================== */}
            <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        5 Interactive Themes, Infinite Possibilities
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Every theme is carefully crafted with harmonious colors, bringing the beauty of nature to your forms.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {themes.map((theme, i) => (
                        <div
                            key={i}
                            className="relative overflow-hidden rounded-2xl cursor-pointer group"
                            style={{
                                background: theme.bg,
                                border: `1px solid ${theme.border}`,
                                transition: "all 0.3s ease",
                            }}
                        >
                            {/* Theme preview */}
                            <div className="p-6">
                                <div className="text-3xl mb-3">{theme.emoji}</div>
                                <h3 className="font-semibold text-lg mb-1" style={{ color: "#fff" }}>
                                    {theme.name}
                                </h3>
                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                                    {theme.desc}
                                </p>

                                {/* Mini form preview */}
                                <div className="mt-4 space-y-2">
                                    <div
                                        className="h-2 rounded-full w-3/4"
                                        style={{ background: "rgba(255,255,255,0.1)" }}
                                    />
                                    <div
                                        className="h-8 rounded-lg w-full"
                                        style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${theme.border}` }}
                                    />
                                    <div
                                        className="h-8 rounded-lg w-2/3 flex items-center justify-center text-xs font-medium"
                                        style={{ background: theme.accent, color: "#0d1b12" }}
                                    >
                                        Submit
                                    </div>
                                </div>
                            </div>

                            {/* Hover accent bar */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                                style={{ background: theme.accent }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ======================== FEATURES ======================== */}
            <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Everything you need to collect data beautifully
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Root Forms combines developer-grade power with designer-level aesthetics.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl border group hover:scale-105 transition-all duration-300"
                            style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                style={{ background: `${f.color}22` }}
                            >
                                <f.icon className="w-5 h-5" style={{ color: f.color }} />
                            </div>
                            <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-white/60 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ======================== FIELD TYPES ======================== */}
            <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        10+ Field Types Out of the Box
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Every field type you need with full validation support powered by Zod.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    {fieldTypes.map((type, i) => (
                        <span
                            key={i}
                            className="px-4 py-2 rounded-full text-sm font-medium border"
                            style={{
                                background: "rgba(82,183,136,0.1)",
                                borderColor: "rgba(82,183,136,0.3)",
                                color: "#95d5b2",
                            }}
                        >
                            {type}
                        </span>
                    ))}
                </div>
            </section>

            {/* ======================== VISIBILITY MODES ======================== */}
            <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                    <div
                        className="p-8 rounded-2xl border"
                        style={{ background: "rgba(27,47,35,0.5)", borderColor: "rgba(45,106,79,0.5)" }}
                    >
                        <Globe className="w-8 h-8 mb-4" style={{ color: "#52b788" }} />
                        <h3 className="text-xl font-bold text-white mb-2">Public Forms</h3>
                        <p className="text-white/60 mb-4 text-sm leading-relaxed">
                            Published forms with Public visibility appear on the Explore page and template galleries.
                            Anyone can discover and submit them.
                        </p>
                        <div className="flex items-center gap-2 text-sm" style={{ color: "#52b788" }}>
                            <CheckCircle2 className="w-4 h-4" />
                            Appears in Explore & galleries
                        </div>
                        <div className="flex items-center gap-2 text-sm mt-1" style={{ color: "#52b788" }}>
                            <CheckCircle2 className="w-4 h-4" />
                            Direct link sharing
                        </div>
                    </div>
                    <div
                        className="p-8 rounded-2xl border"
                        style={{ background: "rgba(27,15,5,0.5)", borderColor: "rgba(124,58,0,0.5)" }}
                    >
                        <Lock className="w-8 h-8 mb-4" style={{ color: "#ff6b35" }} />
                        <h3 className="text-xl font-bold text-white mb-2">Unlisted Forms</h3>
                        <p className="text-white/60 mb-4 text-sm leading-relaxed">
                            Published forms with Unlisted visibility are hidden from all public areas.
                            Only accessible via the direct link you share.
                        </p>
                        <div className="flex items-center gap-2 text-sm" style={{ color: "#ff6b35" }}>
                            <CheckCircle2 className="w-4 h-4" />
                            Hidden from Explore & galleries
                        </div>
                        <div className="flex items-center gap-2 text-sm mt-1" style={{ color: "#ff6b35" }}>
                            <CheckCircle2 className="w-4 h-4" />
                            Accessible via direct link only
                        </div>
                    </div>
                </div>
            </section>

            {/* ======================== CTA ======================== */}
            <section className="relative z-10 px-6 py-24 text-center max-w-3xl mx-auto">
                <div
                    className="p-12 rounded-3xl border relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, rgba(45,106,79,0.4), rgba(27,47,35,0.6))",
                        borderColor: "rgba(82,183,136,0.4)",
                    }}
                >
                    {/* Decorative glow */}
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(82,183,136,0.6), transparent)",
                        }}
                    />
                    <div className="relative z-10">
                        <div className="text-5xl mb-4">🌿</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to build your first form?
                        </h2>
                        <p className="text-white/60 mb-8 leading-relaxed">
                            Join creators who build beautiful, nature-inspired forms.
                            No credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                onClick={() => router.push(user?.id ? "/dashboard/forms" : "/signup")}
                                className="h-12 px-8 text-base font-semibold rounded-xl"
                                style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}
                            >
                                Start for Free
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <p className="text-sm text-white/40">
                                Demo: demo@root-forms.sameerdev.tech / Demo@12345
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======================== FOOTER ======================== */}
            <footer className="relative z-10 border-t border-white/10 px-6 md:px-12 py-12">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #52b788, #2d6a4f)" }}>
                            <Leaf className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-semibold text-white">Root Forms</span>
                        <span className="text-white/40 text-sm ml-2">© 2025</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link href="/explore" className="text-sm text-white/50 hover:text-white">Explore</Link>
                        <Link href="/pricing" className="text-sm text-white/50 hover:text-white">Pricing</Link>
                        <Link href={env.NEXT_PUBLIC_API_URL?.replace("/trpc", "/docs") ?? "http://localhost:8000/docs"} target="_blank" className="text-sm text-white/50 hover:text-white">API Docs</Link>
                        <Link href="/dashboard/forms" className="text-sm text-white/50 hover:text-white">Dashboard</Link>
                    </div>

                    <p className="text-xs text-white/30">Built with 🌿 tRPC · Drizzle · Next.js</p>
                </div>
            </footer>
            </div>
        </div>
    );
}
