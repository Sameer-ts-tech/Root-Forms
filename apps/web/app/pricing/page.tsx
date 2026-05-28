import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Leaf, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useUser } from "~/hooks/api/auth";
import { useRouter } from "next/navigation";

export const metadata: Metadata = {
    title: "Pricing",
    description: "Simple, transparent pricing for Root Forms. Start free, upgrade when you need more.",
};

const plans = [
    {
        name: "Free",
        price: "₹0",
        period: "forever",
        description: "Perfect for individuals and personal projects",
        color: "#52b788",
        bg: "rgba(27,47,35,0.5)",
        border: "rgba(45,106,79,0.4)",
        features: [
            "3 active forms",
            "100 responses/month",
            "Basic field types (text, email, number)",
            "Public & unlisted forms",
            "Basic analytics",
            "Share links",
            "API access",
        ],
        notIncluded: [
            "Custom themes",
            "CSV export",
            "Email notifications",
            "Priority support",
        ],
        cta: "Get Started Free",
        href: "/signup",
        highlight: false,
    },
    {
        name: "Pro",
        price: "₹499",
        period: "per month",
        description: "For creators who need more power and flexibility",
        color: "#52b788",
        bg: "linear-gradient(135deg, rgba(45,106,79,0.6), rgba(27,47,35,0.8))",
        border: "rgba(82,183,136,0.6)",
        features: [
            "Unlimited active forms",
            "Unlimited responses",
            "All 12 field types",
            "All 10 nature themes",
            "Advanced analytics & charts",
            "CSV export",
            "Email notifications (Resend)",
            "Custom submit messages",
            "Form expiry & response limits",
            "Custom slug URLs",
            "QR code sharing",
            "Priority support",
        ],
        notIncluded: [],
        cta: "Start Pro Trial",
        href: "/signup?plan=pro",
        highlight: true,
    },
    {
        name: "Team",
        price: "₹1,999",
        period: "per month",
        description: "For teams who need collaboration and admin tools",
        color: "#a78bfa",
        bg: "rgba(13,13,26,0.6)",
        border: "rgba(76,29,149,0.5)",
        features: [
            "Everything in Pro",
            "5 team members",
            "Shared form library",
            "Admin dashboard",
            "Team analytics",
            "Form cloning & templates",
            "Password-protected forms",
            "Webhook integrations",
            "Custom branding",
            "Dedicated support",
            "SLA guarantee",
        ],
        notIncluded: [],
        cta: "Contact Sales",
        href: "/signup?plan=team",
        highlight: false,
    },
];

export default function PricingPage() {
    const { user } = useUser();
    const router = useRouter();

    return (
        <div className="min-h-screen" style={{ background: "#060e09" }}>
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div style={{ background: "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(45,106,79,0.3) 0%, transparent 70%)" }} className="absolute inset-0" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #52b788, #2d6a4f)" }}>
                        <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Root <span style={{ color: "#52b788" }}>Forms</span></span>
                </Link>
                <div className="flex gap-4">
                    <Button variant="ghost" asChild className="text-white/70">
                        <Link href="/pricing">Pricing</Link>
                    </Button>
                    {user?.id ? (
                        <Button onClick={() => router.push("/dashboard/forms")} style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}>
                            Dashboard
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="text-white/70">
                                <Link href="/signin">Sign in</Link>
                            </Button>
                            <Button asChild style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}>
                                <Link href="/signup">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </nav>

            <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6 border" style={{ background: "rgba(82,183,136,0.1)", borderColor: "rgba(82,183,136,0.3)", color: "#52b788" }}>
                        Simple, Transparent Pricing
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Plans for every creator
                    </h1>
                    <p className="text-white/60 text-lg max-w-xl mx-auto">
                        Start free and scale as you grow. No hidden fees, no surprises.
                        <br />
                        <span className="text-sm text-white/40">Prices in Indian Rupees (₹). Real payment not implemented — demo only.</span>
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className="relative rounded-2xl border p-8 flex flex-col"
                            style={{
                                background: plan.bg,
                                borderColor: plan.border,
                                transform: plan.highlight ? "scale(1.03)" : "none",
                                boxShadow: plan.highlight ? "0 0 60px rgba(82,183,136,0.2)" : "none",
                            }}
                        >
                            {plan.highlight && (
                                <div
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold"
                                    style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}
                                >
                                    ✨ Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white mb-2">{plan.name}</h2>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                                    <span className="text-white/50 text-sm">/{plan.period}</span>
                                </div>
                                <p className="text-sm text-white/60">{plan.description}</p>
                            </div>

                            <Button
                                asChild
                                className="w-full mb-8 font-semibold"
                                style={plan.highlight
                                    ? { background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }
                                    : { borderColor: plan.color, color: plan.color }
                                }
                                variant={plan.highlight ? "default" : "outline"}
                            >
                                <Link href={plan.href}>{plan.cta}</Link>
                            </Button>

                            <div className="space-y-3 flex-1">
                                {plan.features.map((f, j) => (
                                    <div key={j} className="flex items-start gap-3 text-sm text-white/80">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: plan.color }} />
                                        {f}
                                    </div>
                                ))}
                                {plan.notIncluded.map((f, j) => (
                                    <div key={j} className="flex items-start gap-3 text-sm text-white/30">
                                        <X className="w-4 h-4 mt-0.5 shrink-0" />
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <div className="mt-20 text-center">
                    <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
                    <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
                        {[
                            {
                                q: "Is the free plan really free?",
                                a: "Yes! The free plan is free forever with 3 forms and 100 responses per month. No credit card required.",
                            },
                            {
                                q: "Can respondents fill forms without an account?",
                                a: "Absolutely. Respondents never need to create an account. Anyone with the link can fill a published form.",
                            },
                            {
                                q: "What are Public vs Unlisted forms?",
                                a: "Public forms appear in the Explore page and galleries. Unlisted forms are published but hidden from public listings — accessible only via direct link.",
                            },
                            {
                                q: "Is payment integration real?",
                                a: "No — this is a demo. Payment UI is shown for completeness but no real charges are made.",
                            },
                        ].map((faq, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-xl border"
                                style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}
                            >
                                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                                <p className="text-sm text-white/60 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
