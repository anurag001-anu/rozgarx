const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: 'postgres://postgres:postgres@localhost:5432/job_portal' });
  await client.connect();
  try {
    await client.query(`ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS resumes_id integer`);
    await client.query(`ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS job_sources_id integer`);
    console.log('Columns added');
  } catch(e) {
    console.log(e);
  }
  await client.end();
}
run().catch(console.error);
