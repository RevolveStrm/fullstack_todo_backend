/*
  Warnings:

  - A unique constraint covering the columns `[taskId,userId,size,original_name]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "files_size_original_name_key";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_taskId_userId_size_original_name_key" ON "files"("taskId", "userId", "size", "original_name");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
