import { TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

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

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;
}
