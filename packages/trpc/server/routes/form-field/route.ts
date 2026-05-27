import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formFieldService } from "../../services";

import {
    createFieldInputModel,
    createFieldOutputModel,
    getFieldsInputModel,
    getFieldsOutputModel,
    updateFieldInputModel,
    updateFieldOutputModel,
    deleteFieldInputModel,
    deleteFieldOutputModel,
    reorderFieldsInputModel,
    reorderFieldsOutputModel,
} from "./model";

const TAGS = ["FormField"];
const getPath = generatePath("/form-field");

export const formFieldRouter = router({
    createField: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(createFieldInputModel)
        .output(createFieldOutputModel)
        .mutation(async ({ input }) => {
            const { label, type, formId, description, placeholder, isRequired, options, validations } = input;

            const result = await formFieldService.createField({
                label,
                type,
                formId,
                description,
                placeholder,
                isRequired,
                options: options as any,
                validations: validations as any,
            });

            return result;
        }),

    updateField: authenticatedProcedure
        .meta({
            openapi: {
                method: "PATCH",
                path: getPath("/updateField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(updateFieldInputModel)
        .output(updateFieldOutputModel)
        .mutation(async ({ input }) => {
            const { fieldId, ...payload } = input;
            return formFieldService.updateField(fieldId, payload as any);
        }),

    deleteField: authenticatedProcedure
        .meta({
            openapi: {
                method: "DELETE",
                path: getPath("/deleteField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(deleteFieldInputModel)
        .output(deleteFieldOutputModel)
        .mutation(async ({ input }) => {
            return formFieldService.deleteField(input.fieldId);
        }),

    reorderFields: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/reorderFields"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(reorderFieldsInputModel)
        .output(reorderFieldsOutputModel)
        .mutation(async ({ input }) => {
            return formFieldService.reorderFields(input.formId, input.fieldIds);
        }),

    getFields: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getFields"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getFieldsInputModel)
        .output(getFieldsOutputModel)
        .query(async ({ input }) => {
            const { formId } = input;
            const result = await formFieldService.getFields(formId);
            return result as any;
        }),
});
