import { type Response } from 'express';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UploadedFile, BadRequestException, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) { }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');

    const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/product/${imageName}`;

    return res.redirect(cloudinaryUrl);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
  }))
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {

    if (!file) {
      throw new BadRequestException('Make sure that file is an image')
    }

    try {
      const result = await this.filesService.uploadToCloudinary(file)

      return {
        secureUrl: result.secure_url.replace(/\/upload\//g, '/upload/f_auto,q_auto/')
      }
    } catch (error) {
      throw new BadRequestException('Error uploading image to Cloudinary')
    }

    // const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

  }
}
