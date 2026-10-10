/*
  Warnings:

  - A unique constraint covering the columns `[business_id,username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `business_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "business_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_business_id_username_key" ON "users"("business_id", "username");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
