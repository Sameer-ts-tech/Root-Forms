import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formSubmissionService } from "../../services";

import {
    createSubmissionInputModel,
    createSubmissionOutputModel,
    getSubmissionsByFormIdInputModel,
    getSubmissionsByFormIdOutputModel,
    getAnalyticsInputModel,
    getAnalyticsOutputModel,
    exportCsvInputModel,
    exportCsvOutputModel,
} from "./model";

const TAGS = ["FormSubmission"];
const getPath = generatePath("/form-submission");

export const formSubmissionRouter = router({
    createSubmission: publicProcedure
        .meta({ openapi: { method: "POST", path: getPath("/createSubmission"), tags: TAGS } })
        .input(createSubmissionInputModel)
        .output(createSubmissionOutputModel)
        .mutation(async ({ input, ctx }) => {
            const ipAddress = (ctx as any).req?.ip ?? undefined;
            const result = await formSubmissionService.createSubmission({
                ...input,
                values: input.values as any,
                ipAddress,
            });
            return result;
        }),

    getSubmissionsByFormId: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getSubmissionsByFormId"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getSubmissionsByFormIdInputModel)
        .output(getSubmissionsByFormIdOutputModel)
        .query(async ({ input }) => {
            const { formId, page, pageSize } = input;
            const result = await formSubmissionService.getSubmissionsByFormId(formId, page, pageSize);
            return result as any;
        }),

    getAnalytics: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getAnalytics"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getAnalyticsInputModel)
        .output(getAnalyticsOutputModel)
        .query(async ({ input }) => {
            return formSubmissionService.getAnalytics(input.formId);
        }),

    exportCsv: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/exportCsv"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(exportCsvInputModel)
        .output(exportCsvOutputModel)
        .query(async ({ input }) => {
            const csv = await formSubmissionService.exportCsv(input.formId);
            return { csv };
        }),
});

export default formSubmissionRouter;
