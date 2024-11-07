import { TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsOptional()
  priority?: number;
}
