const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: 'postgres://postgres:postgres@localhost:5432/job_portal' });
  await client.connect();
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS payload_locked_documents (
      id serial PRIMARY KEY,
      global_slug varchar,
      updated_at timestamp,
      created_at timestamp
    );
    CREATE TABLE IF NOT EXISTS payload_locked_documents_rels (
      id serial PRIMARY KEY,
      parent_id integer,
      path varchar,
      "order" integer,
      users_id integer,
      jobs_id integer,
      companies_id integer,
      applications_id integer,
      saved_jobs_id integer,
      job_alerts_id integer,
      notification_history_id integer,
      sarkari_updates_id integer,
      results_id integer,
      admit_cards_id integer,
      answer_keys_id integer,
      syllabuses_id integer,
      govt_notifications_id integer,
      media_id integer,
      resumes_id integer,
      job_sources_id integer
    );
  `);
  await client.end();
  console.log('Tables created');
}
run().catch(console.error);
