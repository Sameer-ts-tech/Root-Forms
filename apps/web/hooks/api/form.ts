import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    };
};

export const useUpdateForm = () => {
    const utils = trpc.useUtils();
    const { mutateAsync, mutate, isPending, error, isSuccess } = trpc.form.updateForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });
    return { updateFormAsync: mutateAsync, updateForm: mutate, isPending, error, isSuccess };
};

export const usePublishForm = () => {
    const utils = trpc.useUtils();
    const { mutateAsync, isPending, error } = trpc.form.publishForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });
    return { publishFormAsync: mutateAsync, isPending, error };
};

export const useUnpublishForm = () => {
    const utils = trpc.useUtils();
    const { mutateAsync, isPending, error } = trpc.form.unpublishForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });
    return { unpublishFormAsync: mutateAsync, isPending, error };
};

export const useArchiveForm = () => {
    const utils = trpc.useUtils();
    const { mutateAsync, isPending, error } = trpc.form.archiveForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });
    return { archiveFormAsync: mutateAsync, isPending, error };
};

export const useDeleteForm = () => {
    const utils = trpc.useUtils();
    const { mutateAsync, isPending, error } = trpc.form.deleteForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });
    return { deleteFormAsync: mutateAsync, isPending, error };
};

export const useCloneForm = () => {
    const utils = trpc.useUtils();
    const { mutateAsync, isPending, error } = trpc.form.cloneForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });
    return { cloneFormAsync: mutateAsync, isPending, error };
};

export const useListForms = () => {
    const {
        data: forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpc.form.listForms.useQuery();

    return {
        forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useGetPublicForms = () => {
    const {
        data: forms,
        isLoading,
        error,
    } = trpc.form.getPublicForms.useQuery();
    return { forms, isLoading, error };
};

export const useGetFormWithFields = (formId: string) => {
    const {
        data: form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpc.form.getFormWithFields.useQuery({ formId });

    return {
        form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};
