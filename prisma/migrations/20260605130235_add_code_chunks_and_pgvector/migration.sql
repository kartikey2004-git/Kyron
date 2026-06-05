/*
  Warnings:

  - A unique constraint covering the columns `[owner,name]` on the table `repository` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "repository" ADD COLUMN     "lastIndexedCommitSha" TEXT;

-- CreateTable
CREATE TABLE "CodeChunk" (
    "id" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "startLine" INTEGER NOT NULL,
    "endLine" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imports" TEXT[],
    "signature" TEXT,
    "lastModifiedCommit" TEXT,
    "authorName" TEXT,
    "embedding" vector(768) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeChunk_repoId_filePath_idx" ON "CodeChunk"("repoId", "filePath");

-- CreateIndex
CREATE INDEX "CodeChunk_language_idx" ON "CodeChunk"("language");

-- CreateIndex
CREATE UNIQUE INDEX "repository_owner_name_key" ON "repository"("owner", "name");

-- AddForeignKey
ALTER TABLE "CodeChunk" ADD CONSTRAINT "CodeChunk_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
