import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(60061),
  DATABASE_NAME: Joi.string().default('advanced_inventory_management'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_USER: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().default('postgres'),
});
