import { extname, join } from 'node:path';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { File } from '@prisma/client';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { JwtPayload } from 'src/@types/jwt-payload';
import {
  ALLOWED_FILE_EXTENSIONS,
  ALLOWED_FILE_MIME_TYPES,
  MULTER_DESTINATION,
  MULTER_MAX_FILES,
  MULTER_MAX_FILE_SIZE,
} from 'src/constants/files';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { decodeEncodedName } from 'src/utils/decode-encoded-name';
import { generateFilenameHash } from 'src/utils/generate-filename-hash';
import { FilesService } from './files.service';

@Controller('files')
@ApiTags('files')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/:fileId')
  async downloadFile(@Req() req: Request, @Res() res: Response, @Param('fileId') fileId: string) {
    const file: File | null = await this.filesService.getFile(fileId, req.user.sub);

    if (!file) {
      throw new NotFoundException('File not found or access denied');
    }

    const filepath: string = join(__dirname, '../../public/uploads/', file.encryptedName);

    const filename: string = file.originalName;

    res.download(filepath, filename, (err) => {
      if (err) {
        throw new NotFoundException('Error downloading the file');
      }
    });
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload file for a specific task',
    description: 'Allows uploading a file to a specific task using the task ID.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          format: 'text',
        },
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
        destination: MULTER_DESTINATION,
        filename: (req: Express.Request, file: Express.Multer.File, callback) => {
          if (!req?.user) {
            return callback(new ForbiddenException('User not authorized'), null);
          }
          const userId: string | undefined = (req as Express.Request & { user?: JwtPayload }).user
            ?.sub;
          const decodedOriginalName: string = decodeEncodedName(file.originalname);
          const extension: string = extname(decodedOriginalName);
          const encryptedSuffix: string = generateFilenameHash(userId, decodedOriginalName);
          return callback(null, `${encryptedSuffix}${extension}`);
        },
      }),
      fileFilter: (_, file, callback) => {
        const extension: string = extname(file.originalname).toLowerCase();
        if (
          ALLOWED_FILE_EXTENSIONS.includes(extension) &&
          ALLOWED_FILE_MIME_TYPES.includes(file.mimetype)
        ) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: { files: MULTER_MAX_FILES, fileSize: MULTER_MAX_FILE_SIZE },
    }),
  )
  uploadTaskFile(
    @Req() req: Request,
    @Body('taskId') taskId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.uploadTaskFile(file, taskId, req.user.sub);
  }

  @Delete('/:fileId')
  deleteTaskFile(@Req() req: Request, @Param('fileId') fileId: string) {
    return this.filesService.deleteTaskFile(fileId, req.user.sub);
  }
}
