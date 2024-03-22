import pg from "pg";
import env from "dotenv";

env.config();

const connectToDb = new pg.Client({
    user: process.env.USER_DB_NAME,
    host: process.env.HOST_NAME,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASS,
    port: 5432,
  })

  export default connectToDb;