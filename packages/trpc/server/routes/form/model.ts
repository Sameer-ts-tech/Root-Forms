import { z } from "zod";
import { fieldOutputModel } from "../form-field/model";

export const createFormInputModel = z.object({
    title: z.string().max(100).describe("Title of the form"),
    description: z.string().max(500).optional().describe("Description of the form"),
});

export const createFormOutputModel = z.object({
    id: z.string().describe("ID of the created form"),
});

export const updateFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to update"),
    title: z.string().max(100).optional(),
    description: z.string().max(500).optional(),
    theme: z.string().optional(),
    visibility: z.enum(["public", "unlisted"]).optional(),
    submitMessage: z.string().max(500).optional(),
    slug: z.string().max(100).optional(),
    expiresAt: z.string().optional().nullable(),
    maxResponses: z.number().int().positive().optional().nullable(),
    displayMode: z.enum(["one_at_a_time", "all_at_once"]).optional(),
});

export const updateFormOutputModel = z.object({ id: z.string() });

export const publishFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to publish"),
});
export const publishFormOutputModel = z.object({ id: z.string(), status: z.string() });

export const unpublishFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to unpublish"),
});
export const unpublishFormOutputModel = z.object({ id: z.string(), status: z.string() });

export const archiveFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to archive"),
});
export const archiveFormOutputModel = z.object({ id: z.string(), status: z.string() });

export const deleteFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to delete"),
});
export const deleteFormOutputModel = z.object({ id: z.string() });

export const cloneFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to clone"),
});
export const cloneFormOutputModel = z.object({ id: z.string() });

export const listFormsInputModel = z.undefined();
export const listFormsOutputModel = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().nullable().optional(),
        status: z.enum(["draft", "published", "archived"]),
        visibility: z.enum(["public", "unlisted"]),
        theme: z.string().nullable().optional(),
        slug: z.string().nullable().optional(),
        submissionCount: z.number(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
    }),
);

export const getFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to fetch"),
});

export const formDetailOutputModel = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    status: z.enum(["draft", "published", "archived"]),
    visibility: z.enum(["public", "unlisted"]),
    theme: z.string().nullable(),
    submitMessage: z.string().nullable(),
    slug: z.string().nullable(),
    expiresAt: z.string().nullable(),
    maxResponses: z.number().nullable(),
    displayMode: z.enum(["one_at_a_time", "all_at_once"]).nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    fields: z.array(fieldOutputModel),
});

export const getFormOutputModel = formDetailOutputModel;

export const getPublicFormsInputModel = z.undefined();
export const getPublicFormsOutputModel = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().nullable().optional(),
        theme: z.string().nullable().optional(),
        slug: z.string().nullable().optional(),
        submissionCount: z.number(),
        createdAt: z.string().nullable(),
    }),
);

export const getFormBySlugInputModel = z.object({
    slug: z.string().describe("Custom slug of the form"),
});
export const getFormBySlugOutputModel = formDetailOutputModel;
