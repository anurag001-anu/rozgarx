import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "results" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"organization" varchar,
  	"exam_name" varchar,
  	"result_date" timestamp(3) with time zone,
  	"status" "enum_results_status" DEFAULT 'draft',
  	"description" jsonb,
  	"related_job_id" integer,
  	"official_url" varchar,
  	"is_verified" boolean DEFAULT false,
  	"verified_date" timestamp(3) with time zone,
  	"verification_status" "enum_results_verification_status" DEFAULT 'Draft',
  	"is_archived" boolean DEFAULT false,
  	"verified_by_id" integer,
  	"official_source_url" varchar,
  	"link_health" "enum_results_link_health" DEFAULT 'Healthy',
  	"last_checked_at" timestamp(3) with time zone,
  	"is_published" boolean DEFAULT true,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_results_status" DEFAULT 'draft'
  );
  CREATE TABLE "_results_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_organization" varchar,
  	"version_exam_name" varchar,
  	"version_result_date" timestamp(3) with time zone,
  	"version_status" "enum__results_v_version_status" DEFAULT 'draft',
  	"version_description" jsonb,
  	"version_related_job_id" integer,
  	"version_official_url" varchar,
  	"version_is_verified" boolean DEFAULT false,
  	"version_verified_date" timestamp(3) with time zone,
  	"version_verification_status" "enum__results_v_version_verification_status" DEFAULT 'Draft',
  	"version_is_archived" boolean DEFAULT false,
  	"version_verified_by_id" integer,
  	"version_official_source_url" varchar,
  	"version_link_health" "enum__results_v_version_link_health" DEFAULT 'Healthy',
  	"version_last_checked_at" timestamp(3) with time zone,
  	"version_is_published" boolean DEFAULT true,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__results_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  CREATE TABLE "admit_cards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"organization" varchar,
  	"exam_name" varchar,
  	"exam_date" timestamp(3) with time zone,
  	"admit_card_release_date" timestamp(3) with time zone,
  	"override_status" boolean DEFAULT false,
  	"status" "enum_admit_cards_status" DEFAULT 'draft',
  	"instructions" jsonb,
  	"related_job_id" integer,
  	"official_url" varchar,
  	"is_verified" boolean DEFAULT false,
  	"verified_date" timestamp(3) with time zone,
  	"verification_status" "enum_admit_cards_verification_status" DEFAULT 'Draft',
  	"is_archived" boolean DEFAULT false,
  	"verified_by_id" integer,
  	"official_source_url" varchar,
  	"link_health" "enum_admit_cards_link_health" DEFAULT 'Healthy',
  	"last_checked_at" timestamp(3) with time zone,
  	"is_published" boolean DEFAULT true,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_admit_cards_status" DEFAULT 'draft'
  );
  CREATE TABLE "_admit_cards_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_organization" varchar,
  	"version_exam_name" varchar,
  	"version_exam_date" timestamp(3) with time zone,
  	"version_admit_card_release_date" timestamp(3) with time zone,
  	"version_override_status" boolean DEFAULT false,
  	"version_status" "enum__admit_cards_v_version_status" DEFAULT 'draft',
  	"version_instructions" jsonb,
  	"version_related_job_id" integer,
  	"version_official_url" varchar,
  	"version_is_verified" boolean DEFAULT false,
  	"version_verified_date" timestamp(3) with time zone,
  	"version_verification_status" "enum__admit_cards_v_version_verification_status" DEFAULT 'Draft',
  	"version_is_archived" boolean DEFAULT false,
  	"version_verified_by_id" integer,
  	"version_official_source_url" varchar,
  	"version_link_health" "enum__admit_cards_v_version_link_health" DEFAULT 'Healthy',
  	"version_last_checked_at" timestamp(3) with time zone,
  	"version_is_published" boolean DEFAULT true,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__admit_cards_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  CREATE TABLE "answer_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"organization" varchar,
  	"exam_name" varchar,
  	"exam_date" timestamp(3) with time zone,
  	"answer_key_release_date" timestamp(3) with time zone,
  	"objection_start_date" timestamp(3) with time zone,
  	"objection_last_date" timestamp(3) with time zone,
  	"override_status" boolean DEFAULT false,
  	"status" "enum_answer_keys_status" DEFAULT 'draft',
  	"description" jsonb,
  	"related_job_id" integer,
  	"official_url" varchar,
  	"is_verified" boolean DEFAULT false,
  	"verified_date" timestamp(3) with time zone,
  	"verification_status" "enum_answer_keys_verification_status" DEFAULT 'Draft',
  	"is_archived" boolean DEFAULT false,
  	"verified_by_id" integer,
  	"official_source_url" varchar,
  	"link_health" "enum_answer_keys_link_health" DEFAULT 'Healthy',
  	"last_checked_at" timestamp(3) with time zone,
  	"is_published" boolean DEFAULT true,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_answer_keys_status" DEFAULT 'draft'
  );
  CREATE TABLE "_answer_keys_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_organization" varchar,
  	"version_exam_name" varchar,
  	"version_exam_date" timestamp(3) with time zone,
  	"version_answer_key_release_date" timestamp(3) with time zone,
  	"version_objection_start_date" timestamp(3) with time zone,
  	"version_objection_last_date" timestamp(3) with time zone,
  	"version_override_status" boolean DEFAULT false,
  	"version_status" "enum__answer_keys_v_version_status" DEFAULT 'draft',
  	"version_description" jsonb,
  	"version_related_job_id" integer,
  	"version_official_url" varchar,
  	"version_is_verified" boolean DEFAULT false,
  	"version_verified_date" timestamp(3) with time zone,
  	"version_verification_status" "enum__answer_keys_v_version_verification_status" DEFAULT 'Draft',
  	"version_is_archived" boolean DEFAULT false,
  	"version_verified_by_id" integer,
  	"version_official_source_url" varchar,
  	"version_link_health" "enum__answer_keys_v_version_link_health" DEFAULT 'Healthy',
  	"version_last_checked_at" timestamp(3) with time zone,
  	"version_is_published" boolean DEFAULT true,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__answer_keys_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  CREATE TABLE "syllabuses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"organization" varchar,
  	"subject" varchar,
  	"exam_level" varchar,
  	"qualification" varchar,
  	"content" jsonb,
  	"related_job_id" integer,
  	"official_url" varchar,
  	"is_verified" boolean DEFAULT false,
  	"verified_date" timestamp(3) with time zone,
  	"verification_status" "enum_syllabuses_verification_status" DEFAULT 'Draft',
  	"is_archived" boolean DEFAULT false,
  	"verified_by_id" integer,
  	"official_source_url" varchar,
  	"link_health" "enum_syllabuses_link_health" DEFAULT 'Healthy',
  	"last_checked_at" timestamp(3) with time zone,
  	"is_published" boolean DEFAULT true,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_syllabuses_status" DEFAULT 'draft'
  );
  CREATE TABLE "_syllabuses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_organization" varchar,
  	"version_subject" varchar,
  	"version_exam_level" varchar,
  	"version_qualification" varchar,
  	"version_content" jsonb,
  	"version_related_job_id" integer,
  	"version_official_url" varchar,
  	"version_is_verified" boolean DEFAULT false,
  	"version_verified_date" timestamp(3) with time zone,
  	"version_verification_status" "enum__syllabuses_v_version_verification_status" DEFAULT 'Draft',
  	"version_is_archived" boolean DEFAULT false,
  	"version_verified_by_id" integer,
  	"version_official_source_url" varchar,
  	"version_link_health" "enum__syllabuses_v_version_link_health" DEFAULT 'Healthy',
  	"version_last_checked_at" timestamp(3) with time zone,
  	"version_is_published" boolean DEFAULT true,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__syllabuses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  CREATE TABLE "govt_notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"organization" varchar,
  	"date" timestamp(3) with time zone,
  	"description" jsonb,
  	"related_job_id" integer,
  	"official_url" varchar,
  	"is_verified" boolean DEFAULT false,
  	"verified_date" timestamp(3) with time zone,
  	"verification_status" "enum_govt_notifications_verification_status" DEFAULT 'Draft',
  	"is_archived" boolean DEFAULT false,
  	"verified_by_id" integer,
  	"official_source_url" varchar,
  	"link_health" "enum_govt_notifications_link_health" DEFAULT 'Healthy',
  	"last_checked_at" timestamp(3) with time zone,
  	"is_published" boolean DEFAULT true,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_govt_notifications_status" DEFAULT 'draft'
  );
  CREATE TABLE "_govt_notifications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_organization" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_description" jsonb,
  	"version_related_job_id" integer,
  	"version_official_url" varchar,
  	"version_is_verified" boolean DEFAULT false,
  	"version_verified_date" timestamp(3) with time zone,
  	"version_verification_status" "enum__govt_notifications_v_version_verification_status" DEFAULT 'Draft',
  	"version_is_archived" boolean DEFAULT false,
  	"version_verified_by_id" integer,
  	"version_official_source_url" varchar,
  	"version_link_health" "enum__govt_notifications_v_version_link_health" DEFAULT 'Healthy',
  	"version_last_checked_at" timestamp(3) with time zone,
  	"version_is_published" boolean DEFAULT true,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__govt_notifications_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "results_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "admit_cards_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "answer_keys_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "syllabuses_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "govt_notifications_id" integer;
  ALTER TABLE "results" ADD CONSTRAINT "results_related_job_id_jobs_id_fk" FOREIGN KEY ("related_job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "results" ADD CONSTRAINT "results_verified_by_id_users_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_results_v" ADD CONSTRAINT "_results_v_parent_id_results_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."results"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_results_v" ADD CONSTRAINT "_results_v_version_related_job_id_jobs_id_fk" FOREIGN KEY ("version_related_job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_results_v" ADD CONSTRAINT "_results_v_version_verified_by_id_users_id_fk" FOREIGN KEY ("version_verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "admit_cards" ADD CONSTRAINT "admit_cards_related_job_id_jobs_id_fk" FOREIGN KEY ("related_job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "admit_cards" ADD CONSTRAINT "admit_cards_verified_by_id_users_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_admit_cards_v" ADD CONSTRAINT "_admit_cards_v_parent_id_admit_cards_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admit_cards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_admit_cards_v" ADD CONSTRAINT "_admit_cards_v_version_related_job_id_jobs_id_fk" FOREIGN KEY ("version_related_job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_admit_cards_v" ADD CONSTRAINT "_admit_cards_v_version_verified_by_id_users_id_fk" FOREIGN KEY ("version_verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "answer_keys" ADD CONSTRAINT "answer_keys_related_job_id_jobs_id_fk" FOREIGN KEY ("related_job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "answer_keys" ADD CONSTRAINT "answer_keys_verified_by_id_users_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_answer_keys_v" ADD CONSTRAINT "_answer_keys_v_parent_id_answer_keys_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."answer_keys"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_answer_keys_v" ADD CONSTRAINT "_answer_keys_v_version_related_job_id_jobs_id_fk" FOREIGN KEY ("version_related_job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_answer_keys_v" ADD CONSTRAINT "_answer_keys_v_version_verified_by_id_users_id_fk" FOREIGN KEY ("version_verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "syllabuses" ADD CONSTRAINT "syllabuses_related_job_id_jobs_id_fk" FOREIGN KEY ("related_job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "syllabuses" ADD CONSTRAINT "syllabuses_verified_by_id_users_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_syllabuses_v" ADD CONSTRAINT "_syllabuses_v_parent_id_syllabuses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."syllabuses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_syllabuses_v" ADD CONSTRAINT "_syllabuses_v_version_related_job_id_jobs_id_fk" FOREIGN KEY ("version_related_job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_syllabuses_v" ADD CONSTRAINT "_syllabuses_v_version_verified_by_id_users_id_fk" FOREIGN KEY ("version_verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "govt_notifications" ADD CONSTRAINT "govt_notifications_related_job_id_jobs_id_fk" FOREIGN KEY ("related_job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "govt_notifications" ADD CONSTRAINT "govt_notifications_verified_by_id_users_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_govt_notifications_v" ADD CONSTRAINT "_govt_notifications_v_parent_id_govt_notifications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."govt_notifications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_govt_notifications_v" ADD CONSTRAINT "_govt_notifications_v_version_related_job_id_jobs_id_fk" FOREIGN KEY ("version_related_job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_govt_notifications_v" ADD CONSTRAINT "_govt_notifications_v_version_verified_by_id_users_id_fk" FOREIGN KEY ("version_verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_results_fk" FOREIGN KEY ("results_id") REFERENCES "public"."results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admit_cards_fk" FOREIGN KEY ("admit_cards_id") REFERENCES "public"."admit_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_answer_keys_fk" FOREIGN KEY ("answer_keys_id") REFERENCES "public"."answer_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_syllabuses_fk" FOREIGN KEY ("syllabuses_id") REFERENCES "public"."syllabuses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_govt_notifications_fk" FOREIGN KEY ("govt_notifications_id") REFERENCES "public"."govt_notifications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "results_slug_idx" ON "results" USING btree ("slug");
  CREATE INDEX "results_related_job_idx" ON "results" USING btree ("related_job_id");
  CREATE INDEX "results_verification_status_idx" ON "results" USING btree ("verification_status");
  CREATE INDEX "results_is_archived_idx" ON "results" USING btree ("is_archived");
  CREATE INDEX "results_verified_by_idx" ON "results" USING btree ("verified_by_id");
  CREATE INDEX "results_updated_at_idx" ON "results" USING btree ("updated_at");
  CREATE INDEX "results_created_at_idx" ON "results" USING btree ("created_at");
  CREATE INDEX "results__status_idx" ON "results" USING btree ("_status");
  CREATE INDEX "_results_v_parent_idx" ON "_results_v" USING btree ("parent_id");
  CREATE INDEX "_results_v_version_version_slug_idx" ON "_results_v" USING btree ("version_slug");
  CREATE INDEX "_results_v_version_version_related_job_idx" ON "_results_v" USING btree ("version_related_job_id");
  CREATE INDEX "_results_v_version_version_verification_status_idx" ON "_results_v" USING btree ("version_verification_status");
  CREATE INDEX "_results_v_version_version_is_archived_idx" ON "_results_v" USING btree ("version_is_archived");
  CREATE INDEX "_results_v_version_version_verified_by_idx" ON "_results_v" USING btree ("version_verified_by_id");
  CREATE INDEX "_results_v_version_version_updated_at_idx" ON "_results_v" USING btree ("version_updated_at");
  CREATE INDEX "_results_v_version_version_created_at_idx" ON "_results_v" USING btree ("version_created_at");
  CREATE INDEX "_results_v_version_version__status_idx" ON "_results_v" USING btree ("version__status");
  CREATE INDEX "_results_v_created_at_idx" ON "_results_v" USING btree ("created_at");
  CREATE INDEX "_results_v_updated_at_idx" ON "_results_v" USING btree ("updated_at");
  CREATE INDEX "_results_v_latest_idx" ON "_results_v" USING btree ("latest");
  CREATE UNIQUE INDEX "admit_cards_slug_idx" ON "admit_cards" USING btree ("slug");
  CREATE INDEX "admit_cards_related_job_idx" ON "admit_cards" USING btree ("related_job_id");
  CREATE INDEX "admit_cards_verification_status_idx" ON "admit_cards" USING btree ("verification_status");
  CREATE INDEX "admit_cards_is_archived_idx" ON "admit_cards" USING btree ("is_archived");
  CREATE INDEX "admit_cards_verified_by_idx" ON "admit_cards" USING btree ("verified_by_id");
  CREATE INDEX "admit_cards_updated_at_idx" ON "admit_cards" USING btree ("updated_at");
  CREATE INDEX "admit_cards_created_at_idx" ON "admit_cards" USING btree ("created_at");
  CREATE INDEX "admit_cards__status_idx" ON "admit_cards" USING btree ("_status");
  CREATE INDEX "_admit_cards_v_parent_idx" ON "_admit_cards_v" USING btree ("parent_id");
  CREATE INDEX "_admit_cards_v_version_version_slug_idx" ON "_admit_cards_v" USING btree ("version_slug");
  CREATE INDEX "_admit_cards_v_version_version_related_job_idx" ON "_admit_cards_v" USING btree ("version_related_job_id");
  CREATE INDEX "_admit_cards_v_version_version_verification_status_idx" ON "_admit_cards_v" USING btree ("version_verification_status");
  CREATE INDEX "_admit_cards_v_version_version_is_archived_idx" ON "_admit_cards_v" USING btree ("version_is_archived");
  CREATE INDEX "_admit_cards_v_version_version_verified_by_idx" ON "_admit_cards_v" USING btree ("version_verified_by_id");
  CREATE INDEX "_admit_cards_v_version_version_updated_at_idx" ON "_admit_cards_v" USING btree ("version_updated_at");
  CREATE INDEX "_admit_cards_v_version_version_created_at_idx" ON "_admit_cards_v" USING btree ("version_created_at");
  CREATE INDEX "_admit_cards_v_version_version__status_idx" ON "_admit_cards_v" USING btree ("version__status");
  CREATE INDEX "_admit_cards_v_created_at_idx" ON "_admit_cards_v" USING btree ("created_at");
  CREATE INDEX "_admit_cards_v_updated_at_idx" ON "_admit_cards_v" USING btree ("updated_at");
  CREATE INDEX "_admit_cards_v_latest_idx" ON "_admit_cards_v" USING btree ("latest");
  CREATE UNIQUE INDEX "answer_keys_slug_idx" ON "answer_keys" USING btree ("slug");
  CREATE INDEX "answer_keys_related_job_idx" ON "answer_keys" USING btree ("related_job_id");
  CREATE INDEX "answer_keys_verification_status_idx" ON "answer_keys" USING btree ("verification_status");
  CREATE INDEX "answer_keys_is_archived_idx" ON "answer_keys" USING btree ("is_archived");
  CREATE INDEX "answer_keys_verified_by_idx" ON "answer_keys" USING btree ("verified_by_id");
  CREATE INDEX "answer_keys_updated_at_idx" ON "answer_keys" USING btree ("updated_at");
  CREATE INDEX "answer_keys_created_at_idx" ON "answer_keys" USING btree ("created_at");
  CREATE INDEX "answer_keys__status_idx" ON "answer_keys" USING btree ("_status");
  CREATE INDEX "_answer_keys_v_parent_idx" ON "_answer_keys_v" USING btree ("parent_id");
  CREATE INDEX "_answer_keys_v_version_version_slug_idx" ON "_answer_keys_v" USING btree ("version_slug");
  CREATE INDEX "_answer_keys_v_version_version_related_job_idx" ON "_answer_keys_v" USING btree ("version_related_job_id");
  CREATE INDEX "_answer_keys_v_version_version_verification_status_idx" ON "_answer_keys_v" USING btree ("version_verification_status");
  CREATE INDEX "_answer_keys_v_version_version_is_archived_idx" ON "_answer_keys_v" USING btree ("version_is_archived");
  CREATE INDEX "_answer_keys_v_version_version_verified_by_idx" ON "_answer_keys_v" USING btree ("version_verified_by_id");
  CREATE INDEX "_answer_keys_v_version_version_updated_at_idx" ON "_answer_keys_v" USING btree ("version_updated_at");
  CREATE INDEX "_answer_keys_v_version_version_created_at_idx" ON "_answer_keys_v" USING btree ("version_created_at");
  CREATE INDEX "_answer_keys_v_version_version__status_idx" ON "_answer_keys_v" USING btree ("version__status");
  CREATE INDEX "_answer_keys_v_created_at_idx" ON "_answer_keys_v" USING btree ("created_at");
  CREATE INDEX "_answer_keys_v_updated_at_idx" ON "_answer_keys_v" USING btree ("updated_at");
  CREATE INDEX "_answer_keys_v_latest_idx" ON "_answer_keys_v" USING btree ("latest");
  CREATE UNIQUE INDEX "syllabuses_slug_idx" ON "syllabuses" USING btree ("slug");
  CREATE INDEX "syllabuses_related_job_idx" ON "syllabuses" USING btree ("related_job_id");
  CREATE INDEX "syllabuses_verification_status_idx" ON "syllabuses" USING btree ("verification_status");
  CREATE INDEX "syllabuses_is_archived_idx" ON "syllabuses" USING btree ("is_archived");
  CREATE INDEX "syllabuses_verified_by_idx" ON "syllabuses" USING btree ("verified_by_id");
  CREATE INDEX "syllabuses_updated_at_idx" ON "syllabuses" USING btree ("updated_at");
  CREATE INDEX "syllabuses_created_at_idx" ON "syllabuses" USING btree ("created_at");
  CREATE INDEX "syllabuses__status_idx" ON "syllabuses" USING btree ("_status");
  CREATE INDEX "_syllabuses_v_parent_idx" ON "_syllabuses_v" USING btree ("parent_id");
  CREATE INDEX "_syllabuses_v_version_version_slug_idx" ON "_syllabuses_v" USING btree ("version_slug");
  CREATE INDEX "_syllabuses_v_version_version_related_job_idx" ON "_syllabuses_v" USING btree ("version_related_job_id");
  CREATE INDEX "_syllabuses_v_version_version_verification_status_idx" ON "_syllabuses_v" USING btree ("version_verification_status");
  CREATE INDEX "_syllabuses_v_version_version_is_archived_idx" ON "_syllabuses_v" USING btree ("version_is_archived");
  CREATE INDEX "_syllabuses_v_version_version_verified_by_idx" ON "_syllabuses_v" USING btree ("version_verified_by_id");
  CREATE INDEX "_syllabuses_v_version_version_updated_at_idx" ON "_syllabuses_v" USING btree ("version_updated_at");
  CREATE INDEX "_syllabuses_v_version_version_created_at_idx" ON "_syllabuses_v" USING btree ("version_created_at");
  CREATE INDEX "_syllabuses_v_version_version__status_idx" ON "_syllabuses_v" USING btree ("version__status");
  CREATE INDEX "_syllabuses_v_created_at_idx" ON "_syllabuses_v" USING btree ("created_at");
  CREATE INDEX "_syllabuses_v_updated_at_idx" ON "_syllabuses_v" USING btree ("updated_at");
  CREATE INDEX "_syllabuses_v_latest_idx" ON "_syllabuses_v" USING btree ("latest");
  CREATE UNIQUE INDEX "govt_notifications_slug_idx" ON "govt_notifications" USING btree ("slug");
  CREATE INDEX "govt_notifications_related_job_idx" ON "govt_notifications" USING btree ("related_job_id");
  CREATE INDEX "govt_notifications_verification_status_idx" ON "govt_notifications" USING btree ("verification_status");
  CREATE INDEX "govt_notifications_is_archived_idx" ON "govt_notifications" USING btree ("is_archived");
  CREATE INDEX "govt_notifications_verified_by_idx" ON "govt_notifications" USING btree ("verified_by_id");
  CREATE INDEX "govt_notifications_updated_at_idx" ON "govt_notifications" USING btree ("updated_at");
  CREATE INDEX "govt_notifications_created_at_idx" ON "govt_notifications" USING btree ("created_at");
  CREATE INDEX "govt_notifications__status_idx" ON "govt_notifications" USING btree ("_status");
  CREATE INDEX "_govt_notifications_v_parent_idx" ON "_govt_notifications_v" USING btree ("parent_id");
  CREATE INDEX "_govt_notifications_v_version_version_slug_idx" ON "_govt_notifications_v" USING btree ("version_slug");
  CREATE INDEX "_govt_notifications_v_version_version_related_job_idx" ON "_govt_notifications_v" USING btree ("version_related_job_id");
  CREATE INDEX "_govt_notifications_v_version_version_verification_statu_idx" ON "_govt_notifications_v" USING btree ("version_verification_status");
  CREATE INDEX "_govt_notifications_v_version_version_is_archived_idx" ON "_govt_notifications_v" USING btree ("version_is_archived");
  CREATE INDEX "_govt_notifications_v_version_version_verified_by_idx" ON "_govt_notifications_v" USING btree ("version_verified_by_id");
  CREATE INDEX "_govt_notifications_v_version_version_updated_at_idx" ON "_govt_notifications_v" USING btree ("version_updated_at");
  CREATE INDEX "_govt_notifications_v_version_version_created_at_idx" ON "_govt_notifications_v" USING btree ("version_created_at");
  CREATE INDEX "_govt_notifications_v_version_version__status_idx" ON "_govt_notifications_v" USING btree ("version__status");
  CREATE INDEX "_govt_notifications_v_created_at_idx" ON "_govt_notifications_v" USING btree ("created_at");
  CREATE INDEX "_govt_notifications_v_updated_at_idx" ON "_govt_notifications_v" USING btree ("updated_at");
  CREATE INDEX "_govt_notifications_v_latest_idx" ON "_govt_notifications_v" USING btree ("latest");
  CREATE INDEX "payload_locked_documents_rels_results_id_idx" ON "payload_locked_documents_rels" USING btree ("results_id");
  CREATE INDEX "payload_locked_documents_rels_admit_cards_id_idx" ON "payload_locked_documents_rels" USING btree ("admit_cards_id");
  CREATE INDEX "payload_locked_documents_rels_answer_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("answer_keys_id");
  CREATE INDEX "payload_locked_documents_rels_syllabuses_id_idx" ON "payload_locked_documents_rels" USING btree ("syllabuses_id");
  CREATE INDEX "payload_locked_documents_rels_govt_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("govt_notifications_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "results" CASCADE;
  DROP TABLE IF EXISTS "_results_v" CASCADE;
  DROP TABLE IF EXISTS "admit_cards" CASCADE;
  DROP TABLE IF EXISTS "_admit_cards_v" CASCADE;
  DROP TABLE IF EXISTS "answer_keys" CASCADE;
  DROP TABLE IF EXISTS "_answer_keys_v" CASCADE;
  DROP TABLE IF EXISTS "syllabuses" CASCADE;
  DROP TABLE IF EXISTS "_syllabuses_v" CASCADE;
  DROP TABLE IF EXISTS "govt_notifications" CASCADE;
  DROP TABLE IF EXISTS "_govt_notifications_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "results_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "admit_cards_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "answer_keys_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "syllabuses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "govt_notifications_id";
  `)
}
