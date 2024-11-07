import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Task } from '@prisma/client';
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
  getTasks(@Req() req: Request, @Query() query: GetTasksQueryDto): Promise<Task[]> {
    return this.tasksService.getTasks(query, req.user.sub);
  }

  @Get('/:id')
  getTask(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.getTask(id, req.user.sub);
  }

  @Post('/')
  createTask(@Req() req: Request, @Body() createTaskBody: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskBody, req.user.sub);
  }

  @Patch(':id')
  public updateTask(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskBody: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskBody, req.user.sub);
  }

  @Delete(':id')
  public deleteTask(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.tasksService.deleteTask(id, req.user.sub);
  }
}
