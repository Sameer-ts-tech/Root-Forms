import { db, eq, and, desc, count, sql } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formSubmissionsTable } from "@repo/database/models/form-submission";

import {
    createFormInput,
    type CreateFormInputType,
    listFormsByUserIdInput,
    type ListFormsByUserIdInputType,
} from "./model";

export default class FormService {
    public async createForm(payload: CreateFormInputType) {
        const { title, description, createdBy } = await createFormInput.parseAsync(payload);

        const result = await db
            .insert(formsTable)
            .values({
                title,
                description,
                createdBy,
            })
            .returning({
                id: formsTable.id,
            });

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error("Something went wrong while creating the form");

        return {
            id: result[0].id,
        };
    }

    public async updateForm(formId: string, userId: string, payload: {
        title?: string;
        description?: string;
        theme?: string;
        visibility?: "public" | "unlisted";
        submitMessage?: string;
        slug?: string;
        expiresAt?: string | null;
        maxResponses?: number | null;
        displayMode?: "one_at_a_time" | "all_at_once";
    }) {
        // Verify ownership
        const existing = await db.select({ id: formsTable.id, createdBy: formsTable.createdBy })
            .from(formsTable)
            .where(eq(formsTable.id, formId));
        if (!existing[0]) throw new Error("Form not found");
        if (existing[0].createdBy !== userId) throw new Error("Unauthorized");

        const updateData: Record<string, any> = {};
        if (payload.title !== undefined) updateData.title = payload.title;
        if (payload.description !== undefined) updateData.description = payload.description;
        if (payload.theme !== undefined) updateData.theme = payload.theme;
        if (payload.visibility !== undefined) updateData.visibility = payload.visibility;
        if (payload.submitMessage !== undefined) updateData.submitMessage = payload.submitMessage;
        if (payload.slug !== undefined) updateData.slug = payload.slug || null;
        if (payload.expiresAt !== undefined) updateData.expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null;
        if (payload.maxResponses !== undefined) updateData.maxResponses = payload.maxResponses;
        if (payload.displayMode !== undefined) updateData.displayMode = payload.displayMode;

        if (Object.keys(updateData).length === 0) {
            return { id: formId };
        }

        await db.update(formsTable)
            .set(updateData)
            .where(eq(formsTable.id, formId));

        return { id: formId };
    }

    public async publishForm(formId: string, userId: string) {
        const existing = await db.select({ createdBy: formsTable.createdBy })
            .from(formsTable).where(eq(formsTable.id, formId));
        if (!existing[0]) throw new Error("Form not found");
        if (existing[0].createdBy !== userId) throw new Error("Unauthorized");

        await db.update(formsTable)
            .set({ status: "published" })
            .where(eq(formsTable.id, formId));

        return { id: formId, status: "published" };
    }

    public async unpublishForm(formId: string, userId: string) {
        const existing = await db.select({ createdBy: formsTable.createdBy })
            .from(formsTable).where(eq(formsTable.id, formId));
        if (!existing[0]) throw new Error("Form not found");
        if (existing[0].createdBy !== userId) throw new Error("Unauthorized");

        await db.update(formsTable)
            .set({ status: "draft" })
            .where(eq(formsTable.id, formId));

        return { id: formId, status: "draft" };
    }

    public async archiveForm(formId: string, userId: string) {
        const existing = await db.select({ createdBy: formsTable.createdBy })
            .from(formsTable).where(eq(formsTable.id, formId));
        if (!existing[0]) throw new Error("Form not found");
        if (existing[0].createdBy !== userId) throw new Error("Unauthorized");

        await db.update(formsTable)
            .set({ status: "archived" })
            .where(eq(formsTable.id, formId));

        return { id: formId, status: "archived" };
    }

    public async deleteForm(formId: string, userId: string) {
        const existing = await db.select({ createdBy: formsTable.createdBy })
            .from(formsTable).where(eq(formsTable.id, formId));
        if (!existing[0]) throw new Error("Form not found");
        if (existing[0].createdBy !== userId) throw new Error("Unauthorized");

        await db.delete(formsTable).where(eq(formsTable.id, formId));
        return { id: formId };
    }

    public async cloneForm(formId: string, userId: string) {
        const form = await this.getFormWithFields(formId);

        const [newForm] = await db.insert(formsTable).values({
            title: `${form.title} (Copy)`,
            description: form.description ?? undefined,
            theme: form.theme ?? "forest",
            visibility: "unlisted",
            status: "draft",
            submitMessage: form.submitMessage ?? undefined,
            createdBy: userId,
        }).returning({ id: formsTable.id });

        if (!newForm) throw new Error("Failed to clone form");

        // Clone fields
        for (const field of form.fields) {
            await db.insert(formFieldsTable).values({
                formId: newForm.id,
                label: field.label,
                labelKey: field.labelKey,
                type: field.type as any,
                isRequired: field.isRequired,
                description: field.description ?? undefined,
                placeholder: field.placeholder ?? undefined,
                options: field.options as any,
                validations: field.validations as any,
                index: field.index,
            });
        }

        return { id: newForm.id };
    }

    public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
        const { userId } = await listFormsByUserIdInput.parseAsync(payload);

        const forms = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                status: formsTable.status,
                visibility: formsTable.visibility,
                theme: formsTable.theme,
                slug: formsTable.slug,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,
            })
            .from(formsTable)
            .where(eq(formsTable.createdBy, userId))
            .orderBy(desc(formsTable.createdAt));

        // Get submission counts for each form
        const formsWithCounts = await Promise.all(
            forms.map(async (form) => {
                const [countResult] = await db
                    .select({ count: count() })
                    .from(formSubmissionsTable)
                    .where(eq(formSubmissionsTable.formId, form.id));

                return {
                    ...form,
                    createdAt: form.createdAt ? form.createdAt.toISOString() : null,
                    updatedAt: form.updatedAt ? form.updatedAt.toISOString() : null,
                    submissionCount: countResult?.count ?? 0,
                };
            })
        );

        return formsWithCounts;
    }

    public async getPublicForms() {
        const forms = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                theme: formsTable.theme,
                slug: formsTable.slug,
                createdAt: formsTable.createdAt,
            })
            .from(formsTable)
            .where(
                and(
                    eq(formsTable.status, "published"),
                    eq(formsTable.visibility, "public")
                )
            )
            .orderBy(desc(formsTable.createdAt));

        const formsWithCounts = await Promise.all(
            forms.map(async (form) => {
                const [countResult] = await db
                    .select({ count: count() })
                    .from(formSubmissionsTable)
                    .where(eq(formSubmissionsTable.formId, form.id));

                return {
                    ...form,
                    createdAt: form.createdAt ? form.createdAt.toISOString() : null,
                    submissionCount: countResult?.count ?? 0,
                };
            })
        );

        return formsWithCounts;
    }

    public async getFormBySlug(slug: string) {
        const [form] = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(eq(formsTable.slug, slug));

        if (!form) throw new Error(`Form with slug '${slug}' not found`);
        return this.getFormWithFields(form.id);
    }

    public async getFormWithFields(formId: string) {
        const rows = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                status: formsTable.status,
                visibility: formsTable.visibility,
                theme: formsTable.theme,
                submitMessage: formsTable.submitMessage,
                slug: formsTable.slug,
                displayMode: formsTable.displayMode,
                expiresAt: formsTable.expiresAt,
                maxResponses: formsTable.maxResponses,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,

                field_id: formFieldsTable.id,
                field_formId: formFieldsTable.formId,
                field_label: formFieldsTable.label,
                field_labelKey: formFieldsTable.labelKey,
                field_description: formFieldsTable.description,
                field_placeholder: formFieldsTable.placeholder,
                field_isRequired: formFieldsTable.isRequired,
                field_index: formFieldsTable.index,
                field_type: formFieldsTable.type,
                field_options: formFieldsTable.options,
                field_validations: formFieldsTable.validations,
                field_createdAt: formFieldsTable.createdAt,
                field_updatedAt: formFieldsTable.updatedAt,
            })
            .from(formsTable)
            .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
            .where(eq(formsTable.id, formId))
            .orderBy(formFieldsTable.index);

        if (!rows || rows.length === 0) throw new Error(`Form with ID ${formId} not found`);

        const first = rows[0]!;

        const form = {
            id: first.id,
            title: first.title,
            description: first.description ?? null,
            status: first.status,
            visibility: first.visibility,
            theme: first.theme ?? "forest",
            submitMessage: first.submitMessage ?? null,
            slug: first.slug ?? null,
            displayMode: first.displayMode ?? "one_at_a_time",
            expiresAt: first.expiresAt ? first.expiresAt.toISOString() : null,
            maxResponses: first.maxResponses ?? null,
            createdAt: first.createdAt ? first.createdAt.toISOString() : null,
            updatedAt: first.updatedAt ? first.updatedAt.toISOString() : null,
            fields: [] as Array<any>,
        };

        for (const r of rows) {
            if (!r.field_id) continue;

            form.fields.push({
                id: r.field_id,
                formId: r.field_formId,
                label: r.field_label,
                labelKey: r.field_labelKey,
                description: r.field_description ?? null,
                placeholder: r.field_placeholder ?? null,
                isRequired: r.field_isRequired,
                index: r.field_index!.toString(),
                type: r.field_type,
                options: r.field_options ?? null,
                validations: r.field_validations ?? null,
                createdAt: r.field_createdAt ? r.field_createdAt.toISOString() : null,
                updatedAt: r.field_updatedAt ? r.field_updatedAt.toISOString() : null,
            });
        }

        return form;
    }
}
