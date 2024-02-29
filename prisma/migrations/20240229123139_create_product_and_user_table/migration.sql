/*
  Warnings:

  - You are about to drop the `producttype` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_productTypeID_fkey`;

-- DropTable
DROP TABLE `producttype`;

-- CreateTable
CREATE TABLE `product_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productTypeName` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_productTypeID_fkey` FOREIGN KEY (`productTypeID`) REFERENCES `product_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
