import * as Joi from 'joi';
import { Environments } from '../enums/environments.enum';
import { EnvironmentVariables } from '../models/EnvironmentVariables';

export const EnvValidationSchema = Joi.object<EnvironmentVariables>({
  BASE_URL: Joi.string().uri().required(),
  PORT: Joi.number().required(),
  ENVIRONMENT: Joi.string()
    .valid(...Object.values(Environments))
    .required(),
  MONGODB_URI: Joi.string().uri().required(),
  MONGODB_DIRECT_CONNECTION: Joi.boolean().required(),
  AMQP_URI: Joi.string().uri().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  BCRYPT_SALT: Joi.number().required(),
});
