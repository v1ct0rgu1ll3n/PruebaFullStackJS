// backend/src/config/env.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'changeme',
  PORT: Number(process.env.PORT) || 3000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:4200',
};
