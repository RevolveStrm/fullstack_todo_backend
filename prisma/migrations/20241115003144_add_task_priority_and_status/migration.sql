/*
  Warnings:

  - The values [UNDONE] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `priority` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELED');
ALTER TABLE "tasks" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'TODO';
COMMIT;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'TODO',
DROP COLUMN "priority",
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'LOW';
