import { DataSourceOptions, DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST } = process.env;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:5432/${DATABASE_NAME}`,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db_migrations/migrations/*.js'],
  migrationsRun: true,
};

export default new DataSource(dataSourceOptions);
