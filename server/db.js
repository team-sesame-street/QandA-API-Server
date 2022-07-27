import postgres from 'postgres';

const connection = postgres({
  PGHOST: process.env.DB_HOST,
  PGUSER: process.env.DB_USER,
  PGPASSWORD: process.env.DB_PASSWORD,
  PGDATABASE: process.env.DB_NAME
})

export default sql;