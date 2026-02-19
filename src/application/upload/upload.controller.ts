import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ConfigService } from '@nestjs/config';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private configService: ConfigService) {}
  @Post()
  @ApiOperation({ summary: 'Upload a file (image)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          // new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // Construct public URL
    const baseUrl =
      this.configService.get<string>('API_URL') || 'http://localhost:3000';
    // Ensure we don't double slash if API_URL has trailing slash
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const fileUrl = `${cleanBaseUrl}/uploads/${file.filename}`;

    return {
      url: fileUrl,
      filename: file.filename,
      originalname: file.originalname,
    };
  }
}
