CREATE TYPE "public"."form_status_enum" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."form_visibility_enum" AS ENUM('public', 'unlisted');--> statement-breakpoint
CREATE TABLE "form_themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"label" varchar(100) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"colors" json NOT NULL,
	"emoji" varchar(10),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "form_themes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "form_fields" DROP CONSTRAINT "form_fields_form_id_forms_id_fk";
--> statement-breakpoint
ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_form_id_forms_id_fk";
--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."field_type_enum";--> statement-breakpoint
CREATE TYPE "public"."field_type_enum" AS ENUM('SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'NUMBER', 'YES_NO', 'PASSWORD', 'SELECT', 'MULTI_SELECT', 'CHECKBOX', 'RATING', 'DATE', 'DROPDOWN');--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "type" SET DATA TYPE "public"."field_type_enum" USING "type"::"public"."field_type_enum";--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "title" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "description" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "label" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "label_key" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "status" "form_status_enum" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "visibility" "form_visibility_enum" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "slug" varchar(100);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "theme" varchar(50) DEFAULT 'forest';--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "cover_color" varchar(20);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "submit_message" text;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "is_password_protected" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "max_responses" integer;--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "options" json;--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "validations" json;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "respondent_email" varchar(255);--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "ip_address" varchar(45);--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_slug_unique" UNIQUE("slug");