import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  corsOrigin: string;
  nodeEnv: string;
}

export const config: Config = {
  port: 3001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export function validateConfig(): void {
  // No required fields for tRPC server since it delegates to microservices
} 