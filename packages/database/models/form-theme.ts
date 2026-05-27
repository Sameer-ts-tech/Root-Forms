import { pgTable, uuid, timestamp, varchar, text, json } from "drizzle-orm/pg-core";

export interface ThemeColors {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    accent: string;
    border: string;
}

export const formThemesTable = pgTable("form_themes", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 50 }).notNull().unique(),
    label: varchar("label", { length: 100 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 50 }).notNull(), // nature, minimal, vibrant

    colors: json("colors").$type<ThemeColors>().notNull(),
    emoji: varchar("emoji", { length: 10 }),

    createdAt: timestamp("created_at").defaultNow(),
});
