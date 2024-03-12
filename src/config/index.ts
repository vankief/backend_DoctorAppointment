import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRES_IN,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET,
} = process.env;
export const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;
