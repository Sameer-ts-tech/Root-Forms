import { trpc } from "~/trpc/client";

export const useCreateSubmission = () => {
    const { mutateAsync, isPending, error, isSuccess } = trpc.formSubmission.createSubmission.useMutation();
    return { createSubmissionAsync: mutateAsync, isPending, error, isSuccess };
};

export const useGetSubmissions = (formId: string, page = 1) => {
    const { data, isLoading, error } = trpc.formSubmission.getSubmissionsByFormId.useQuery(
        { formId, page, pageSize: 50 },
        { enabled: !!formId }
    );
    return {
        submissions: data?.submissions ?? [],
        total: data?.total ?? 0,
        isLoading,
        error,
    };
};

export const useGetAnalytics = (formId: string) => {
    const { data: analytics, isLoading, error } = trpc.formSubmission.getAnalytics.useQuery(
        { formId },
        { enabled: !!formId }
    );
    return { analytics, isLoading, error };
};

