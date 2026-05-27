"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye,
    PencilLine,
    Plus,
    Globe,
    Lock,
    Copy,
    Archive,
    GitBranch,
    Trash2,
    CheckCircle2,
    Clock,
    MoreHorizontal,
    BarChart3,
    Share2,
    Loader2,
} from "lucide-react";

import {
    useCreateForm,
    useListForms,
    usePublishForm,
    useUnpublishForm,
    useArchiveForm,
    useDeleteForm,
    useCloneForm,
} from "~/hooks/api/form";

import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { DashboardLayout } from "~/components/dashboard-layout";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    draft: { label: "Draft", color: "#94a3b8", icon: Clock },
    published: { label: "Published", color: "#52b788", icon: CheckCircle2 },
    archived: { label: "Archived", color: "#64748b", icon: Archive },
};

const themeEmoji: Record<string, string> = {
    forest: "🌲", water: "🌊", fire: "🔥", snow: "❄️", aurora: "🌌",
    sakura: "🌸", desert: "🏜️", midnight: "🌙", earth: "🌍", storm: "⛈️",
};

export default function DashboardForms() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const { createFormAsync, status } = useCreateForm();
    const { forms, isLoading } = useListForms();
    const { publishFormAsync } = usePublishForm();
    const { unpublishFormAsync } = useUnpublishForm();
    const { archiveFormAsync } = useArchiveForm();
    const { deleteFormAsync } = useDeleteForm();
    const { cloneFormAsync } = useCloneForm();

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await createFormAsync({ title: title.trim(), description: description.trim() || undefined });
            setOpen(false);
            setTitle("");
            setDescription("");
            toast.success("Form created! Now add your fields.");
            router.push(`/dashboard/forms/${result.id}`);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const copyLink = (id: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/form/${id}`);
        toast.success("Link copied to clipboard!");
    };

    const handlePublish = async (id: string) => {
        try {
            await publishFormAsync({ formId: id });
            toast.success("Form published! 🌿");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleUnpublish = async (id: string) => {
        try {
            await unpublishFormAsync({ formId: id });
            toast.success("Form unpublished.");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this form and all its responses? This cannot be undone.")) return;
        try {
            await deleteFormAsync({ formId: id });
            toast.success("Form deleted.");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleClone = async (id: string) => {
        try {
            const result = await cloneFormAsync({ formId: id });
            toast.success("Form cloned!");
            router.push(`/dashboard/forms/${result.id}`);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <DashboardLayout>
            <div className="px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-xs uppercase tracking-widest font-medium mb-1" style={{ color: "#52b788" }}>
                            Creator Dashboard
                        </p>
                        <h1 className="text-2xl font-bold text-white">My Forms</h1>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                id="create-form-btn"
                                className="gap-2 font-semibold"
                                style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}
                            >
                                <Plus className="w-4 h-4" />
                                New Form
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md" style={{ background: "#0d1b12", border: "1px solid rgba(45,106,79,0.5)" }}>
                            <DialogHeader>
                                <DialogTitle className="text-white">Create New Form</DialogTitle>
                                <DialogDescription className="text-white/60">
                                    Give your form a title and optional description. You can add fields next.
                                </DialogDescription>
                            </DialogHeader>

                            <form className="space-y-4" onSubmit={handleCreate}>
                                <div className="space-y-2">
                                    <label htmlFor="form-title" className="text-sm text-white/70 font-medium">Title *</label>
                                    <Input
                                        id="form-title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Customer Feedback Survey"
                                        className="text-white placeholder:text-white/30"
                                        style={{ background: "rgba(27,47,35,0.5)", border: "1px solid rgba(45,106,79,0.4)" }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="form-desc" className="text-sm text-white/70 font-medium">Description</label>
                                    <Textarea
                                        id="form-desc"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Optional description shown to respondents"
                                        className="min-h-20 text-white placeholder:text-white/30"
                                        style={{ background: "rgba(27,47,35,0.5)", border: "1px solid rgba(45,106,79,0.4)" }}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={status === "pending" || !title.trim()}
                                        className="font-semibold"
                                        style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}
                                    >
                                        {status === "pending" ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</> : "Create & Edit"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats bar */}
                {forms && forms.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: "Total Forms", value: forms.length },
                            { label: "Published", value: forms.filter((f) => f.status === "published").length },
                            { label: "Total Responses", value: forms.reduce((a, f) => a + (f.submissionCount ?? 0), 0) },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-xl border text-center"
                                style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.3)" }}
                            >
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Forms list */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 rounded-2xl border animate-pulse" style={{ background: "rgba(27,47,35,0.3)", borderColor: "rgba(45,106,79,0.2)" }} />
                        ))}
                    </div>
                ) : !forms || forms.length === 0 ? (
                    <div className="text-center py-24 rounded-2xl border" style={{ borderColor: "rgba(45,106,79,0.3)", background: "rgba(27,47,35,0.2)" }}>
                        <div className="text-5xl mb-4">🌿</div>
                        <p className="text-white/60 mb-4">No forms yet. Create your first form!</p>
                        <Button
                            onClick={() => setOpen(true)}
                            style={{ background: "linear-gradient(135deg, #52b788, #40916c)", color: "#0d1b12" }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Form
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {forms.map((form) => {
                            const sc = statusConfig[form.status] ?? statusConfig.draft!;
                            const emoji = themeEmoji[form.theme ?? "forest"] ?? "🌿";

                            return (
                                <div
                                    key={form.id}
                                    className="flex items-center justify-between p-5 rounded-2xl border transition-all hover:border-opacity-80"
                                    style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.35)" }}
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <span className="text-2xl shrink-0">{emoji}</span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h2 className="font-semibold text-white truncate">{form.title}</h2>
                                                <span
                                                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                                                    style={{ background: `${sc.color}20`, color: sc.color }}
                                                >
                                                    <sc.icon className="w-3 h-3" />
                                                    {sc.label}
                                                </span>
                                                <span
                                                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                                                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}
                                                >
                                                    {form.visibility === "public" ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                                    {form.visibility}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-white/40">
                                                    {form.submissionCount ?? 0} responses
                                                </span>
                                                {form.createdAt && (
                                                    <span className="text-xs text-white/30">
                                                        {new Date(form.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0 ml-4">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                            className="text-white/60 hover:text-white h-8 w-8 p-0"
                                            title="View analytics"
                                        >
                                            <Link href={`/dashboard/forms/${form.id}/responses`}>
                                                <BarChart3 className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                            className="text-white/60 hover:text-white h-8 w-8 p-0"
                                            title="Edit form"
                                        >
                                            <Link href={`/dashboard/forms/${form.id}`}>
                                                <PencilLine className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyLink(form.id)}
                                            className="text-white/60 hover:text-white h-8 w-8 p-0"
                                            title="Copy link"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-44"
                                                style={{ background: "#0d1b12", border: "1px solid rgba(45,106,79,0.4)" }}
                                            >
                                                {form.status === "draft" && (
                                                    <DropdownMenuItem
                                                        onClick={() => handlePublish(form.id)}
                                                        className="text-emerald-400 cursor-pointer"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Publish
                                                    </DropdownMenuItem>
                                                )}
                                                {form.status === "published" && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleUnpublish(form.id)}
                                                        className="text-white/70 cursor-pointer"
                                                    >
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        Unpublish
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem asChild className="text-white/70 cursor-pointer">
                                                    <Link href={`/form/${form.id}`} target="_blank">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Preview Form
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild className="text-white/70 cursor-pointer">
                                                    <Link href={`/dashboard/forms/${form.id}/share`}>
                                                        <Share2 className="w-4 h-4 mr-2" />
                                                        Share
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleClone(form.id)}
                                                    className="text-white/70 cursor-pointer"
                                                >
                                                    <GitBranch className="w-4 h-4 mr-2" />
                                                    Clone
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator style={{ background: "rgba(45,106,79,0.3)" }} />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(form.id)}
                                                    className="text-red-400 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
