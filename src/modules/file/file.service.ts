import { Injectable } from '@nestjs/common';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3 } from '@aws-sdk/client-s3';

@Injectable()
export class FileService {
  s3Client: S3;
  retryCounter = 0;

  initS3() {
    const s3Client = new S3({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
      },
    });
    this.s3Client = s3Client;
  }

  async uploadUserAvatarImage({
    imageData,
    userId,
  }: {
    imageData: string;
    userId: string;
  }) {
    const bucketParams = {
      Bucket: 'scrapper-images-data',
      Key: `users/${userId}`,
      Body: imageData,
      ACL: 'public-read',
    };

    await this.s3Client.send(new PutObjectCommand(bucketParams));
  }
}
