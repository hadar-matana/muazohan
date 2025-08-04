const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-north-1',
});

const s3 = new AWS.S3();

const corsConfig = {
  CORSRules: [
    {
      AllowedHeaders: ['*'],
      AllowedMethods: ['GET', 'HEAD'],
      AllowedOrigins: ['*'], // In production, specify your domain
      ExposeHeaders: ['ETag'],
      MaxAgeSeconds: 3000,
    },
  ],
};

async function setupCORS() {
  try {
    await s3.putBucketCors({
      Bucket: process.env.AWS_BUCKET_NAME,
      CORSConfiguration: corsConfig,
    }).promise();
    
    console.log('✅ CORS configuration updated successfully');
  } catch (error) {
    console.error('❌ Error setting up CORS:', error);
  }
}

setupCORS(); 