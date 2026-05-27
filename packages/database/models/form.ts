import {
    pgTable,
    uuid,
    timestamp,
    varchar,
    pgEnum,
    text,
    integer,
    boolean,
    unique,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formStatusEnum = pgEnum("form_status_enum", [
    "draft",
    "published",
    "archived",
]);

export const formVisibilityEnum = pgEnum("form_visibility_enum", [
    "public",
    "unlisted",
]);

export const formDisplayModeEnum = pgEnum("form_display_mode_enum", [
    "one_at_a_time",
    "all_at_once",
]);

export const formsTable = pgTable(
    "forms",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        title: varchar("title", { length: 100 }).notNull(),
        description: varchar("description", { length: 500 }),

        status: formStatusEnum("status").default("draft").notNull(),
        visibility: formVisibilityEnum("visibility").default("public").notNull(),

        slug: varchar("slug", { length: 100 }),

        theme: varchar("theme", { length: 50 }).default("forest"),
        coverColor: varchar("cover_color", { length: 20 }),
        submitMessage: text("submit_message"),
        displayMode: formDisplayModeEnum("display_mode").default("one_at_a_time").notNull(),

        // Password protection
        isPasswordProtected: boolean("is_password_protected").default(false),
        password: text("password"),

        // Limits
        expiresAt: timestamp("expires_at"),
        maxResponses: integer("max_responses"),

        createdBy: uuid("created_by").references(() => usersTable.id),

        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    },
    (t) => [unique("forms_slug_unique").on(t.slug)],
);
