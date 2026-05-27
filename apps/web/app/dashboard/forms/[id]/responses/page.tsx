"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, BarChart3, List, RefreshCw, Loader2, CheckCircle2, Clock, Archive } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useGetFormWithFields } from "~/hooks/api/form";
import { useGetSubmissions, useGetAnalytics } from "~/hooks/api/form-submission";
import { DashboardLayout } from "~/components/dashboard-layout";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";

export default function ResponsesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: formId } = use(params);
    const { form } = useGetFormWithFields(formId);
    const { submissions, total, isLoading: subLoading } = useGetSubmissions(formId);
    const { analytics, isLoading: analyticsLoading } = useGetAnalytics(formId);
    const [tab, setTab] = useState<"responses" | "analytics">("responses");
    const [isExporting, setIsExporting] = useState(false);
    const utils = trpc.useUtils();

    const fields = form?.fields ?? [];

    const getFieldLabel = (fieldId: string) =>
        fields.find((f: any) => f.id === fieldId)?.label ?? `Field ${fieldId.slice(0, 6)}`;

    const handleExportCsv = async () => {
        setIsExporting(true);
        try {
            const data = await utils.client.formSubmission.exportCsv.query({ formId });
            const csv = (data as any)?.csv ?? "";
            if (!csv) throw new Error("Empty CSV");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${form?.title ?? formId}-responses.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("CSV exported!");
        } catch (err) {
            console.error("Export failed:", err);
            toast.error("Export failed. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Button asChild size="sm" variant="ghost" className="text-white/60 h-8">
                            <Link href={`/dashboard/forms/${formId}`}><ArrowLeft className="w-4 h-4 mr-1" />Back to Builder</Link>
                        </Button>
                        <span className="text-white/30">/</span>
                        <h1 className="text-xl font-bold text-white">Responses & Analytics</h1>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleExportCsv}
                        disabled={isExporting || !submissions.length}
                        className="gap-2 font-semibold"
                        style={{ background: "rgba(82,183,136,0.15)", color: "#52b788", border: "1px solid rgba(82,183,136,0.3)" }}
                    >
                        {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        Export CSV
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl border text-center" style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}>
                        <p className="text-3xl font-bold text-white">{total}</p>
                        <p className="text-xs text-white/50 mt-1">Total Responses</p>
                    </div>
                    <div className="p-4 rounded-xl border text-center" style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}>
                        <p className="text-3xl font-bold text-white">{fields.length}</p>
                        <p className="text-xs text-white/50 mt-1">Questions</p>
                    </div>
                    <div className="p-4 rounded-xl border text-center" style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}>
                        <div className="flex items-center justify-center gap-2 mb-1">
                            {form?.status === "published" 
                                ? <CheckCircle2 className="w-5 h-5" style={{ color: "#52b788" }} />
                                : form?.status === "archived"
                                ? <Archive className="w-5 h-5 text-slate-400" />
                                : <Clock className="w-5 h-5 text-slate-400" />}
                            <p className="text-xl font-bold" style={{ color: form?.status === "published" ? "#52b788" : "#94a3b8" }}>
                                {form?.status ? form.status.charAt(0).toUpperCase() + form.status.slice(1) : "—"}
                            </p>
                        </div>
                        <p className="text-xs text-white/50">Form Status</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { id: "responses" as const, label: "Individual Responses", icon: List },
                        { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                                background: tab === t.id ? "rgba(82,183,136,0.15)" : "transparent",
                                color: tab === t.id ? "#52b788" : "rgba(255,255,255,0.5)",
                                border: `1px solid ${tab === t.id ? "rgba(82,183,136,0.4)" : "transparent"}`,
                            }}
                        >
                            <t.icon className="w-4 h-4" />
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Responses tab */}
                {tab === "responses" && (
                    <div>
                        {subLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#52b788" }} />
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="text-center py-16 rounded-2xl border" style={{ borderColor: "rgba(45,106,79,0.3)", background: "rgba(27,47,35,0.2)" }}>
                                <div className="text-4xl mb-3">📭</div>
                                <p className="text-white/60">No responses yet.</p>
                                <p className="text-sm text-white/30 mt-1">Share your form to collect responses.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {submissions.map((sub, idx) => (
                                    <div
                                        key={sub.id}
                                        className="p-5 rounded-2xl border"
                                        style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium text-white">Response #{total - idx}</span>
                                            <span className="text-xs text-white/40">
                                                {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "—"}
                                            </span>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {(sub.values as any[]).map((v: any, vi: number) => (
                                                <div key={vi} className="p-3 rounded-xl" style={{ background: "rgba(9,18,12,0.5)" }}>
                                                    <p className="text-xs text-white/50 mb-1">{getFieldLabel(v.fieldId)}</p>
                                                    <p className="text-sm text-white font-medium">{v.value || "—"}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Analytics tab */}
                {tab === "analytics" && (
                    <div>
                        {analyticsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#52b788" }} />
                            </div>
                        ) : !analytics ? (
                            <p className="text-white/60 text-center py-12">No analytics data yet.</p>
                        ) : (
                            <div className="space-y-6">
                                {/* Timeline chart */}
                                {analytics.timeline.length > 0 && (
                                    <div className="p-6 rounded-2xl border" style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}>
                                        <h3 className="text-sm font-semibold text-white mb-4">Daily Responses (Last 30 days)</h3>
                                        <div className="flex items-end gap-1 h-24">
                                            {analytics.timeline.map((point, i) => {
                                                const maxCount = Math.max(...analytics.timeline.map((p) => p.count));
                                                const height = maxCount > 0 ? (point.count / maxCount) * 100 : 0;
                                                return (
                                                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                                        <div
                                                            className="w-full rounded-t transition-all"
                                                            style={{ height: `${height}%`, background: "#52b788", minHeight: point.count > 0 ? "4px" : "0" }}
                                                            title={`${point.date}: ${point.count} responses`}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Field distribution */}
                                {analytics.fieldAnalytics.map((fa) => {
                                    if (fa.distribution.length === 0) return null;
                                    return (
                                        <div key={fa.fieldId} className="p-6 rounded-2xl border" style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}>
                                            <h3 className="text-sm font-semibold text-white mb-2">{getFieldLabel(fa.fieldId)}</h3>
                                            <p className="text-xs text-white/40 mb-4">{fa.totalResponses} responses</p>
                                            <div className="space-y-3">
                                                {fa.distribution.slice(0, 10).map((d, di) => {
                                                    const pct = fa.totalResponses > 0 ? Math.round((d.count / fa.totalResponses) * 100) : 0;
                                                    return (
                                                        <div key={di}>
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span className="text-white/70 truncate max-w-xs">{d.value || "(empty)"}</span>
                                                                <span style={{ color: "#52b788" }}>{d.count} ({pct}%)</span>
                                                            </div>
                                                            <div className="h-2 rounded-full" style={{ background: "rgba(45,106,79,0.3)" }}>
                                                                <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #52b788, #40916c)" }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
