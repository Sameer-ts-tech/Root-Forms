import { db, eq, and, gte, desc, count, sql } from "@repo/database";
import { formSubmissionsTable } from "@repo/database/models/form-submission";
import { formsTable } from "@repo/database/models/form";
import { usersTable } from "@repo/database/models/user";
import { createSubmissionInput, CreateSubmissionInputType } from "./model";
import EmailService from "../email";

// Simple in-memory rate limiter: 20 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): void {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (entry && now < entry.resetAt) {
        if (entry.count >= 20) {
            throw new Error("Too many submissions. Please try again later.");
        }
        entry.count++;
    } else {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    }
}

export default class FormSubmissionService {
    public async createSubmission(payload: CreateSubmissionInputType & { ipAddress?: string; respondentEmail?: string }) {
        const { formId, values } = await createSubmissionInput.parseAsync(payload);

        // Rate limit check
        if (payload.ipAddress) {
            checkRateLimit(payload.ipAddress);
        }

        // Check form is published
        const [form] = await db
            .select({
                status: formsTable.status,
                expiresAt: formsTable.expiresAt,
                maxResponses: formsTable.maxResponses,
            })
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        if (!form) throw new Error("Form not found");
        if (form.status !== "published") throw new Error("This form is not accepting responses");

        // Check expiry
        if (form.expiresAt && new Date() > form.expiresAt) {
            throw new Error("This form has expired and is no longer accepting responses");
        }

        // Check max responses
        if (form.maxResponses) {
            const [countResult] = await db
                .select({ count: count() })
                .from(formSubmissionsTable)
                .where(eq(formSubmissionsTable.formId, formId));

            if ((countResult?.count ?? 0) >= form.maxResponses) {
                throw new Error("This form has reached its maximum number of responses");
            }
        }

        const result = await db
            .insert(formSubmissionsTable)
            .values({
                formId,
                values,
                respondentEmail: payload.respondentEmail ?? null,
                ipAddress: payload.ipAddress ?? null,
            })
            .returning({ id: formSubmissionsTable.id, createdAt: formSubmissionsTable.createdAt });

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error("Something went wrong while creating the submission");

        // --- EMAIL NOTIFICATIONS ---
        try {
            // Retrieve form creator details
            const [formDetails] = await db
                .select({
                    title: formsTable.title,
                    creatorEmail: usersTable.email,
                })
                .from(formsTable)
                .innerJoin(usersTable, eq(formsTable.createdBy, usersTable.id))
                .where(eq(formsTable.id, formId));

            if (formDetails) {
                // Get total count
                const [totalCountResult] = await db
                    .select({ count: count() })
                    .from(formSubmissionsTable)
                    .where(eq(formSubmissionsTable.formId, formId));
                
                const totalCount = totalCountResult?.count ?? 0;

                const emailService = new EmailService();

                // Notify Creator
                emailService.sendCreatorNotification({
                    creatorEmail: formDetails.creatorEmail,
                    formTitle: formDetails.title,
                    formId: formId,
                    submissionCount: totalCount,
                }).catch(e => console.error("Failed to send creator email:", e));

                // Notify Respondent if email provided
                if (payload.respondentEmail) {
                    emailService.sendRespondentConfirmation({
                        respondentEmail: payload.respondentEmail,
                        formTitle: formDetails.title,
                        submissionId: result[0].id,
                    }).catch(e => console.error("Failed to send respondent email:", e));
                }
            }
        } catch (emailError) {
            console.error("Error during email notification dispatch:", emailError);
            // We do not throw here, as the submission was successfully stored.
        }

        return {
            id: result[0].id,
            createdAt: result[0].createdAt ? result[0].createdAt.toISOString() : null,
        };
    }

    public async getSubmissionsByFormId(formId: string, page = 1, pageSize = 50) {
        const offset = (page - 1) * pageSize;

        const rows = await db
            .select({
                id: formSubmissionsTable.id,
                formId: formSubmissionsTable.formId,
                values: formSubmissionsTable.values,
                respondentEmail: formSubmissionsTable.respondentEmail,
                ipAddress: formSubmissionsTable.ipAddress,
                createdAt: formSubmissionsTable.createdAt,
                updatedAt: formSubmissionsTable.updatedAt,
            })
            .from(formSubmissionsTable)
            .where(eq(formSubmissionsTable.formId, formId))
            .orderBy(desc(formSubmissionsTable.createdAt))
            .limit(pageSize)
            .offset(offset);

        const [countResult] = await db
            .select({ count: count() })
            .from(formSubmissionsTable)
            .where(eq(formSubmissionsTable.formId, formId));

        return {
            submissions: rows.map((r) => ({
                id: r.id,
                formId: r.formId,
                values: r.values ?? [],
                respondentEmail: r.respondentEmail ?? null,
                createdAt: r.createdAt ? r.createdAt.toISOString() : null,
                updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
            })),
            total: countResult?.count ?? 0,
            page,
            pageSize,
        };
    }

    public async getAnalytics(formId: string) {
        // Total submissions
        const [totalResult] = await db
            .select({ count: count() })
            .from(formSubmissionsTable)
            .where(eq(formSubmissionsTable.formId, formId));
        const total = totalResult?.count ?? 0;

        // Daily timeline (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const submissions = await db
            .select({
                createdAt: formSubmissionsTable.createdAt,
                values: formSubmissionsTable.values,
            })
            .from(formSubmissionsTable)
            .where(eq(formSubmissionsTable.formId, formId))
            .orderBy(formSubmissionsTable.createdAt);

        // Group by day
        const dailyMap = new Map<string, number>();
        for (const sub of submissions) {
            if (!sub.createdAt) continue;
            const dateKey = sub.createdAt.toISOString().split("T")[0]!;
            dailyMap.set(dateKey, (dailyMap.get(dateKey) ?? 0) + 1);
        }

        const timeline = Array.from(dailyMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-30);

        // Field-level analytics
        const fieldStats = new Map<string, { values: (string | string[] | number | boolean)[] }>();
        for (const sub of submissions) {
            const vals = (sub.values as any[]) ?? [];
            for (const v of vals) {
                if (!fieldStats.has(v.fieldId)) {
                    fieldStats.set(v.fieldId, { values: [] });
                }
                fieldStats.get(v.fieldId)!.values.push(v.value);
            }
        }

        const fieldAnalytics = Array.from(fieldStats.entries()).map(([fieldId, data]) => {
            // Calculate value distribution
            const distribution = new Map<string, number>();
            for (const v of data.values) {
                const key = Array.isArray(v) ? v.join(",") : String(v);
                distribution.set(key, (distribution.get(key) ?? 0) + 1);
            }

            return {
                fieldId,
                totalResponses: data.values.length,
                distribution: Array.from(distribution.entries())
                    .map(([value, count]) => ({ value, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 20),
            };
        });

        return {
            formId,
            total,
            timeline,
            fieldAnalytics,
        };
    }

    public async exportCsv(formId: string): Promise<string> {
        const { submissions } = await this.getSubmissionsByFormId(formId, 1, 10000);

        if (submissions.length === 0) return "No submissions yet";

        // Collect all fieldIds
        const allFieldIds = new Set<string>();
        for (const sub of submissions) {
            for (const v of sub.values as any[]) {
                allFieldIds.add(v.fieldId);
            }
        }

        const fieldIdArr = Array.from(allFieldIds);
        const headers = ["Submission ID", "Submitted At", ...fieldIdArr.map((id) => `field_${id.slice(0, 8)}`)];

        const rows = submissions.map((sub) => {
            const valueMap = new Map<string, string>();
            for (const v of sub.values as any[]) {
                const val = Array.isArray(v.value) ? v.value.join("; ") : String(v.value ?? "");
                valueMap.set(v.fieldId, val);
            }

            return [
                sub.id,
                sub.createdAt ?? "",
                ...fieldIdArr.map((id) => `"${(valueMap.get(id) ?? "").replace(/"/g, '""')}"`),
            ].join(",");
        });

        return [headers.join(","), ...rows].join("\n");
    }
}
