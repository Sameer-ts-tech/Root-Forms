import { z } from "zod";

export const submissionValueModel = z.object({
    fieldId: z.uuid(),
    value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});

export const createSubmissionInputModel = z.object({
    formId: z.uuid(),
    values: z.array(submissionValueModel),
    respondentEmail: z.string().email().optional(),
});

export const createSubmissionOutputModel = z.object({
    id: z.string(),
    createdAt: z.string().nullable(),
});

export const getSubmissionsByFormIdInputModel = z.object({
    formId: z.uuid().describe("UUID of the form"),
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(50),
});

export const getSubmissionsByFormIdOutputModel = z.object({
    submissions: z.array(
        z.object({
            id: z.string(),
            formId: z.uuid().nullable(),
            values: z.array(submissionValueModel),
            respondentEmail: z.string().nullable(),
            createdAt: z.string().nullable(),
            updatedAt: z.string().nullable(),
        }),
    ),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
});

export const getAnalyticsInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to get analytics for"),
});

export const getAnalyticsOutputModel = z.object({
    formId: z.string(),
    total: z.number(),
    timeline: z.array(z.object({ date: z.string(), count: z.number() })),
    fieldAnalytics: z.array(
        z.object({
            fieldId: z.string(),
            totalResponses: z.number(),
            distribution: z.array(z.object({ value: z.string(), count: z.number() })),
        }),
    ),
});

export const exportCsvInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to export"),
});

export const exportCsvOutputModel = z.object({
    csv: z.string(),
});

export type CreateSubmissionInputModel = z.infer<typeof createSubmissionInputModel>;
export type CreateSubmissionOutputModel = z.infer<typeof createSubmissionOutputModel>;
