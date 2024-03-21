/*
  Warnings:

  - A unique constraint covering the columns `[productTypeName]` on the table `product_type` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `product_type_productTypeName_key` ON `product_type`(`productTypeName`);
