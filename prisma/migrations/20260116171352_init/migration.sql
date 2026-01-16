-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "assignedNumber" INTEGER NOT NULL,
    "amountCharged" INTEGER NOT NULL,
    "paymentId" TEXT,
    "entryType" TEXT NOT NULL DEFAULT 'PRIMARY',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "campaignName" TEXT NOT NULL DEFAULT 'Chance Raffle',
    "prizeDescription" TEXT NOT NULL DEFAULT 'Grand Prize',
    "cashValue" INTEGER NOT NULL DEFAULT 10000,
    "totalEntries" INTEGER NOT NULL DEFAULT 360,
    "overflowEnabled" BOOLEAN NOT NULL DEFAULT false,
    "overflowStartTime" DATETIME,
    "overflowDuration" INTEGER NOT NULL DEFAULT 180,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "winnerId" TEXT,
    "winnerDrawnAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_assignedNumber_key" ON "Entry"("assignedNumber");

-- CreateIndex
CREATE INDEX "Entry_email_idx" ON "Entry"("email");

-- CreateIndex
CREATE INDEX "Entry_assignedNumber_idx" ON "Entry"("assignedNumber");

-- CreateIndex
CREATE INDEX "Entry_entryType_idx" ON "Entry"("entryType");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
