-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_category_id_fkey";

-- DropIndex
DROP INDEX "cafe_tables_normalized_label_key";

-- DropIndex
DROP INDEX "categories_normalized_name_key";

-- DropIndex
DROP INDEX "products_category_id_idx";

-- DropIndex
DROP INDEX "products_normalized_name_key";

-- AlterTable
ALTER TABLE "cafe_tables" ADD COLUMN "business_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN "business_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN "business_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cafe_tables_business_id_normalized_label_key" ON "cafe_tables"("business_id", "normalized_label");

-- CreateIndex
CREATE UNIQUE INDEX "categories_business_id_id_key" ON "categories"("business_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_business_id_normalized_name_key" ON "categories"("business_id", "normalized_name");

-- CreateIndex
CREATE INDEX "products_business_id_category_id_idx" ON "products"("business_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_business_id_normalized_name_key" ON "products"("business_id", "normalized_name");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_business_id_category_id_fkey" FOREIGN KEY ("business_id", "category_id") REFERENCES "categories"("business_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cafe_tables" ADD CONSTRAINT "cafe_tables_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
