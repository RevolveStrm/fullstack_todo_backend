import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Task, TaskStatus } from '@prisma/client';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiTags('tasks')
@UseGuards(AccessTokenGuard)
export class TasksController {
	constructor(private tasksService: TasksService) {}

	@Get('/')
	public getTasks() {
		return ['tasks'];
	}

	// @Get('/')
	// public getTasks(@Query() query: GetTasksQueryDto): Promise<Task[]> {
	// 	return this.tasksService.getTasks(query);
	// }

	// @Post('/')
	// public createTask(@Body() createTaskBody: CreateTaskDto): Promise<Task> {
	// 	return this.tasksService.createTask(createTaskBody);
	// }

	// @Patch(':id')
	// public updateTask(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskBody: UpdateTaskDto): Promise<Task> {
	// 	return this.tasksService.updateTask(id, updateTaskBody);
	// }

	// @Delete(':id')
	// public deleteTask(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
	// 	return this.tasksService.deleteTask(id);
	// }
}
