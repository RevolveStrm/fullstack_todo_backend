import { BadRequestException, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  async getTasks(userId: string): Promise<Task[]> {
    const tasks: Task[] = await this.prismaService.task.findMany({
      where: {
        userId,
      },
    });

    return tasks;
  }

  getTask(taskId: string, userId: string): Promise<Task> {
    return this.prismaService.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
  }

  async createTask(createTaskBody: CreateTaskDto, userId: string): Promise<Task> {
    if (await this.checkTaskExisting({ title: createTaskBody.title, userId })) {
      throw new BadRequestException('Task with the same title already exists.');
    }
    return this.prismaService.task.create({
      data: {
        ...createTaskBody,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async updateTask(id: string, updateTaskBody: UpdateTaskDto, userId: string): Promise<Task> {
    if (!(await this.checkTaskExisting({ id, userId }))) {
      throw new BadRequestException('Task with this id does not exist');
    }
    return this.prismaService.task.update({
      where: {
        id,
        userId,
      },
      data: updateTaskBody,
    });
  }

  public async deleteTask(id: string, userId: string): Promise<Task> {
    if (!(await this.checkTaskExisting({ id, userId }))) {
      throw new BadRequestException('Task with this id does not exist');
    }

    return this.prismaService.task.delete({
      where: { id, userId },
    });
  }

  private checkTaskExisting(condition: {
    userId: string;
    id?: string;
    title?: string;
  }): Promise<Task> {
    return this.prismaService.task.findFirst({
      where: condition,
    });
  }
}
