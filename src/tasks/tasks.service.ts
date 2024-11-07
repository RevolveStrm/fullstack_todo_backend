import { BadRequestException, Injectable } from '@nestjs/common';
import { Task, TaskStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
	constructor(private prismaService: PrismaService) {}

	// public async createTask(createTaskBody: CreateTaskDto) {
	// 	if (await this.checkTaskExisting({ title: createTaskBody.title })) {
	// 		throw new BadRequestException('Task with the same title already exists.');
	// 	}
	// 	return this.prismaService.task.create({
	// 		data: createTaskBody,
	// 	});
	// }

	public getTasks(query: GetTasksQueryDto): Promise<Task[]> {
		const options: Prisma.TaskFindManyArgs = {};

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

		return this.prismaService.task.findMany(options);
	}

	public async updateTask(id: string, updateTaskBody: UpdateTaskDto): Promise<Task> {
		if (!(await this.checkTaskExisting({ id }))) {
			throw new BadRequestException("Task with this id doesn't exist");
		}

		return this.prismaService.task.update({
			where: { id },
			data: updateTaskBody,
		});
	}

	public async deleteTask(id: string): Promise<Task> {
		if (!(await this.checkTaskExisting({ id }))) {
			throw new BadRequestException("Task with this id doesn't exist");
		}

		return this.prismaService.task.delete({
			where: { id },
		});
	}

	public checkTaskExisting(condition: {
		id?: string;
		title?: string;
	}): Promise<Task> {
		return this.prismaService.task.findFirst({
			where: condition,
		});
	}
}
