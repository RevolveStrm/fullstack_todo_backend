import { extname } from 'node:path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { File, Task } from '@prisma/client';
import { MAX_FILES_PER_TASK } from 'src/constants/files';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { decodeEncodedName } from 'src/utils/decode-encoded-name';

@Injectable()
export class FilesService {
  constructor(
    private prismaService: PrismaService,
    private tasksService: TasksService,
  ) {}

  async getFile(fileId: string, userId: string): Promise<File | null> {
    return this.prismaService.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });
  }

  async deleteTaskFile(fileId: string, userId: string): Promise<File | null> {
    const existingFile: File | null = await this.prismaService.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!existingFile) {
      throw new BadRequestException('File does not exist');
    }

    return this.prismaService.file.update({
      where: {
        id: fileId,
        userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async uploadTaskFile(file: Express.Multer.File, taskId: string, userId: string): Promise<File> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const existingTask: Task | null = await this.tasksService.checkTaskExisting({
      id: taskId,
      userId,
    });

    if (!existingTask) {
      throw new BadRequestException('Task does not exist.');
    }

    const taskFilesCount: number = await this.getTaskFilesCount(taskId);

    if (taskFilesCount === MAX_FILES_PER_TASK) {
      throw new BadRequestException('Reached max files count per task');
    }

    const existingFile = await this.prismaService.file.findFirst({
      where: {
        originalName: file.originalname,
        size: file.size,
        deletedAt: null,
        taskId,
      },
    });

    if (existingFile) {
      throw new BadRequestException('File with the same name and size already exists');
    }

    return this.prismaService.file.create({
      data: {
        size: file.size,
        originalName: decodeEncodedName(file.originalname),
        encryptedName: file.filename,
        extension: extname(file.originalname),
        taskId,
        userId,
      },
    });
  }

  private async getTaskFilesCount(taskId: string): Promise<number> {
    return this.prismaService.file.count({
      where: {
        taskId,
        deletedAt: null,
      },
    });
  }
}
