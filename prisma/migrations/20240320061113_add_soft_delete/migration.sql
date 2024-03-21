/*
  Warnings:

  - You are about to alter the column `price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `price` FLOAT NOT NULL;

-- AlterTable
ALTER TABLE `product_type` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;
