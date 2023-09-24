export type EnvironmentVariables = {
  BASE_URL: string;
  PORT: number;
  ENVIRONMENT: string;
  MONGODB_URI: string;
  MONGODB_DIRECT_CONNECTION: boolean;
  AMQP_URI: string;
  JWT_EXPIRES_IN: string;
  JWT_SECRET: string;
  BCRYPT_SALT: number;
};
