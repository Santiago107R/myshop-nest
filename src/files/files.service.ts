import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET')
    })
  }

  async uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'product',
          use_filename: true,
          unique_filename: true,
          format: 'webp',
          transformation: [
            {width: 1000, crop: 'limit'},
            {quality: 'auto'}
          ]
        },
        (error, result) => {
          if (error) return reject(error);

          if (!result) {
            return reject(new Error('Cloudinary upload result is undefined'));
          }

          resolve(result);
        },
      );
      // Convertimos el buffer a un stream para que Cloudinary lo procese
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    })
  }


  // getStaticProductImage(imageName: string) {
  //   const path = join(__dirname, '../../asdasd', imageName)

  //   if (!existsSync(path))
  //     throw new BadRequestException(`No product found with image ${imageName}`)

  //   return path
  // }
}
