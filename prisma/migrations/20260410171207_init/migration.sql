-- CreateTable
CREATE TABLE "Evaluation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerName" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "coach" TEXT NOT NULL,
    "mindsetAvg" REAL NOT NULL,
    "physicalAvg" REAL NOT NULL,
    "technicalAvg" REAL NOT NULL,
    "tacticalAvg" REAL NOT NULL,
    "detailedScores" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
