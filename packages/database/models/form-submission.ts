import { pgTable, uuid, timestamp, json, varchar, text, inet } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export interface FormSubmissionValue {
    fieldId: string;
    value: string | string[] | number | boolean;
}

export type FormSubmissionValueRow = FormSubmissionValue[];

export const formSubmissionsTable = pgTable("form_submissions", {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id").references(() => formsTable.id, { onDelete: "cascade" }),

    values: json("values").$type<FormSubmissionValueRow>(),

    // respondent metadata
    respondentEmail: varchar("respondent_email", { length: 255 }),
    ipAddress: varchar("ip_address", { length: 45 }),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
