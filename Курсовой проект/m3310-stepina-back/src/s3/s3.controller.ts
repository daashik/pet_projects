import { Controller, Post, UploadedFile, UseInterceptors, Res, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { S3Service } from './s3.service'; 
import { PrismaService } from '../prisma/prisma.service';

@Controller('files')
export class S3Controller {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prisma: PrismaService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Допустимы только изображения (jpg, jpeg, png)!'), 
            false
          );
        }
        cb(null, true);
      },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (!file) {
      return res.redirect('/horses');
    }

    const key = `gallery/${Date.now()}-${file.originalname}`;
    const url = await this.s3Service.uploadFile(file, key);

    await this.prisma.horse.create({
      data: {
        name: 'GALLERY_ONLY',
        breed: '—',
        gender: '—',
        photoUrl: url,
      },
    });

    return res.redirect('/horses');
  }
}