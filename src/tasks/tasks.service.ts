import { BadRequestException, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksResponse } from './types/get-tasks-response.type';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  async getTasks(query: GetTasksQueryDto, userId: string): Promise<GetTasksResponse> {
    const limitTasksPerPage: number = 10;

    const options: Prisma.TaskFindManyArgs = {};

    options.where = {
      userId,
    };

    if (query.sortField && query.sortDirection) {
      options.orderBy = {
        [query.sortField]: query.sortDirection as Prisma.SortOrder,
      };
    }

    if (query.title) {
      options.where = {
        ...options.where,
        title: {
          contains: query.title,
        },
      };
    }

    if (query.status) {
      options.where = {
        ...options.where,
        status: query.status,
      };
    }

    if (query.priority) {
      options.where = {
        ...options.where,
        priority: query.priority,
      };
    }

    options.skip = query.page ? (query.page - 1) * limitTasksPerPage : 0;

    options.take = limitTasksPerPage;

    const total = await this.prismaService.task.count({
      where: options.where,
    });

    const last = Math.ceil(total / limitTasksPerPage);

    const hasNextPage: boolean = query.page + 1 <= last;

    const hasPrevPage: boolean = query.page - 1 >= 1;

    const tasks: Task[] = await this.prismaService.task.findMany(options);

    return {
      tasks,
      page: query.page,
      limit: limitTasksPerPage,
      total,
      last,
      hasNextPage,
      hasPrevPage,
    };
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

  public checkTaskExisting(condition: {
    userId: string;
    id?: string;
    title?: string;
  }): Promise<Task> {
    return this.prismaService.task.findFirst({
      where: condition,
    });
  }
}
