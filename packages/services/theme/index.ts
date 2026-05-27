import { db } from "@repo/database";
import { formThemesTable } from "@repo/database/models/form-theme";

export default class ThemeService {
    public async listThemes() {
        const themes = await db.select().from(formThemesTable);
        return themes;
    }
}
