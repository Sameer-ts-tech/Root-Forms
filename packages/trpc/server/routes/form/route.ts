import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";

import {
    createFormInputModel,
    createFormOutputModel,
    listFormsInputModel,
    listFormsOutputModel,
    getFormInputModel,
    getFormOutputModel,
    updateFormInputModel,
    updateFormOutputModel,
    publishFormInputModel,
    publishFormOutputModel,
    unpublishFormInputModel,
    unpublishFormOutputModel,
    archiveFormInputModel,
    archiveFormOutputModel,
    deleteFormInputModel,
    deleteFormOutputModel,
    cloneFormInputModel,
    cloneFormOutputModel,
    getPublicFormsInputModel,
    getPublicFormsOutputModel,
    getFormBySlugInputModel,
    getFormBySlugOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
    createForm: authenticatedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/createForm"), tags: TAGS, protect: true } })
        .input(createFormInputModel)
        .output(createFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { title, description } = input;
            return formService.createForm({ title, description, createdBy: ctx.user.id });
        }),

    updateForm: authenticatedProcedure
        .meta({ openapi: { method: "PATCH", path: getPath("/updateForm"), tags: TAGS, protect: true } })
        .input(updateFormInputModel)
        .output(updateFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { formId, ...payload } = input;
            return formService.updateForm(formId, ctx.user.id, payload as any);
        }),

    publishForm: authenticatedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/publishForm"), tags: TAGS, protect: true } })
        .input(publishFormInputModel)
        .output(publishFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            return formService.publishForm(input.formId, ctx.user.id);
        }),

    unpublishForm: authenticatedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/unpublishForm"), tags: TAGS, protect: true } })
        .input(unpublishFormInputModel)
        .output(unpublishFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            return formService.unpublishForm(input.formId, ctx.user.id);
        }),

    archiveForm: authenticatedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/archiveForm"), tags: TAGS, protect: true } })
        .input(archiveFormInputModel)
        .output(archiveFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            return formService.archiveForm(input.formId, ctx.user.id);
        }),

    deleteForm: authenticatedProcedure
        .meta({ openapi: { method: "DELETE", path: getPath("/deleteForm"), tags: TAGS, protect: true } })
        .input(deleteFormInputModel)
        .output(deleteFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            return formService.deleteForm(input.formId, ctx.user.id);
        }),

    cloneForm: authenticatedProcedure
        .meta({ openapi: { method: "POST", path: getPath("/cloneForm"), tags: TAGS, protect: true } })
        .input(cloneFormInputModel)
        .output(cloneFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            return formService.cloneForm(input.formId, ctx.user.id);
        }),

    listForms: authenticatedProcedure
        .meta({ openapi: { method: "GET", path: getPath("/listForms"), tags: TAGS, protect: true } })
        .input(listFormsInputModel)
        .output(listFormsOutputModel)
        .query(async ({ ctx }) => {
            const forms = await formService.listFormsByUserId({ userId: ctx.user.id });
            return forms as any;
        }),

    getPublicForms: publicProcedure
        .meta({ openapi: { method: "GET", path: getPath("/getPublicForms"), tags: TAGS } })
        .input(getPublicFormsInputModel)
        .output(getPublicFormsOutputModel)
        .query(async () => {
            return formService.getPublicForms() as any;
        }),

    getFormBySlug: publicProcedure
        .meta({ openapi: { method: "GET", path: getPath("/getFormBySlug"), tags: TAGS } })
        .input(getFormBySlugInputModel)
        .output(getFormBySlugOutputModel)
        .query(async ({ input }) => {
            return formService.getFormBySlug(input.slug) as any;
        }),

    getFormWithFields: publicProcedure
        .meta({ openapi: { method: "GET", path: getPath("/getForm"), tags: TAGS } })
        .input(getFormInputModel)
        .output(getFormOutputModel)
        .query(async ({ input }) => {
            const { formId } = input;
            const form = await formService.getFormWithFields(formId);
            return form as any;
        }),
});
