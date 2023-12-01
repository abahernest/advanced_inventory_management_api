import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(60061),
  DATABASE_URI: Joi.string().default(
    'postgres://postgres:postgres@localhost:5432/advanced_inventory_management',
  ),
  TEST_DATABASE_URI: Joi.string().default(
    'postgres://postgres:postgres@localhost:5432/advanced_inventory_management_test',
  ),
});
