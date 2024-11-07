import { Task } from '@prisma/client';

export interface GetTasksResponse {
  tasks: Task[];
  page: number;
  limit: number;
  total: number;
  last: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
