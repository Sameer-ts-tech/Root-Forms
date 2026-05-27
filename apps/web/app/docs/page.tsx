import { DashboardLayout } from "~/components/dashboard-layout";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function DocsPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col h-screen overflow-hidden">
                <div className="px-8 py-5 border-b flex items-center justify-between shrink-0" style={{ borderColor: "rgba(45,106,79,0.3)" }}>
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-white">API Documentation</h1>
                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(82,183,136,0.15)", color: "#52b788" }}>
                            Powered by OpenAPI & Scalar
                        </span>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="text-white/60 hover:text-white gap-2">
                        <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
                            Open in new tab
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </Button>
                </div>
                <div className="flex-1 bg-white">
                    {/* The API server is running on port 8000 */}
                    <iframe
                        src="http://localhost:8000/docs"
                        className="w-full h-full border-0"
                        title="Root Forms API Documentation"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
