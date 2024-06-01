import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Task, TaskStatus } from '@prisma/client';

export class GetTasksQueryDto {
    @IsString()
    @IsOptional()
    sortDirection?: 'asc' | 'desc' = 'desc';

    @IsString()
    @IsOptional()
    sortField?: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;
}
