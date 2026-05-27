import {
    pgTable,
    uuid,
    timestamp,
    varchar,
    pgEnum,
    text,
    boolean,
    numeric,
    json,
    integer,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type_enum", [
    "SHORT_TEXT",
    "LONG_TEXT",
    "EMAIL",
    "NUMBER",
    "YES_NO",
    "PASSWORD",
    "SELECT",
    "MULTI_SELECT",
    "CHECKBOX",
    "RATING",
    "DATE",
    "DROPDOWN",
]);

export interface FieldOption {
    label: string;
    value: string;
}

export interface FieldValidations {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    minSelections?: number;
    maxSelections?: number;
    maxRating?: number;
}

export const formFieldsTable = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").references(() => formsTable.id, { onDelete: "cascade" }),

    label: varchar("label", { length: 200 }).notNull(),
    labelKey: varchar("label_key", { length: 200 }).notNull(),

    description: text("description"),
    placeholder: text("placeholder"),
    isRequired: boolean("is_required").default(false).notNull(),

    index: numeric("index").notNull(),
    type: fieldTypeEnum("type").notNull(),

    // For SELECT, MULTI_SELECT, DROPDOWN, CHECKBOX
    options: json("options").$type<FieldOption[]>(),

    // Validation rules
    validations: json("validations").$type<FieldValidations>(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
