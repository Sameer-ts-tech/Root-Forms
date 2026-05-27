import { trpc } from "~/trpc/client";

export const useCreateField = () => {
    const utils = trpc.useUtils();
    const { mutateAsync, mutate, isPending, error, isSuccess } = trpc.formField.createField.useMutation({
        onSuccess: async () => {
            await utils.formField.invalidate();
            await utils.form.invalidate();
        },
    });
    return { createFieldAsync: mutateAsync, createField: mutate, isPending, error, isSuccess };
};

export const useUpdateField = () => {
    const utils = trpc.useUtils();
    const { mutateAsync, isPending, error } = trpc.formField.updateField.useMutation({
        onSuccess: async () => {
            await utils.formField.invalidate();
            await utils.form.invalidate();
        },
    });
    return { updateFieldAsync: mutateAsync, isPending, error };
};

export const useDeleteField = () => {
    const utils = trpc.useUtils();
    const { mutateAsync, isPending, error } = trpc.formField.deleteField.useMutation({
        onSuccess: async () => {
            await utils.formField.invalidate();
            await utils.form.invalidate();
        },
    });
    return { deleteFieldAsync: mutateAsync, isPending, error };
};

export const useReorderFields = () => {
    const utils = trpc.useUtils();
    const { mutateAsync, isPending } = trpc.formField.reorderFields.useMutation({
        onSuccess: async () => {
            await utils.formField.invalidate();
            await utils.form.invalidate();
        },
    });
    return { reorderFieldsAsync: mutateAsync, isPending };
};

export const useGetFields = (formId: string) => {
    const { data: fields, isLoading, error } = trpc.formField.getFields.useQuery({ formId });
    return { fields, isLoading, error };
};
