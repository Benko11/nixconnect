/*
  Warnings:

  - You are about to drop the `Preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Preferences";

-- CreateTable
CREATE TABLE "Preference" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "defaultValue" BIGINT NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "preferenceId" INTEGER NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "value" BIGINT,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("preferenceId","userId")
);

-- CreateTable
CREATE TABLE "UserPronoun" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "pronounId" INTEGER NOT NULL,

    CONSTRAINT "UserPronoun_pkey" PRIMARY KEY ("userId","pronounId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preference_identifier_key" ON "Preference"("identifier");

-- CreateIndex
CREATE INDEX "Preference_identifier_idx" ON "Preference"("identifier");

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "Preference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPronoun" ADD CONSTRAINT "UserPronoun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPronoun" ADD CONSTRAINT "UserPronoun_pronounId_fkey" FOREIGN KEY ("pronounId") REFERENCES "Pronoun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
