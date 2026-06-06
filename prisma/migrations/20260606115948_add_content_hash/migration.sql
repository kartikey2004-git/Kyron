/*
  Warnings:

  - Added the required column `contentHash` to the `CodeChunk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CodeChunk" ADD COLUMN     "contentHash" TEXT NOT NULL;
