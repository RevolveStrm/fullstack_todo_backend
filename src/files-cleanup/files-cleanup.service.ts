import { access, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { File } from '@prisma/client';
import { MULTER_DESTINATION } from 'src/constants/files';
import { CLEANUP_CONDITIONS } from 'src/constants/files-cleanup';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesCleanupService {
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleFilesCleanup() {
    try {
      console.log('Starting file cleanup task');

      const foundFiles: File[] = await this.prismaService.file.findMany(CLEANUP_CONDITIONS);

      if (!foundFiles?.length) {
        console.log('No files for cleanup were found.');
        return;
      }

      await this.removeFiles(foundFiles);

      const deleteResult = await this.prismaService.file.deleteMany(CLEANUP_CONDITIONS);

      console.log(`Deleted ${deleteResult.count} file records from database.`);
      console.log('File cleanup task completed');
    } catch (error) {
      console.error('Error during file cleanup', error);
    }
  }

  async removeFiles(files: File[]) {
    await Promise.all(
      files.map(async (file: File) => {
        const filePath = resolve(MULTER_DESTINATION, file.encryptedName);
        try {
          await access(filePath);
          await unlink(filePath);
        } catch (fsError) {
          console.error(`Failed to delete file: ${filePath}`, fsError);
        }
      }),
    );
  }
}
