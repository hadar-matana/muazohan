import dotenv from 'dotenv';

dotenv.config();

export interface S3Config {
  port: number;
  corsOrigin: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  awsBucketName: string;
  nodeEnv: string;
}

export const config: S3Config = {
  port: 3002,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  awsRegion: process.env.AWS_REGION || 'eu-north-1',
  awsBucketName: process.env.AWS_BUCKET_NAME || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export function validateConfig(): void {
  const requiredFields: (keyof S3Config)[] = [
    'awsAccessKeyId',
    'awsSecretAccessKey',
    'awsBucketName'
  ];
  
  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing required configuration: ${field}`);
    }
  }
}
