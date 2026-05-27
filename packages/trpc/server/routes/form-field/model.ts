import { z } from "zod";

export const fieldTypeEnum = z.enum([
    "SHORT_TEXT",
    "LONG_TEXT",
    "EMAIL",
    "NUMBER",
    "YES_NO",
    "PASSWORD",
    "SELECT",
    "MULTI_SELECT",
    "CHECKBOX",
    "RATING",
    "DATE",
    "DROPDOWN",
]);

export const fieldOptionModel = z.object({
    label: z.string(),
    value: z.string(),
});

export const fieldValidationsModel = z.object({
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
    pattern: z.string().optional(),
    minSelections: z.number().optional(),
    maxSelections: z.number().optional(),
    maxRating: z.number().optional(),
});

export const createFieldInputModel = z.object({
    label: z.string().max(200).describe("Display label for the field"),
    type: fieldTypeEnum.describe("Type of the field"),
    formId: z.uuid().describe("UUID of the form this field belongs to"),
    description: z.string().max(1000).optional().describe("Helper text shown below the field"),
    placeholder: z.string().optional().describe("Placeholder text for the field"),
    isRequired: z.boolean().optional().default(false).describe("Whether the field is required"),
    options: z.array(fieldOptionModel).optional().describe("Options for SELECT/MULTI_SELECT fields"),
    validations: fieldValidationsModel.optional().describe("Validation rules for the field"),
});

export const createFieldOutputModel = z.object({
    id: z.string().describe("ID of the created field"),
    labelKey: z.string().describe("Immutable slug key for the field label"),
    index: z.string().describe("Index string for ordering"),
});

export const updateFieldInputModel = z.object({
    fieldId: z.uuid().describe("UUID of the field to update"),
    label: z.string().max(200).optional(),
    type: fieldTypeEnum.optional(),
    description: z.string().max(1000).optional(),
    placeholder: z.string().optional(),
    isRequired: z.boolean().optional(),
    options: z.array(fieldOptionModel).optional(),
    validations: fieldValidationsModel.optional(),
});

export const updateFieldOutputModel = z.object({ id: z.string() });

export const deleteFieldInputModel = z.object({
    fieldId: z.uuid().describe("UUID of the field to delete"),
});
export const deleteFieldOutputModel = z.object({ id: z.string() });

export const reorderFieldsInputModel = z.object({
    formId: z.uuid().describe("UUID of the form"),
    fieldIds: z.array(z.uuid()).describe("Field IDs in the new desired order"),
});
export const reorderFieldsOutputModel = z.object({ formId: z.string() });

export const getFieldsInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to fetch the fields for"),
});

export const fieldOutputModel = z.object({
    id: z.string(),
    formId: z.uuid().nullable(),
    label: z.string(),
    labelKey: z.string(),
    description: z.string().nullable(),
    placeholder: z.string().nullable(),
    isRequired: z.boolean(),
    index: z.string(),
    type: fieldTypeEnum,
    options: z.array(fieldOptionModel).nullable(),
    validations: fieldValidationsModel.nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export const getFieldsOutputModel = z.array(fieldOutputModel);

export type CreateFieldInputModel = z.infer<typeof createFieldInputModel>;
export type CreateFieldOutputModel = z.infer<typeof createFieldOutputModel>;
export type GetFieldsInputModel = z.infer<typeof getFieldsInputModel>;
export type GetFieldsOutputModel = z.infer<typeof getFieldsOutputModel>;
