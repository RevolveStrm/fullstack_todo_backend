/*
  Warnings:

  - You are about to drop the column `taskId` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[task_id,user_id,size,original_name]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `task_id` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_taskId_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_userId_fkey";

-- DropIndex
DROP INDEX "files_taskId_idx";

-- DropIndex
DROP INDEX "files_taskId_userId_size_original_name_key";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "taskId",
DROP COLUMN "userId",
ADD COLUMN     "task_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "files_task_id_idx" ON "files"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "files_task_id_user_id_size_original_name_key" ON "files"("task_id", "user_id", "size", "original_name");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
