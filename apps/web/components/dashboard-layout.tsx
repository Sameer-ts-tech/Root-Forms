"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "~/hooks/api/auth";
import { Leaf, FileText, Globe, LogOut, Settings } from "lucide-react";
import { trpc } from "~/trpc/client";
import { env } from "~/env.js";

const navItems = [
    { label: "My Forms", href: "/dashboard/forms", icon: FileText },
    { label: "Explore", href: "/explore", icon: Globe },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isFetched } = useUser();

    // Auth guard: redirect to signin if user is not authenticated
    useEffect(() => {
        if (isFetched && !user) {
            router.replace("/signin");
        }
    }, [isFetched, user, router]);

    const signoutMutation = trpc.auth.signout.useMutation();

    const handleLogout = async () => {
        try {
            await signoutMutation.mutateAsync();
        } catch (e) {
            console.error(e);
        } finally {
            // Flag the logged-out state so the landing page navbar renders
            // Sign in + Get Started immediately without waiting for the query.
            localStorage.setItem("rf_logged_out", "1");
            window.location.href = "/";
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: "#060e09" }}>
            {/* Fixed BG */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div style={{ background: "radial-gradient(ellipse 60% 50% at 0% 50%, rgba(45,106,79,0.1) 0%, transparent 60%)" }} className="absolute inset-0" />
            </div>

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-60 z-40 border-r flex flex-col" style={{ background: "rgba(9,18,12,0.95)", borderColor: "rgba(45,106,79,0.3)" }}>
                {/* Logo */}
                <div className="p-5 border-b" style={{ borderColor: "rgba(45,106,79,0.3)" }}>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #52b788, #2d6a4f)" }}>
                            <Leaf className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="font-bold text-white">Root <span style={{ color: "#52b788" }}>Forms</span></span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const active = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                                style={{
                                    background: active ? "rgba(82,183,136,0.15)" : "transparent",
                                    color: active ? "#52b788" : "rgba(255,255,255,0.6)",
                                    borderLeft: active ? "3px solid #52b788" : "3px solid transparent",
                                }}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info */}
                <div className="p-4 border-t" style={{ borderColor: "rgba(45,106,79,0.3)" }}>
                    {user && (
                        <div className="mb-3 px-3 py-2 rounded-xl" style={{ background: "rgba(27,47,35,0.5)" }}>
                            <p className="text-xs text-white font-medium truncate">{user.fullName}</p>
                            <p className="text-xs text-white/40 truncate">{user.email}</p>
                        </div>
                    )}
                    <Link
                        href="/pricing"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white transition-colors mb-1"
                    >
                        <Settings className="w-3.5 h-3.5" />
                        Upgrade Plan
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="ml-60 flex-1 relative z-10">
                {children}
            </main>
        </div>
    );
}
