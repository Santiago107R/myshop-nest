import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config();

const stage = process.env.STAGE || 'dev';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: stage === 'dev' ? 'localhost' : process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: stage === 'dev',
    entities: [join(__dirname, 'src/**/entities/*.entity{.ts,.js}')],
    migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
});