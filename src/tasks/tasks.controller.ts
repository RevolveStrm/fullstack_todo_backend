import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskStatus } from '@prisma/client';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
	constructor(private tasksService: TasksService) {}

	@Get('/')
	public getTasks(@Query() query: GetTasksQueryDto): Promise<Task[]> {
		return this.tasksService.getTasks(query);
	}

	@Post('/')
	public createTask(@Body() createTaskBody: CreateTaskDto): Promise<Task> {
		return this.tasksService.createTask(createTaskBody);
	}

	@Patch(':id')
	public updateTask(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskBody: UpdateTaskDto): Promise<Task> {
		return this.tasksService.updateTask(id, updateTaskBody);
	}

	@Delete(':id')
	public deleteTask(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
		return this.tasksService.deleteTask(id);
	}
}
