import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { themeService } from "../../services";
import { listThemesInputModel, listThemesOutputModel } from "./model";

const TAGS = ["Theme"];
const getPath = generatePath("/theme");

export const themeRouter = router({
    listThemes: publicProcedure
        .meta({ openapi: { method: "GET", path: getPath("/listThemes"), tags: TAGS } })
        .input(listThemesInputModel)
        .output(listThemesOutputModel)
        .query(async () => {
            const themes = await themeService.listThemes();
            return themes.map((t) => ({
                ...t,
                description: t.description ?? null,
                emoji: t.emoji ?? null,
            }));
        }),
});
