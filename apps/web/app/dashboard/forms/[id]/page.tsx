"use client";

import { use, useState, useRef } from "react";
import Link from "next/link";
import {
    Plus, Trash2, GripVertical, ArrowLeft, Eye, Share2,
    Loader2, Save, CheckCircle2, FileText, ChevronRight,
    Type, AlignLeft, Mail, Hash, Star, Calendar,
    List, CheckSquare, ToggleLeft, Layers, AlignJustify, Palette
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { useGetFormWithFields, usePublishForm, useUnpublishForm, useUpdateForm } from "~/hooks/api/form";
import { useCreateField, useUpdateField, useDeleteField, useReorderFields } from "~/hooks/api/form-field";
import { DashboardLayout } from "~/components/dashboard-layout";
import { toast } from "sonner";
import { THEMES, getThemeConfig } from "~/lib/themes";

const FIELD_TYPES = [
    { type: "SHORT_TEXT", label: "Short Text", icon: Type },
    { type: "LONG_TEXT", label: "Long Text", icon: AlignLeft },
    { type: "EMAIL", label: "Email", icon: Mail },
    { type: "NUMBER", label: "Number", icon: Hash },
    { type: "SELECT", label: "Single Select", icon: List },
    { type: "MULTI_SELECT", label: "Multi Select", icon: CheckSquare },
    { type: "RATING", label: "Rating", icon: Star },
    { type: "DATE", label: "Date", icon: Calendar },
    { type: "YES_NO", label: "Yes / No", icon: ToggleLeft },
    { type: "CHECKBOX", label: "Checkbox", icon: CheckSquare },
] as const;

// Removed hardcoded themeColors

export default function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: formId } = use(params);

    const { form, isLoading } = useGetFormWithFields(formId);
    const { updateFormAsync } = useUpdateForm();
    const { publishFormAsync, isPending: isPublishing } = usePublishForm();
    const { unpublishFormAsync } = useUnpublishForm();
    const { createFieldAsync, isPending: isAddingField } = useCreateField();
    const { updateFieldAsync } = useUpdateField();
    const { deleteFieldAsync } = useDeleteField();
    const { reorderFieldsAsync } = useReorderFields();

    const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
    const [showAddField, setShowAddField] = useState(false);
    const [localFields, setLocalFields] = useState<any[] | null>(null);

    const theme = getThemeConfig(form?.theme);
    const fields = localFields ?? form?.fields ?? [];
    const activeField = fields.find((f: any) => f.id === activeFieldId);

    const handleAddField = async (type: string) => {
        try {
            await createFieldAsync({
                formId,
                label: `New ${type.replace(/_/g, " ").toLowerCase()} field`,
                type: type as any,
                isRequired: false,
            });
            setLocalFields(null); // reset local to let server state take over
            setShowAddField(false);
            toast.success("Field added!");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDeleteField = async (fieldId: string) => {
        try {
            await deleteFieldAsync({ fieldId });
            setLocalFields(null);
            if (activeFieldId === fieldId) setActiveFieldId(null);
            toast.success("Field deleted.");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleSaveTitle = async (e: React.FocusEvent<HTMLInputElement>) => {
        if (!form || !e.target.value.trim()) return;
        try {
            await updateFormAsync({ formId, title: e.target.value });
        } catch {}
    };

    const handlePublish = async () => {
        try {
            if (form?.status === "published") {
                await unpublishFormAsync({ formId });
                toast.success("Form unpublished.");
            } else {
                await publishFormAsync({ formId });
                toast.success("Form published! 🌿");
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleSetDisplayMode = async (mode: "one_at_a_time" | "all_at_once") => {
        if (form?.displayMode === mode) return;
        try {
            await updateFormAsync({ formId, displayMode: mode });
            toast.success(`Display mode set to: ${mode === "all_at_once" ? "All at once" : "One at a time"}`);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleSetTheme = async (newTheme: string) => {
        if (form?.theme === newTheme) return;
        try {
            await updateFormAsync({ formId, theme: newTheme });
            toast.success(`Theme updated to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const dragIndex = useRef<number | null>(null);

    const handleDragStart = (idx: number) => {
        dragIndex.current = idx;
    };

    const handleDrop = async (targetIdx: number) => {
        const src = dragIndex.current;
        dragIndex.current = null;
        if (src === null || src === targetIdx) return;

        const reordered = Array.from(fields);
        const [removed] = reordered.splice(src, 1);
        reordered.splice(targetIdx, 0, removed!);
        setLocalFields(reordered); // optimistic update

        try {
            await reorderFieldsAsync({ formId, fieldIds: reordered.map((f) => f.id) });
        } catch (err: any) {
            setLocalFields(null); // rollback
            toast.error("Reorder failed: " + err.message);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#52b788" }} />
                </div>
            </DashboardLayout>
        );
    }

    if (!form) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-screen gap-4">
                    <p className="text-white/60">Form not found.</p>
                    <Button asChild variant="outline"><Link href="/dashboard/forms">← Back to forms</Link></Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col" style={{ height: "100vh" }}>
                {/* Top bar */}
                <div
                    className="flex items-center justify-between px-6 py-3 border-b shrink-0"
                    style={{ background: "rgba(9,18,12,0.98)", borderColor: "rgba(45,106,79,0.4)" }}
                >
                    <div className="flex items-center gap-3">
                        <Button asChild size="sm" variant="ghost" className="text-white/70 hover:text-white h-8">
                            <Link href="/dashboard/forms"><ArrowLeft className="w-4 h-4 mr-1" />Back</Link>
                        </Button>
                        <ChevronRight className="w-4 h-4 text-white/20" />
                        <input
                            defaultValue={form.title}
                            onBlur={handleSaveTitle}
                            className="bg-transparent text-white font-semibold text-sm outline-none border-b border-transparent focus:border-white/30 transition-colors px-1 py-0.5"
                            style={{ minWidth: "200px" }}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                                background: form.status === "published" ? "rgba(82,183,136,0.2)" : "rgba(148,163,184,0.15)",
                                color: form.status === "published" ? "#52b788" : "#94a3b8",
                            }}
                        >
                            {form.status === "published" ? "● Published" : "○ Draft"}
                        </span>

                        {/* Theme picker */}
                        <div className="flex items-center shrink-0">
                            <Select value={form.theme || "forest"} onValueChange={handleSetTheme}>
                                <SelectTrigger className="h-[34px] w-[130px] text-xs bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors shadow-none rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-3.5 h-3.5 opacity-70" />
                                        <SelectValue placeholder="Theme" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-[#0d1b12] border-white/10 text-white" style={{ zIndex: 9999 }}>
                                    {Object.values(THEMES).map((t) => (
                                        <SelectItem key={t.id} value={t.id} className="text-xs hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer py-2">
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Display mode segmented control */}
                        <div className="flex items-center p-0.5 rounded-lg shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <button
                                onClick={() => handleSetDisplayMode("all_at_once")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${form.displayMode === "all_at_once" ? "shadow-sm" : "text-white/50 hover:text-white/80"}`}
                                style={form.displayMode === "all_at_once" ? { background: "rgba(82,183,136,0.15)", color: "#52b788", border: "1px solid rgba(82,183,136,0.3)" } : { border: "1px solid transparent" }}
                            >
                                <AlignJustify className="w-3.5 h-3.5" /> All at once
                            </button>
                            <button
                                onClick={() => handleSetDisplayMode("one_at_a_time")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${form.displayMode === "one_at_a_time" ? "shadow-sm" : "text-white/50 hover:text-white/80"}`}
                                style={form.displayMode === "one_at_a_time" ? { background: "rgba(82,183,136,0.15)", color: "#52b788", border: "1px solid rgba(82,183,136,0.3)" } : { border: "1px solid transparent" }}
                            >
                                <Layers className="w-3.5 h-3.5" /> One at a time
                            </button>
                        </div>

                        <Button asChild size="sm" variant="ghost" className="text-white/70 hover:text-black h-8 gap-1.5">
                            <Link href={`/form/${formId}?preview=true`} target="_blank">
                                <Eye className="w-3.5 h-3.5" />Preview
                            </Link>
                        </Button>

                        <Button asChild size="sm" variant="ghost" className="text-white/70 hover:text-black h-8 gap-1.5">
                            <Link href={`/dashboard/forms/${formId}/share`}>
                                <Share2 className="w-3.5 h-3.5" />Share
                            </Link>
                        </Button>

                        <Button asChild size="sm" variant="ghost" className="text-white/70 hover:text-black h-8 gap-1.5">
                            <Link href={`/dashboard/forms/${formId}/responses`}>
                                <FileText className="w-3.5 h-3.5" />Responses
                            </Link>
                        </Button>

                        <Button
                            size="sm"
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="font-semibold h-8 gap-1.5"
                            style={{
                                background: form.status === "published"
                                    ? "rgba(148,163,184,0.2)"
                                    : "linear-gradient(135deg, #52b788, #40916c)",
                                color: form.status === "published" ? "#94a3b8" : "#0d1b12",
                            }}
                        >
                            {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            {form.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                    </div>
                </div>

                {/* Builder body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left: Field list */}
                    <div
                        className="w-72 border-r flex flex-col"
                        style={{ background: "rgba(9,18,12,0.9)", borderColor: "rgba(45,106,79,0.3)" }}
                    >
                        <div className="p-4 border-b shrink-0" style={{ borderColor: "rgba(45,106,79,0.3)" }}>
                            <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-3">Fields ({fields.length})</p>

                            <Button
                                onClick={() => setShowAddField(!showAddField)}
                                size="sm"
                                className="w-full gap-2 text-xs font-medium"
                                style={{ background: "rgba(82,183,136,0.15)", color: "#52b788", border: "1px solid rgba(82,183,136,0.3)" }}
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Field
                            </Button>

                            {showAddField && (
                                <div
                                    className="mt-2 rounded-xl border overflow-hidden"
                                    style={{ background: "#0d1b12", borderColor: "rgba(45,106,79,0.4)" }}
                                >
                                    {FIELD_TYPES.map((ft) => (
                                        <button
                                            key={ft.type}
                                            onClick={() => handleAddField(ft.type)}
                                            disabled={isAddingField}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                        >
                                            <ft.icon className="w-4 h-4 shrink-0" style={{ color: "#52b788" }} />
                                            <span className="text-white/80 font-medium">{ft.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Native drag-and-drop field list */}
                        <div className="flex-1 overflow-y-auto p-3">
                            {fields.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-white/40">No fields yet.</p>
                                    <p className="text-xs text-white/25 mt-1">Click "Add Field" to start</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {fields.map((field: any, idx: number) => (
                                        <div
                                            key={field.id}
                                            draggable
                                            onDragStart={() => handleDragStart(idx)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => handleDrop(idx)}
                                            onClick={() => setActiveFieldId(field.id)}
                                            className="rounded-xl border cursor-pointer transition-all select-none"
                                            style={{
                                                background: activeFieldId === field.id ? theme.surface : "rgba(27,47,35,0.3)",
                                                borderColor: activeFieldId === field.id ? theme.accent : theme.border,
                                            }}
                                        >
                                            <div className="flex items-center gap-3 p-3">
                                                <div
                                                    className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-white/10 transition-colors shrink-0"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <GripVertical className="w-4 h-4 text-white/40" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{field.label}</p>
                                                    <p className="text-xs text-white/40">{field.type} · {field.isRequired ? "Required" : "Optional"}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteField(field.id); }}
                                                    className="h-7 w-7 p-0 text-red-400 hover:bg-red-400/10 shrink-0"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center: Field config */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeField ? (
                            <FieldConfigEditor
                                key={activeField.id}
                                field={activeField}
                                onUpdate={async (data: any) => {
                                    await updateFieldAsync({ fieldId: activeField.id, ...data });
                                    toast.success("Field updated.");
                                }}
                                theme={theme}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="text-5xl mb-4">🌿</div>
                                <p className="text-white/60 mb-2">Select a field to configure it</p>
                                <p className="text-sm text-white/30">or add a new field from the left panel</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Preview */}
                    <div
                        className="w-80 border-l overflow-y-auto shrink-0"
                        style={{ background: "rgba(9,18,12,0.5)", borderColor: "rgba(45,106,79,0.3)" }}
                    >
                        <div className="p-4 border-b" style={{ borderColor: "rgba(45,106,79,0.3)" }}>
                            <p className="text-xs font-medium text-white/50 uppercase tracking-widest">Live Preview</p>
                            <p className="text-xs text-white/30 mt-0.5">
                                Mode: {form.displayMode === "all_at_once" ? "All at once" : "One at a time"}
                            </p>
                        </div>
                        <div className="p-4">
                            <div
                                className="rounded-2xl overflow-hidden border"
                                style={{ background: theme.bg, borderColor: theme.border }}
                            >
                                <div className="h-1" style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.border})` }} />
                                <div className="p-5">
                                    <h3 className="font-bold text-base mb-1" style={{ color: theme.text }}>{form.title}</h3>
                                    {form.description && (
                                        <p className="text-xs mb-4" style={{ color: `${theme.text}80` }}>{form.description}</p>
                                    )}
                                    <div className="space-y-3">
                                        {fields.slice(0, 5).map((field: any) => (
                                            <div key={field.id}>
                                                <p className="text-xs font-medium mb-1" style={{ color: `${theme.text}cc` }}>
                                                    {field.label}
                                                    {field.isRequired && <span style={{ color: theme.accent }}> *</span>}
                                                </p>
                                                <div
                                                    className="h-8 rounded-lg w-full"
                                                    style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
                                                />
                                            </div>
                                        ))}
                                        {fields.length > 5 && (
                                            <p className="text-xs text-center" style={{ color: `${theme.text}50` }}>
                                                +{fields.length - 5} more fields
                                            </p>
                                        )}
                                    </div>
                                    {fields.length > 0 && (
                                        <button
                                            className="mt-4 w-full py-2 rounded-lg text-sm font-semibold"
                                            style={{ background: theme.accent, color: theme.bg }}
                                        >
                                            Submit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function FieldConfigEditor({ field, onUpdate, theme }: { field: any; onUpdate: (d: any) => void; theme: any }) {
    const [label, setLabel] = useState(field.label);
    const [description, setDescription] = useState(field.description ?? "");
    const [placeholder, setPlaceholder] = useState(field.placeholder ?? "");
    const [isRequired, setIsRequired] = useState(field.isRequired);
    const [options, setOptions] = useState<string[]>(
        field.options?.map((o: any) => o.label) ?? []
    );

    const hasOptions = ["SELECT", "MULTI_SELECT", "DROPDOWN", "CHECKBOX"].includes(field.type);

    return (
        <div className="max-w-md mx-auto space-y-5">
            <div>
                <h2 className="font-semibold text-white text-lg mb-1">Configure Field</h2>
                <p className="text-xs text-white/40">Type: <span style={{ color: theme.accent }}>{field.type}</span></p>
            </div>

            <div className="space-y-4 p-5 rounded-2xl border" style={{ background: "rgba(27,47,35,0.4)", borderColor: "rgba(45,106,79,0.35)" }}>
                <div>
                    <label className="text-xs text-white/60 font-medium block mb-1.5">Label *</label>
                    <Input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="text-white"
                        style={{ background: "rgba(27,47,35,0.6)", borderColor: "rgba(45,106,79,0.4)" }}
                    />
                </div>

                <div>
                    <label className="text-xs text-white/60 font-medium block mb-1.5">Helper Text</label>
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional description"
                        className="text-white placeholder:text-white/25"
                        style={{ background: "rgba(27,47,35,0.6)", borderColor: "rgba(45,106,79,0.4)" }}
                    />
                </div>

                {!hasOptions && (
                    <div>
                        <label className="text-xs text-white/60 font-medium block mb-1.5">Placeholder</label>
                        <Input
                            value={placeholder}
                            onChange={(e) => setPlaceholder(e.target.value)}
                            placeholder="Placeholder text..."
                            className="text-white placeholder:text-white/25"
                            style={{ background: "rgba(27,47,35,0.6)", borderColor: "rgba(45,106,79,0.4)" }}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <label className="text-xs text-white/60 font-medium">Required</label>
                    <button
                        onClick={() => setIsRequired(!isRequired)}
                        className="relative w-10 h-5 rounded-full transition-all"
                        style={{ background: isRequired ? theme.accent : "rgba(255,255,255,0.15)" }}
                    >
                        <div
                            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                            style={{ left: isRequired ? "22px" : "2px" }}
                        />
                    </button>
                </div>

                {hasOptions && (
                    <div>
                        <label className="text-xs text-white/60 font-medium block mb-2">Options</label>
                        <div className="space-y-2">
                            {options.map((opt, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input
                                        value={opt}
                                        onChange={(e) => {
                                            const next = [...options];
                                            next[i] = e.target.value;
                                            setOptions(next);
                                        }}
                                        placeholder={`Option ${i + 1}`}
                                        className="text-white placeholder:text-white/25"
                                        style={{ background: "rgba(27,47,35,0.6)", borderColor: "rgba(45,106,79,0.4)" }}
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setOptions(options.filter((_, j) => j !== i))}
                                        className="text-red-400 hover:bg-red-400/10 h-9 w-9 p-0 shrink-0"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setOptions([...options, ""])}
                                className="text-white/50 hover:text-white text-xs gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5" />Add Option
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Button
                onClick={() => onUpdate({
                    label,
                    description: description || undefined,
                    placeholder: placeholder || undefined,
                    isRequired,
                    options: hasOptions
                        ? options.filter(Boolean).map((o) => ({ label: o, value: o.toLowerCase().replace(/\s+/g, "_") }))
                        : undefined,
                })}
                className="w-full font-semibold"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.border})`, color: theme.bg }}
            >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
            </Button>
        </div>
    );
}
