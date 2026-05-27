import { z } from "zod";

export const listThemesInputModel = z.undefined();
export const listThemesOutputModel = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        label: z.string(),
        description: z.string().nullable(),
        category: z.string(),
        emoji: z.string().nullable(),
        colors: z.object({
            primary: z.string(),
            background: z.string(),
            surface: z.string(),
            text: z.string(),
            textMuted: z.string(),
            accent: z.string(),
            border: z.string(),
        }),
    }),
);
