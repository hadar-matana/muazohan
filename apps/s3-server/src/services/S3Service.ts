import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

export class S3Service {
  private s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
      region: config.awsRegion,
    });

    this.s3 = new AWS.S3();
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'songs'): Promise<string> {
    const key = `${folder}/${uuidv4()}_${file.originalname}`;
    
    const params = {
      Bucket: config.awsBucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || 'audio/mpeg',
      CacheControl: 'max-age=31536000',
    };

    try {
      const data = await this.s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: config.awsBucketName,
      Key: key,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('S3 delete error:', error);
      throw new Error('Failed to delete file from S3');
    }
  }

  async getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const params = {
      Bucket: config.awsBucketName,
      Key: key,
      Expires: expiresIn,
    };

    try {
      return this.s3.getSignedUrl('getObject', params);
    } catch (error) {
      console.error('S3 get signed URL error:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  async listFiles(prefix: string = ''): Promise<AWS.S3.Object[]> {
    const params = {
      Bucket: config.awsBucketName,
      Prefix: prefix,
    };

    try {
      const data = await this.s3.listObjectsV2(params).promise();
      return data.Contents || [];
    } catch (error) {
      console.error('S3 list files error:', error);
      throw new Error('Failed to list files from S3');
    }
  }
}
