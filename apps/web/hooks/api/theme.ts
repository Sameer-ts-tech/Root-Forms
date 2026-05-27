import { trpc } from "~/trpc/client";

export const useListThemes = () => {
    const { data: themes, isLoading, error } = trpc.theme.listThemes.useQuery();
    return { themes, isLoading, error };
};
