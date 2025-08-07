import dotenv from 'dotenv';

dotenv.config();

export interface PostgresConfig {
  port: number;
  corsOrigin: string;
  databaseUrl: string;
  nodeEnv: string;
}

export const config: PostgresConfig = {
  port: 3003,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export function validateConfig(): void {
  const requiredFields: (keyof PostgresConfig)[] = ['databaseUrl'];
  
  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing required configuration: ${field}`);
    }
  }
}
