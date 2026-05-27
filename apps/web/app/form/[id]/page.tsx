"use client";

import { use, useState } from "react";
import { useGetFormWithFields } from "~/hooks/api/form";
import { useCreateSubmission } from "~/hooks/api/form-submission";
import { Leaf, Loader2, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getThemeConfig } from "~/lib/themes";
import { useEffect } from "react";
import "../../cinematic.css";

const WaterWave = dynamic(() => import("react-water-wave"), { ssr: false });
const PixelSnow = dynamic(() => import("~/components/PixelSnow"), { ssr: false });
const LiquidEther = dynamic(() => import("~/components/LiquidEther"), { ssr: false });
const Dither = dynamic(() => import("~/components/Dither"), { ssr: false });

type FieldValue = string | string[] | number | boolean;

function FieldRenderer({ field, value, onChange, t }: { field: any; value: FieldValue; onChange: (v: FieldValue) => void; t: ReturnType<typeof getThemeConfig>; }) {
    const baseInput = { background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, outline: "none", width: "100%", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" };

    if (field.type === "YES_NO") {
        return (
            <div className="flex gap-3">
                {["Yes", "No"].map((opt) => (
                    <button key={opt} onClick={() => onChange(opt.toLowerCase())} className="flex-1 py-3 rounded-xl font-medium text-sm transition-all"
                        style={{ background: value === opt.toLowerCase() ? t.accent : t.inputBg, border: `1px solid ${value === opt.toLowerCase() ? t.accent : t.border}`, color: value === opt.toLowerCase() ? t.bg : t.text }}>
                        {opt}
                    </button>
                ))}
            </div>
        );
    }

    if (field.type === "RATING") {
        const max = field.validations?.maxRating ?? 5;
        return (
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => onChange(n)} className="w-10 h-10 rounded-lg font-semibold text-sm transition-all"
                        style={{ background: (value as number) >= n ? t.accent : t.inputBg, border: `1px solid ${(value as number) >= n ? t.accent : t.border}`, color: (value as number) >= n ? t.bg : t.text }}>
                        {n}
                    </button>
                ))}
            </div>
        );
    }

    if (field.type === "SELECT" || field.type === "DROPDOWN") {
        return (
            <div className="space-y-2">
                {(field.options ?? []).map((opt: any) => (
                    <button key={opt.value} onClick={() => onChange(opt.value)} className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                        style={{ background: value === opt.value ? `${t.accent}20` : t.inputBg, border: `1px solid ${value === opt.value ? t.accent : t.border}`, color: t.text }}>
                        {opt.label}
                    </button>
                ))}
            </div>
        );
    }

    if (field.type === "MULTI_SELECT" || field.type === "CHECKBOX") {
        const selected = Array.isArray(value) ? value : [];
        return (
            <div className="space-y-2">
                {(field.options ?? []).map((opt: any) => {
                    const isSelected = selected.includes(opt.value);
                    return (
                        <button key={opt.value} onClick={() => onChange(isSelected ? selected.filter((v) => v !== opt.value) : [...selected, opt.value])} className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                            style={{ background: isSelected ? `${t.accent}20` : t.inputBg, border: `1px solid ${isSelected ? t.accent : t.border}`, color: t.text }}>
                            <span className="inline-flex w-4 h-4 rounded border items-center justify-center mr-3" style={{ borderColor: isSelected ? t.accent : t.border, background: isSelected ? t.accent : "transparent" }}>
                                {isSelected && <span className="text-[10px]" style={{ color: t.bg }}>✓</span>}
                            </span>
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        );
    }

    if (field.type === "LONG_TEXT") {
        return <textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? "Type your answer..."} rows={4} style={{ ...baseInput, resize: "vertical" }} />;
    }

    if (field.type === "DATE") {
        return <input type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} style={baseInput} />;
    }

    const inputType = field.type === "EMAIL" ? "email" : field.type === "NUMBER" ? "number" : field.type === "PASSWORD" ? "password" : "text";
    return <input type={inputType} value={String(value ?? "")} onChange={(e) => onChange(field.type === "NUMBER" ? Number(e.target.value) : e.target.value)} placeholder={field.placeholder ?? "Type your answer..."} style={baseInput} />;
}

export default function PublicFormPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> }) {
    const { id: formId } = use(params);
    const sp = use(searchParams);
    const isPreview = sp?.preview === "true";

    const { form, isLoading } = useGetFormWithFields(formId);
    const { createSubmissionAsync, isPending, isSuccess } = useCreateSubmission();
    const [values, setValues] = useState<Record<string, FieldValue>>({});
    const [currentIdx, setCurrentIdx] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const t = getThemeConfig(form?.theme);

    useEffect(() => {
        if (t.id === "forest") {
            if (isLoading) {
                document.body.classList.remove("is-loaded");
            } else {
                const timer = setTimeout(() => {
                    document.body.classList.add("is-loaded");
                }, 100);
                return () => {
                    clearTimeout(timer);
                    document.body.classList.remove("is-loaded");
                };
            }
        }
    }, [t.id, isLoading]);

    const fields = form?.fields ?? [];
    const isAllAtOnce = form?.displayMode === "all_at_once";
    const currentField = fields[currentIdx];
    const isLast = currentIdx === fields.length - 1;

    const setValue = (id: string, val: FieldValue) => { setValues((p) => ({ ...p, [id]: val })); setError(null); };

    const handleNext = () => {
        if (currentField?.isRequired && !values[currentField.id]) { setError("This field is required."); return; }
        if (!isLast) setCurrentIdx((i) => i + 1);
    };

    const handleSubmit = async () => {
        if (isAllAtOnce) {
            const requiredMissing = fields.find((f: any) => f.isRequired && !values[f.id]);
            if (requiredMissing) { setError(`"${requiredMissing.label}" is required.`); return; }
        } else {
            if (currentField?.isRequired && !values[currentField?.id ?? ""]) { setError("This field is required."); return; }
        }
        const submitValues = fields
            .map((f: any) => ({ fieldId: f.id, value: Array.isArray(values[f.id]) ? (values[f.id] as string[]).join(",") : String(values[f.id] ?? "") }))
            .filter((v) => v.value !== "");
        
        const emailField = fields.find((f: any) => f.type === "EMAIL");
        const respondentEmail = emailField && values[emailField.id] ? String(values[emailField.id]) : undefined;

        try { await createSubmissionAsync({ formId, values: submitValues as any, respondentEmail }); } catch (err: any) { setError(err.message); }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: "#060e09" }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: "#52b788" }} /></div>;

    if (!form) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#060e09" }}>
            <div className="text-center"><AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" /><p className="text-white/60">Form not found.</p><Link href="/explore" className="text-sm mt-4 inline-block" style={{ color: "#52b788" }}>Browse forms →</Link></div>
        </div>
    );

    // Block non-published forms unless it's a preview
    if (form.status !== "published" && !isPreview) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: t.bg }}>
            <div className="text-center p-8">
                <div className="text-5xl mb-4">🔒</div>
                <p style={{ color: t.text }} className="text-lg font-semibold mb-2">Form not published</p>
                <p style={{ color: t.textMuted }} className="text-sm">Contact the form creator.</p>
            </div>
        </div>
    );

    const Header = () => (
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: `${t.border}60` }}>
            <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.border})` }}>
                    <Leaf className="w-3 h-3" style={{ color: t.bg }} />
                </div>
                <span className="text-xs font-medium" style={{ color: t.textMuted }}>Powered by Root Forms</span>
            </Link>
            <div className="flex items-center gap-3">
                {isPreview && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "rgba(255,184,0,0.15)", color: "#fbbf24", border: "1px solid rgba(255,184,0,0.3)" }}>
                        👁 Preview mode
                    </span>
                )}
                <span className="text-xs" style={{ color: t.textMuted }}>{t.emoji} {form.theme}</span>
            </div>
        </div>
    );

    const SuccessScreen = () => (
        <div className="relative z-10 flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${t.accent}20`, border: `2px solid ${t.accent}` }}>
                    <CheckCircle2 className="w-10 h-10" style={{ color: t.accent }} />
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: t.text }}>Response Submitted!</h2>
                <p className="mb-6" style={{ color: t.textMuted }}>{form.submitMessage ?? "Thank you for your response!"}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: t.accent, color: t.bg }}>Submit Another</button>
                    <Link href="/explore" className="px-6 py-3 rounded-xl text-sm font-semibold border text-center bg-gray-700" style={{ borderColor: t.border, color: t.text }}>Browse More Forms</Link>
                </div>
            </div>
        </div>
    );

    const hasCustomBg = Boolean(t.backgroundUrl || t.id === "snow" || t.id === "fire" || t.id === "desert");

    const renderContent = () => (
        <div className={`flex flex-col w-full ${hasCustomBg ? 'h-screen overflow-y-auto' : 'min-h-screen'}`} style={{ background: hasCustomBg ? 'transparent' : t.bg }}>
            {!hasCustomBg && <div className="fixed inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${t.accent}22 0%, transparent 70%)` }} />}
            <Header />

            {isSuccess ? <SuccessScreen /> : isAllAtOnce ? (
                /* ---- ALL AT ONCE mode ---- */
                <div className="relative z-10 flex-1 flex flex-col items-center py-10 px-6">
                    <div className="w-full max-w-xl">
                        <div className="relative mb-8 text-center drop-shadow-md">
                            <div className="text-5xl mb-4">{t.emoji}</div>
                            <h1 className="text-3xl font-extrabold mb-3" style={{ color: t.text }}>{form.title}</h1>
                            {form.description && <p className="text-base leading-relaxed" style={{ color: t.textMuted }}>{form.description}</p>}
                        </div>

                        <div className="space-y-5 mb-8">
                            {fields.map((field: any) => (
                                <div key={field.id} className="relative p-6 rounded-2xl border backdrop-blur-2xl shadow-xl transition-all" style={{ background: t.surface, borderColor: t.border }}>
                                    {t.id === "snow" && <img src="/snow_patch.png" alt="" className="absolute -top-3 left-0 w-full h-10 opacity-90 pointer-events-none z-10 drop-shadow-md" />}
                                    <label className="block text-base font-semibold mb-2" style={{ color: t.text }}>
                                        {field.label}
                                        {field.isRequired && <span className="ml-1" style={{ color: t.accent }}>*</span>}
                                    </label>
                                    {field.description && <p className="text-sm mb-3" style={{ color: t.textMuted }}>{field.description}</p>}
                                    <FieldRenderer field={field} value={values[field.id] ?? ""} onChange={(v) => setValue(field.id, v)} t={t} />
                                </div>
                            ))}
                        </div>

                        {error && <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: "#f87171" }}><AlertCircle className="w-4 h-4" />{error}</div>}

                        <button onClick={handleSubmit} disabled={isPending} className="w-full flex items-center gap-2 px-6 py-4 rounded-xl text-base font-semibold justify-center shadow-lg hover:opacity-90 transition-opacity" style={{ background: t.accent, color: t.bg }}>
                            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : <><CheckCircle2 className="w-4 h-4" />Submit</>}
                        </button>
                    </div>
                </div>
            ) : (
                /* ---- ONE AT A TIME mode ---- */
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-xl">
                        {currentIdx === 0 && (
                            <div className="relative mb-8 text-center drop-shadow-md">
                                <div className="text-5xl mb-4">{t.emoji}</div>
                                <h1 className="text-3xl font-extrabold mb-3" style={{ color: t.text }}>{form.title}</h1>
                                {form.description && <p className="text-base leading-relaxed" style={{ color: t.textMuted }}>{form.description}</p>}
                            </div>
                        )}

                        {fields.length > 0 && (
                            <div className="mb-6 backdrop-blur-sm p-3 rounded-2xl" style={{ background: "rgba(0,0,0,0.2)" }}>
                                <div className="flex justify-between text-xs mb-2 font-medium" style={{ color: t.textMuted }}>
                                    <span>Question {currentIdx + 1} of {fields.length}</span>
                                    <span>{Math.round(((currentIdx + 1) / fields.length) * 100)}%</span>
                                </div>
                                <div className="h-1 rounded-full" style={{ background: `${t.border}60` }}>
                                    <div className="h-1 rounded-full transition-all duration-500 shadow-lg" style={{ width: `${((currentIdx + 1) / fields.length) * 100}%`, background: t.accent }} />
                                </div>
                            </div>
                        )}

                        {currentField && (
                            <div className="relative p-8 rounded-3xl border mb-4 backdrop-blur-2xl shadow-2xl transition-all" style={{ background: t.surface, borderColor: t.border }}>
                                {t.id === "snow" && <img src="/snow_patch.png" alt="" className="absolute -top-3 left-0 w-full h-auto opacity-90 pointer-events-none z-10 drop-shadow-lg" />}
                                <label className="block text-xl font-semibold mb-3" style={{ color: t.text }}>
                                    {currentField.label}
                                    {currentField.isRequired && <span className="ml-1" style={{ color: t.accent }}>*</span>}
                                </label>
                                {currentField.description && <p className="text-sm mb-5" style={{ color: t.textMuted }}>{currentField.description}</p>}
                                <FieldRenderer field={currentField} value={values[currentField.id] ?? ""} onChange={(v) => setValue(currentField.id, v)} t={t} />
                                {error && <div className="flex items-center gap-2 mt-4 text-sm" style={{ color: "#f87171" }}><AlertCircle className="w-4 h-4" />{error}</div>}
                            </div>
                        )}

                        {fields.length > 0 && (
                            <div className="flex items-center gap-3">
                                {currentIdx > 0 && (
                                    <button onClick={() => setCurrentIdx((i) => i - 1)} className="flex items-center gap-2 px-5 py-4 rounded-2xl text-sm font-medium border backdrop-blur-xl hover:bg-white/5 transition-colors" style={{ borderColor: t.border, color: t.text }}>
                                        <ArrowLeft className="w-4 h-4" />Back
                                    </button>
                                )}
                                {!isLast ? (
                                    <button onClick={handleNext} className="flex items-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold flex-1 justify-center shadow-lg hover:opacity-90 transition-opacity" style={{ background: t.accent, color: t.bg }}>
                                        Next <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} disabled={isPending} className="flex items-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold flex-1 justify-center shadow-lg hover:opacity-90 transition-opacity" style={{ background: t.accent, color: t.bg }}>
                                        {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : <><CheckCircle2 className="w-4 h-4" />Submit</>}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    if (t.id === "snow") {
        return (
            <div style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative", background: t.bg }}>
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <PixelSnow 
                        color="#ffffff"
                        flakeSize={0.012}
                        minFlakeSize={1.25}
                        pixelResolution={500}
                        speed={0.7}
                        density={1}
                        direction={95}
                        brightness={2.9}
                        depthFade={20}
                        farPlane={9}
                        gamma={0.4545}
                        variant="snowflake"
                    />
                </div>
                <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none" }}>
                    <PixelSnow 
                        color="#ffffff"
                        flakeSize={0.025}
                        minFlakeSize={2.0}
                        pixelResolution={300}
                        speed={1.1}
                        density={0.4}
                        direction={95}
                        brightness={3.5}
                        depthFade={10}
                        farPlane={5}
                        gamma={0.4545}
                        variant="snowflake"
                    />
                </div>
                <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
                    {renderContent()}
                </div>
            </div>
        );
    }

    if (t.id === "fire") {
        return (
            <div style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative", background: t.bg }}>
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <LiquidEther
                        colors={[ '#f17c07', '#f4ab33', '#EAB308' ]}
                        mouseForce={10}
                        cursorSize={95}
                        isViscous={false}
                        viscous={30}
                        iterationsViscous={22}
                        iterationsPoisson={17}
                        resolution={0.5}
                        isBounce={true}
                        autoDemo={true}
                        autoSpeed={0.5}
                        autoIntensity={0.7}
                        takeoverDuration={0.25}
                        autoResumeDelay={3000}
                        autoRampDuration={0.6}
                    />
                </div>
                <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
                    {renderContent()}
                </div>
            </div>
        );
    }

    if (t.id === "desert") {
        return (
            <div style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative", background: t.bg }}>
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                        <Dither
    waveColor={[0.8823529411764706,0.7490196078431373,0.4588235294117647]}
    disableAnimation={false}
    enableMouseInteraction
    mouseRadius={0.2}
    colorNum={4.9}
    waveAmplitude={0.2}
    waveFrequency={2.2}
    waveSpeed={0.03}
  />
                </div>
                <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
                    {renderContent()}
                </div>
            </div>
        );
    }

    if (t.backgroundUrl) {
        if (t.id === "water") {
            return (
                <WaterWave
                    imageUrl={t.backgroundUrl}
                    dropRadius={20}
                    perturbance={0.03}
                    resolution={512}
                    style={{ width: "100%", height: "100vh", overflow: "hidden", backgroundSize: "cover", backgroundPosition: "center" }}
                >
                    {() => renderContent()}
                </WaterWave>
            );
        }

        if (t.id === "forest") {
            return (
                <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
                    <div className="section_opening">
                        <div className="hero-forest-bkgrnd"></div>
                        <img src="/assets/cloud_cover_top_left.png" alt="" className="hero-cloud hero-cloud-top-left" />
                        <img src="/assets/cloud_cover_bottom_right.png" alt="" className="hero-cloud hero-cloud-bottom-right" />
                        <img src="/assets/cloud_cover_small_2.png" alt="" className="hero-cloud hero-cloud-cover_small" />
                        <img src="/assets/cloud_cover_big_2.png" alt="" className="hero-cloud hero-cloud-cover_big" />

                        <div className="hero-floor-bkgrnd">
                            <div className="hero-floor-mist-top"></div>
                            <div className="hero-floor-mist-bottom"></div>
                        </div>

                        <div className="particle_section">
                            <div className="particles"></div>
                        </div>
                    </div>
                    <div className="section_home_content">
                        {renderContent()}
                    </div>
                </div>
            );
        }

        return (
            <div style={{ width: "100%", height: "100vh", overflow: "hidden", backgroundImage: `url(${t.backgroundUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                {renderContent()}
            </div>
        );
    }

    return renderContent();
}
