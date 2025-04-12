/*
  Warnings:

  - A unique constraint covering the columns `[shareCode]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_shareCode_key" ON "File"("shareCode");
