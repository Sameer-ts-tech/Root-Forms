"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, QrCode, Globe, Lock, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useGetFormWithFields, useUpdateForm } from "~/hooks/api/form";
import { DashboardLayout } from "~/components/dashboard-layout";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: formId } = use(params);
    const { form } = useGetFormWithFields(formId);
    const { updateFormAsync } = useUpdateForm();
    const [copied, setCopied] = useState(false);
    const [slug, setSlug] = useState(form?.slug ?? "");

    const formUrl = typeof window !== "undefined" ? `${window.location.origin}/form/${formId}` : `/form/${formId}`;
    const slugUrl = form?.slug ? (typeof window !== "undefined" ? `${window.location.origin}/form/${form.slug}` : `/form/${form.slug}`) : null;

    const copyLink = async (url: string) => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveSlug = async () => {
        if (!slug.trim()) return;
        try {
            await updateFormAsync({ formId, slug: slug.trim() });
            toast.success("Custom URL saved!");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <DashboardLayout>
            <div className="px-8 py-8 max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Button asChild size="sm" variant="ghost" className="text-white/60 h-8">
                        <Link href={`/dashboard/forms/${formId}`}><ArrowLeft className="w-4 h-4 mr-1" />Back</Link>
                    </Button>
                    <h1 className="text-xl font-bold text-white">Share Form</h1>
                </div>

                {form?.status !== "published" && (
                    <div className="p-4 rounded-xl border mb-6" style={{ background: "rgba(255,184,0,0.1)", borderColor: "rgba(255,184,0,0.3)" }}>
                        <p className="text-sm text-yellow-400">⚠️ This form is not yet published. Publish it first to share with respondents.</p>
                        <Button asChild size="sm" className="mt-3" style={{ background: "#52b788", color: "#0d1b12" }}>
                            <Link href={`/dashboard/forms/${formId}`}>Go to Builder</Link>
                        </Button>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Direct link */}
                    <div className="p-6 rounded-2xl border" style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}>
                        <h2 className="text-sm font-semibold text-white mb-3">Direct Form Link</h2>
                        <div className="flex items-center gap-2">
                            <div
                                className="flex-1 px-4 py-3 rounded-xl text-sm font-mono text-white/70 truncate border"
                                style={{ background: "rgba(9,18,12,0.5)", borderColor: "rgba(45,106,79,0.4)" }}
                            >
                                {formUrl}
                            </div>
                            <Button
                                size="sm"
                                onClick={() => copyLink(formUrl)}
                                className="shrink-0 gap-2"
                                style={{ background: copied ? "rgba(82,183,136,0.2)" : "rgba(82,183,136,0.1)", color: "#52b788", border: "1px solid rgba(82,183,136,0.3)" }}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                className="text-white/50 hover:text-white gap-2 h-8"
                            >
                                <Link href={formUrl} target="_blank">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Open in new tab
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Visibility info */}
                    <div className="p-6 rounded-2xl border" style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}>
                        <h2 className="text-sm font-semibold text-white mb-4">Visibility Settings</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => updateFormAsync({ formId, visibility: "public" })}
                                className="p-4 rounded-xl border flex flex-col items-start gap-2 transition-all"
                                style={{
                                    background: form?.visibility === "public" ? "rgba(82,183,136,0.15)" : "rgba(9,18,12,0.5)",
                                    borderColor: form?.visibility === "public" ? "rgba(82,183,136,0.5)" : "rgba(45,106,79,0.3)",
                                }}
                            >
                                <Globe className="w-5 h-5" style={{ color: form?.visibility === "public" ? "#52b788" : "rgba(255,255,255,0.4)" }} />
                                <div>
                                    <p className="text-sm font-medium text-white">Public</p>
                                    <p className="text-xs text-white/50 mt-0.5">Appears in Explore</p>
                                </div>
                            </button>
                            <button
                                onClick={() => updateFormAsync({ formId, visibility: "unlisted" })}
                                className="p-4 rounded-xl border flex flex-col items-start gap-2 transition-all"
                                style={{
                                    background: form?.visibility === "unlisted" ? "rgba(255,107,53,0.15)" : "rgba(9,18,12,0.5)",
                                    borderColor: form?.visibility === "unlisted" ? "rgba(255,107,53,0.5)" : "rgba(45,106,79,0.3)",
                                }}
                            >
                                <Lock className="w-5 h-5" style={{ color: form?.visibility === "unlisted" ? "#ff6b35" : "rgba(255,255,255,0.4)" }} />
                                <div>
                                    <p className="text-sm font-medium text-white">Unlisted</p>
                                    <p className="text-xs text-white/50 mt-0.5">Link only access</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* QR Code placeholder */}
                    <div className="p-6 rounded-2xl border" style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}>
                        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <QrCode className="w-4 h-4" style={{ color: "#52b788" }} />
                            QR Code
                        </h2>
                        <div
                            className="w-32 h-32 rounded-xl flex flex-col items-center justify-center border bg-white p-2"
                            style={{ borderColor: "rgba(45,106,79,0.3)" }}
                        >
                            <QRCodeSVG
                                value={formUrl}
                                size={110}
                                bgColor={"#ffffff"}
                                fgColor={"#0d1b12"}
                                level={"L"}
                            />
                        </div>
                        <p className="text-xs text-white/40 mt-3">Scan this code to quickly access the form on mobile devices.</p>
                    </div>

                    {/* Embed code */}
                    <div className="p-6 rounded-2xl border" style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}>
                        <h2 className="text-sm font-semibold text-white mb-3">Embed Code</h2>
                        <div
                            className="p-3 rounded-xl text-xs font-mono text-white/50 border select-all"
                            style={{ background: "rgba(9,18,12,0.5)", borderColor: "rgba(45,106,79,0.4)" }}
                        >
                            {`<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
