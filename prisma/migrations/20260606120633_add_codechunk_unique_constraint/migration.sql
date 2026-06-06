/*
  Warnings:

  - A unique constraint covering the columns `[repoId,filePath,startLine,endLine]` on the table `CodeChunk` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CodeChunk_repoId_filePath_startLine_endLine_key" ON "CodeChunk"("repoId", "filePath", "startLine", "endLine");
