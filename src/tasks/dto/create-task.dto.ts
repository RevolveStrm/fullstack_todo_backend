import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateTaskDto {
	@IsString()
	title: string;

	@IsInt()
	@Min(1)
	@Max(10)
	priority: number;
}
