import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "jobs_blocks_important_dates_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"event" varchar,
  	"date" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "jobs_blocks_important_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_application_fee_fees" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"amount" varchar
  );
  
  CREATE TABLE "jobs_blocks_application_fee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"payment_mode" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_vacancy_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Vacancy Details',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_educational_qualification" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Educational Qualification',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_age_limit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Age Limit',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_selection_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Selection Process',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_exam_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Exam Details',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_physical_standards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Physical Standards',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_medical_standards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Medical Standards',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_salary_pay_scale" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Salary / Pay Scale',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Experience',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_documents_required" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Documents Required',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_how_to_apply" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'How to Apply',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_how_to_fill_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'How to Fill Form',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_important_instructions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Important Instructions',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_important_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "jobs_blocks_important_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "jobs_blocks_custom_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_important_dates_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"event" varchar,
  	"date" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_important_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_application_fee_fees" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"amount" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_application_fee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"payment_mode" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_vacancy_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Vacancy Details',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_educational_qualification" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Educational Qualification',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_age_limit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Age Limit',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_selection_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Selection Process',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_exam_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Exam Details',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_physical_standards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Physical Standards',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_medical_standards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Medical Standards',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_salary_pay_scale" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Salary / Pay Scale',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Experience',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_documents_required" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Documents Required',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_how_to_apply" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'How to Apply',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_how_to_fill_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'How to Fill Form',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_important_instructions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Important Instructions',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_important_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_important_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_jobs_v_blocks_custom_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "jobs_blocks_important_dates_dates" ADD CONSTRAINT "jobs_blocks_important_dates_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_important_dates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_important_dates" ADD CONSTRAINT "jobs_blocks_important_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_application_fee_fees" ADD CONSTRAINT "jobs_blocks_application_fee_fees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_application_fee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_application_fee" ADD CONSTRAINT "jobs_blocks_application_fee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_vacancy_table" ADD CONSTRAINT "jobs_blocks_vacancy_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_educational_qualification" ADD CONSTRAINT "jobs_blocks_educational_qualification_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_age_limit" ADD CONSTRAINT "jobs_blocks_age_limit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_selection_process" ADD CONSTRAINT "jobs_blocks_selection_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_exam_details" ADD CONSTRAINT "jobs_blocks_exam_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_physical_standards" ADD CONSTRAINT "jobs_blocks_physical_standards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_medical_standards" ADD CONSTRAINT "jobs_blocks_medical_standards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_salary_pay_scale" ADD CONSTRAINT "jobs_blocks_salary_pay_scale_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_experience" ADD CONSTRAINT "jobs_blocks_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_documents_required" ADD CONSTRAINT "jobs_blocks_documents_required_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_how_to_apply" ADD CONSTRAINT "jobs_blocks_how_to_apply_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_how_to_fill_form" ADD CONSTRAINT "jobs_blocks_how_to_fill_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_important_instructions" ADD CONSTRAINT "jobs_blocks_important_instructions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_important_links_links" ADD CONSTRAINT "jobs_blocks_important_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_important_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_important_links" ADD CONSTRAINT "jobs_blocks_important_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_custom_section" ADD CONSTRAINT "jobs_blocks_custom_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_important_dates_dates" ADD CONSTRAINT "_jobs_v_blocks_important_dates_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v_blocks_important_dates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_important_dates" ADD CONSTRAINT "_jobs_v_blocks_important_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_application_fee_fees" ADD CONSTRAINT "_jobs_v_blocks_application_fee_fees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v_blocks_application_fee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_application_fee" ADD CONSTRAINT "_jobs_v_blocks_application_fee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_vacancy_table" ADD CONSTRAINT "_jobs_v_blocks_vacancy_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_educational_qualification" ADD CONSTRAINT "_jobs_v_blocks_educational_qualification_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_age_limit" ADD CONSTRAINT "_jobs_v_blocks_age_limit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_selection_process" ADD CONSTRAINT "_jobs_v_blocks_selection_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_exam_details" ADD CONSTRAINT "_jobs_v_blocks_exam_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_physical_standards" ADD CONSTRAINT "_jobs_v_blocks_physical_standards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_medical_standards" ADD CONSTRAINT "_jobs_v_blocks_medical_standards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_salary_pay_scale" ADD CONSTRAINT "_jobs_v_blocks_salary_pay_scale_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_experience" ADD CONSTRAINT "_jobs_v_blocks_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_documents_required" ADD CONSTRAINT "_jobs_v_blocks_documents_required_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_how_to_apply" ADD CONSTRAINT "_jobs_v_blocks_how_to_apply_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_how_to_fill_form" ADD CONSTRAINT "_jobs_v_blocks_how_to_fill_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_important_instructions" ADD CONSTRAINT "_jobs_v_blocks_important_instructions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_important_links_links" ADD CONSTRAINT "_jobs_v_blocks_important_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v_blocks_important_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_important_links" ADD CONSTRAINT "_jobs_v_blocks_important_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v_blocks_custom_section" ADD CONSTRAINT "_jobs_v_blocks_custom_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "jobs_blocks_important_dates_dates_order_idx" ON "jobs_blocks_important_dates_dates" USING btree ("_order");
  CREATE INDEX "jobs_blocks_important_dates_dates_parent_id_idx" ON "jobs_blocks_important_dates_dates" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_important_dates_order_idx" ON "jobs_blocks_important_dates" USING btree ("_order");
  CREATE INDEX "jobs_blocks_important_dates_parent_id_idx" ON "jobs_blocks_important_dates" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_important_dates_path_idx" ON "jobs_blocks_important_dates" USING btree ("_path");
  CREATE INDEX "jobs_blocks_application_fee_fees_order_idx" ON "jobs_blocks_application_fee_fees" USING btree ("_order");
  CREATE INDEX "jobs_blocks_application_fee_fees_parent_id_idx" ON "jobs_blocks_application_fee_fees" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_application_fee_order_idx" ON "jobs_blocks_application_fee" USING btree ("_order");
  CREATE INDEX "jobs_blocks_application_fee_parent_id_idx" ON "jobs_blocks_application_fee" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_application_fee_path_idx" ON "jobs_blocks_application_fee" USING btree ("_path");
  CREATE INDEX "jobs_blocks_vacancy_table_order_idx" ON "jobs_blocks_vacancy_table" USING btree ("_order");
  CREATE INDEX "jobs_blocks_vacancy_table_parent_id_idx" ON "jobs_blocks_vacancy_table" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_vacancy_table_path_idx" ON "jobs_blocks_vacancy_table" USING btree ("_path");
  CREATE INDEX "jobs_blocks_educational_qualification_order_idx" ON "jobs_blocks_educational_qualification" USING btree ("_order");
  CREATE INDEX "jobs_blocks_educational_qualification_parent_id_idx" ON "jobs_blocks_educational_qualification" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_educational_qualification_path_idx" ON "jobs_blocks_educational_qualification" USING btree ("_path");
  CREATE INDEX "jobs_blocks_age_limit_order_idx" ON "jobs_blocks_age_limit" USING btree ("_order");
  CREATE INDEX "jobs_blocks_age_limit_parent_id_idx" ON "jobs_blocks_age_limit" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_age_limit_path_idx" ON "jobs_blocks_age_limit" USING btree ("_path");
  CREATE INDEX "jobs_blocks_selection_process_order_idx" ON "jobs_blocks_selection_process" USING btree ("_order");
  CREATE INDEX "jobs_blocks_selection_process_parent_id_idx" ON "jobs_blocks_selection_process" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_selection_process_path_idx" ON "jobs_blocks_selection_process" USING btree ("_path");
  CREATE INDEX "jobs_blocks_exam_details_order_idx" ON "jobs_blocks_exam_details" USING btree ("_order");
  CREATE INDEX "jobs_blocks_exam_details_parent_id_idx" ON "jobs_blocks_exam_details" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_exam_details_path_idx" ON "jobs_blocks_exam_details" USING btree ("_path");
  CREATE INDEX "jobs_blocks_physical_standards_order_idx" ON "jobs_blocks_physical_standards" USING btree ("_order");
  CREATE INDEX "jobs_blocks_physical_standards_parent_id_idx" ON "jobs_blocks_physical_standards" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_physical_standards_path_idx" ON "jobs_blocks_physical_standards" USING btree ("_path");
  CREATE INDEX "jobs_blocks_medical_standards_order_idx" ON "jobs_blocks_medical_standards" USING btree ("_order");
  CREATE INDEX "jobs_blocks_medical_standards_parent_id_idx" ON "jobs_blocks_medical_standards" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_medical_standards_path_idx" ON "jobs_blocks_medical_standards" USING btree ("_path");
  CREATE INDEX "jobs_blocks_salary_pay_scale_order_idx" ON "jobs_blocks_salary_pay_scale" USING btree ("_order");
  CREATE INDEX "jobs_blocks_salary_pay_scale_parent_id_idx" ON "jobs_blocks_salary_pay_scale" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_salary_pay_scale_path_idx" ON "jobs_blocks_salary_pay_scale" USING btree ("_path");
  CREATE INDEX "jobs_blocks_experience_order_idx" ON "jobs_blocks_experience" USING btree ("_order");
  CREATE INDEX "jobs_blocks_experience_parent_id_idx" ON "jobs_blocks_experience" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_experience_path_idx" ON "jobs_blocks_experience" USING btree ("_path");
  CREATE INDEX "jobs_blocks_documents_required_order_idx" ON "jobs_blocks_documents_required" USING btree ("_order");
  CREATE INDEX "jobs_blocks_documents_required_parent_id_idx" ON "jobs_blocks_documents_required" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_documents_required_path_idx" ON "jobs_blocks_documents_required" USING btree ("_path");
  CREATE INDEX "jobs_blocks_how_to_apply_order_idx" ON "jobs_blocks_how_to_apply" USING btree ("_order");
  CREATE INDEX "jobs_blocks_how_to_apply_parent_id_idx" ON "jobs_blocks_how_to_apply" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_how_to_apply_path_idx" ON "jobs_blocks_how_to_apply" USING btree ("_path");
  CREATE INDEX "jobs_blocks_how_to_fill_form_order_idx" ON "jobs_blocks_how_to_fill_form" USING btree ("_order");
  CREATE INDEX "jobs_blocks_how_to_fill_form_parent_id_idx" ON "jobs_blocks_how_to_fill_form" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_how_to_fill_form_path_idx" ON "jobs_blocks_how_to_fill_form" USING btree ("_path");
  CREATE INDEX "jobs_blocks_important_instructions_order_idx" ON "jobs_blocks_important_instructions" USING btree ("_order");
  CREATE INDEX "jobs_blocks_important_instructions_parent_id_idx" ON "jobs_blocks_important_instructions" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_important_instructions_path_idx" ON "jobs_blocks_important_instructions" USING btree ("_path");
  CREATE INDEX "jobs_blocks_important_links_links_order_idx" ON "jobs_blocks_important_links_links" USING btree ("_order");
  CREATE INDEX "jobs_blocks_important_links_links_parent_id_idx" ON "jobs_blocks_important_links_links" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_important_links_order_idx" ON "jobs_blocks_important_links" USING btree ("_order");
  CREATE INDEX "jobs_blocks_important_links_parent_id_idx" ON "jobs_blocks_important_links" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_important_links_path_idx" ON "jobs_blocks_important_links" USING btree ("_path");
  CREATE INDEX "jobs_blocks_custom_section_order_idx" ON "jobs_blocks_custom_section" USING btree ("_order");
  CREATE INDEX "jobs_blocks_custom_section_parent_id_idx" ON "jobs_blocks_custom_section" USING btree ("_parent_id");
  CREATE INDEX "jobs_blocks_custom_section_path_idx" ON "jobs_blocks_custom_section" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_important_dates_dates_order_idx" ON "_jobs_v_blocks_important_dates_dates" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_important_dates_dates_parent_id_idx" ON "_jobs_v_blocks_important_dates_dates" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_important_dates_order_idx" ON "_jobs_v_blocks_important_dates" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_important_dates_parent_id_idx" ON "_jobs_v_blocks_important_dates" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_important_dates_path_idx" ON "_jobs_v_blocks_important_dates" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_application_fee_fees_order_idx" ON "_jobs_v_blocks_application_fee_fees" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_application_fee_fees_parent_id_idx" ON "_jobs_v_blocks_application_fee_fees" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_application_fee_order_idx" ON "_jobs_v_blocks_application_fee" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_application_fee_parent_id_idx" ON "_jobs_v_blocks_application_fee" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_application_fee_path_idx" ON "_jobs_v_blocks_application_fee" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_vacancy_table_order_idx" ON "_jobs_v_blocks_vacancy_table" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_vacancy_table_parent_id_idx" ON "_jobs_v_blocks_vacancy_table" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_vacancy_table_path_idx" ON "_jobs_v_blocks_vacancy_table" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_educational_qualification_order_idx" ON "_jobs_v_blocks_educational_qualification" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_educational_qualification_parent_id_idx" ON "_jobs_v_blocks_educational_qualification" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_educational_qualification_path_idx" ON "_jobs_v_blocks_educational_qualification" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_age_limit_order_idx" ON "_jobs_v_blocks_age_limit" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_age_limit_parent_id_idx" ON "_jobs_v_blocks_age_limit" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_age_limit_path_idx" ON "_jobs_v_blocks_age_limit" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_selection_process_order_idx" ON "_jobs_v_blocks_selection_process" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_selection_process_parent_id_idx" ON "_jobs_v_blocks_selection_process" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_selection_process_path_idx" ON "_jobs_v_blocks_selection_process" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_exam_details_order_idx" ON "_jobs_v_blocks_exam_details" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_exam_details_parent_id_idx" ON "_jobs_v_blocks_exam_details" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_exam_details_path_idx" ON "_jobs_v_blocks_exam_details" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_physical_standards_order_idx" ON "_jobs_v_blocks_physical_standards" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_physical_standards_parent_id_idx" ON "_jobs_v_blocks_physical_standards" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_physical_standards_path_idx" ON "_jobs_v_blocks_physical_standards" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_medical_standards_order_idx" ON "_jobs_v_blocks_medical_standards" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_medical_standards_parent_id_idx" ON "_jobs_v_blocks_medical_standards" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_medical_standards_path_idx" ON "_jobs_v_blocks_medical_standards" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_salary_pay_scale_order_idx" ON "_jobs_v_blocks_salary_pay_scale" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_salary_pay_scale_parent_id_idx" ON "_jobs_v_blocks_salary_pay_scale" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_salary_pay_scale_path_idx" ON "_jobs_v_blocks_salary_pay_scale" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_experience_order_idx" ON "_jobs_v_blocks_experience" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_experience_parent_id_idx" ON "_jobs_v_blocks_experience" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_experience_path_idx" ON "_jobs_v_blocks_experience" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_documents_required_order_idx" ON "_jobs_v_blocks_documents_required" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_documents_required_parent_id_idx" ON "_jobs_v_blocks_documents_required" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_documents_required_path_idx" ON "_jobs_v_blocks_documents_required" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_how_to_apply_order_idx" ON "_jobs_v_blocks_how_to_apply" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_how_to_apply_parent_id_idx" ON "_jobs_v_blocks_how_to_apply" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_how_to_apply_path_idx" ON "_jobs_v_blocks_how_to_apply" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_how_to_fill_form_order_idx" ON "_jobs_v_blocks_how_to_fill_form" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_how_to_fill_form_parent_id_idx" ON "_jobs_v_blocks_how_to_fill_form" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_how_to_fill_form_path_idx" ON "_jobs_v_blocks_how_to_fill_form" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_important_instructions_order_idx" ON "_jobs_v_blocks_important_instructions" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_important_instructions_parent_id_idx" ON "_jobs_v_blocks_important_instructions" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_important_instructions_path_idx" ON "_jobs_v_blocks_important_instructions" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_important_links_links_order_idx" ON "_jobs_v_blocks_important_links_links" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_important_links_links_parent_id_idx" ON "_jobs_v_blocks_important_links_links" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_important_links_order_idx" ON "_jobs_v_blocks_important_links" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_important_links_parent_id_idx" ON "_jobs_v_blocks_important_links" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_important_links_path_idx" ON "_jobs_v_blocks_important_links" USING btree ("_path");
  CREATE INDEX "_jobs_v_blocks_custom_section_order_idx" ON "_jobs_v_blocks_custom_section" USING btree ("_order");
  CREATE INDEX "_jobs_v_blocks_custom_section_parent_id_idx" ON "_jobs_v_blocks_custom_section" USING btree ("_parent_id");
  CREATE INDEX "_jobs_v_blocks_custom_section_path_idx" ON "_jobs_v_blocks_custom_section" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "jobs_blocks_important_dates_dates" CASCADE;
  DROP TABLE "jobs_blocks_important_dates" CASCADE;
  DROP TABLE "jobs_blocks_application_fee_fees" CASCADE;
  DROP TABLE "jobs_blocks_application_fee" CASCADE;
  DROP TABLE "jobs_blocks_vacancy_table" CASCADE;
  DROP TABLE "jobs_blocks_educational_qualification" CASCADE;
  DROP TABLE "jobs_blocks_age_limit" CASCADE;
  DROP TABLE "jobs_blocks_selection_process" CASCADE;
  DROP TABLE "jobs_blocks_exam_details" CASCADE;
  DROP TABLE "jobs_blocks_physical_standards" CASCADE;
  DROP TABLE "jobs_blocks_medical_standards" CASCADE;
  DROP TABLE "jobs_blocks_salary_pay_scale" CASCADE;
  DROP TABLE "jobs_blocks_experience" CASCADE;
  DROP TABLE "jobs_blocks_documents_required" CASCADE;
  DROP TABLE "jobs_blocks_how_to_apply" CASCADE;
  DROP TABLE "jobs_blocks_how_to_fill_form" CASCADE;
  DROP TABLE "jobs_blocks_important_instructions" CASCADE;
  DROP TABLE "jobs_blocks_important_links_links" CASCADE;
  DROP TABLE "jobs_blocks_important_links" CASCADE;
  DROP TABLE "jobs_blocks_custom_section" CASCADE;
  DROP TABLE "_jobs_v_blocks_important_dates_dates" CASCADE;
  DROP TABLE "_jobs_v_blocks_important_dates" CASCADE;
  DROP TABLE "_jobs_v_blocks_application_fee_fees" CASCADE;
  DROP TABLE "_jobs_v_blocks_application_fee" CASCADE;
  DROP TABLE "_jobs_v_blocks_vacancy_table" CASCADE;
  DROP TABLE "_jobs_v_blocks_educational_qualification" CASCADE;
  DROP TABLE "_jobs_v_blocks_age_limit" CASCADE;
  DROP TABLE "_jobs_v_blocks_selection_process" CASCADE;
  DROP TABLE "_jobs_v_blocks_exam_details" CASCADE;
  DROP TABLE "_jobs_v_blocks_physical_standards" CASCADE;
  DROP TABLE "_jobs_v_blocks_medical_standards" CASCADE;
  DROP TABLE "_jobs_v_blocks_salary_pay_scale" CASCADE;
  DROP TABLE "_jobs_v_blocks_experience" CASCADE;
  DROP TABLE "_jobs_v_blocks_documents_required" CASCADE;
  DROP TABLE "_jobs_v_blocks_how_to_apply" CASCADE;
  DROP TABLE "_jobs_v_blocks_how_to_fill_form" CASCADE;
  DROP TABLE "_jobs_v_blocks_important_instructions" CASCADE;
  DROP TABLE "_jobs_v_blocks_important_links_links" CASCADE;
  DROP TABLE "_jobs_v_blocks_important_links" CASCADE;
  DROP TABLE "_jobs_v_blocks_custom_section" CASCADE;`)
}
