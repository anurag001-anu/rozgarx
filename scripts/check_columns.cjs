const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: 'postgres://postgres:postgres@localhost:5432/job_portal' });
  await client.connect();
  const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='payload_locked_documents_rels'`);
  console.log(res.rows.map(r => r.column_name));
  await client.end();
}
run().catch(console.error);
