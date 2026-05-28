import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing",
    description: "Simple, transparent pricing for Root Forms. Start free, upgrade when you need more.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
