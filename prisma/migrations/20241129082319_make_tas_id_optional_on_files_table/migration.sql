-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_task_id_fkey";

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "task_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
