import { db, eq, max, sql } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import { createFieldInput, CreateFieldInputType } from "./model";
import type { FieldOption, FieldValidations } from "@repo/database/models/form-field";

function toLabelKey(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
}

export default class FormFieldService {
    private async getNextIndex(formId: string): Promise<string> {
        const result = await db
            .select({ maxIndex: max(formFieldsTable.index) })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId));

        const current = result[0]?.maxIndex;
        const next = current ? Number(current) + 1 : 1;

        return next.toString();
    }

    public async createField(payload: CreateFieldInputType & {
        options?: FieldOption[];
        validations?: FieldValidations;
    }) {
        const { label, type, formId, description, placeholder, isRequired } =
            await createFieldInput.parseAsync(payload);

        const labelKey = toLabelKey(label);
        const index = await this.getNextIndex(formId);

        const result = await db
            .insert(formFieldsTable)
            .values({
                label,
                labelKey,
                type,
                formId,
                description,
                placeholder,
                isRequired,
                index,
                options: payload.options ?? null,
                validations: payload.validations ?? null,
            })
            .returning({ id: formFieldsTable.id });

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error("Something went wrong while creating the field");

        return { id: result[0].id, labelKey, index };
    }

    public async updateField(fieldId: string, payload: {
        label?: string;
        description?: string;
        placeholder?: string;
        isRequired?: boolean;
        options?: FieldOption[];
        validations?: FieldValidations;
        type?: string;
    }) {
        const existing = await db.select({ id: formFieldsTable.id })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.id, fieldId));
        if (!existing[0]) throw new Error("Field not found");

        const updateData: Record<string, any> = {};
        if (payload.label !== undefined) {
            updateData.label = payload.label;
            updateData.labelKey = toLabelKey(payload.label);
        }
        if (payload.description !== undefined) updateData.description = payload.description;
        if (payload.placeholder !== undefined) updateData.placeholder = payload.placeholder;
        if (payload.isRequired !== undefined) updateData.isRequired = payload.isRequired;
        if (payload.options !== undefined) updateData.options = payload.options;
        if (payload.validations !== undefined) updateData.validations = payload.validations;
        if (payload.type !== undefined) updateData.type = payload.type;

        await db.update(formFieldsTable)
            .set(updateData)
            .where(eq(formFieldsTable.id, fieldId));

        return { id: fieldId };
    }

    public async deleteField(fieldId: string) {
        await db.delete(formFieldsTable).where(eq(formFieldsTable.id, fieldId));
        return { id: fieldId };
    }

    public async reorderFields(formId: string, fieldIds: string[]) {
        for (let i = 0; i < fieldIds.length; i++) {
            await db.update(formFieldsTable)
                .set({ index: String(i + 1) })
                .where(
                    eq(formFieldsTable.id, fieldIds[i]!)
                );
        }
        return { formId };
    }

    public async getFields(formId: string) {
        const result = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(formFieldsTable.index);

        return result.map((r) => ({
            id: r.id,
            formId: r.formId,
            label: r.label,
            labelKey: r.labelKey,
            description: r.description ?? null,
            placeholder: r.placeholder ?? null,
            isRequired: r.isRequired,
            index: r.index.toString(),
            type: r.type,
            options: r.options ?? null,
            validations: r.validations ?? null,
            createdAt: r.createdAt ? r.createdAt.toISOString() : null,
            updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
        }));
    }
}
