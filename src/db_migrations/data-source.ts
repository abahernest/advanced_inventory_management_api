import { DataSourceOptions, DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const { TEST_DATABASE_URI, DATABASE_URI, NODE_ENV } = process.env;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: NODE_ENV === 'test' ? TEST_DATABASE_URI : DATABASE_URI,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsRun: true,
};

export default new DataSource(dataSourceOptions);
