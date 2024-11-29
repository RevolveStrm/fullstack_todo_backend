import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TasksService } from 'src/tasks/tasks.service';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [PrismaModule],
  controllers: [FilesController],
  providers: [FilesService, TasksService],
})
export class FilesModule {}
