/*
  Warnings:

  - You are about to drop the column `active` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `Publication` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Publication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "priority" TEXT NOT NULL DEFAULT 'Média',
    "establishmentId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Publication_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_Publication" ("createdAt", "description", "endDate", "establishmentId", "id", "priority", "startDate", "title", "updatedAt") SELECT "createdAt", "description", "endDate", "establishmentId", "id", "priority", "startDate", "title", "updatedAt" FROM "Publication";
DROP TABLE "Publication";
ALTER TABLE "new_Publication" RENAME TO "Publication";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
