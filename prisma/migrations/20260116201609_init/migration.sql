-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "assignedNumber" INTEGER NOT NULL,
    "amountCharged" INTEGER NOT NULL,
    "paymentId" TEXT,
    "entryType" TEXT NOT NULL DEFAULT 'PRIMARY',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "campaignName" TEXT NOT NULL DEFAULT 'Chance Raffle',
    "prizeDescription" TEXT NOT NULL DEFAULT 'Grand Prize',
    "cashValue" INTEGER NOT NULL DEFAULT 10000,
    "totalEntries" INTEGER NOT NULL DEFAULT 360,
    "overflowEnabled" BOOLEAN NOT NULL DEFAULT false,
    "overflowStartTime" TIMESTAMP(3),
    "overflowDuration" INTEGER NOT NULL DEFAULT 180,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "winnerId" TEXT,
    "winnerDrawnAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
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
