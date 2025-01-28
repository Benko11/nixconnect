-- CreateTable
CREATE TABLE "Gender" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pronoun" (
    "id" SERIAL NOT NULL,
    "word" VARCHAR(255) NOT NULL,
    "masterPronounId" INTEGER,

    CONSTRAINT "Pronoun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "defaultValue" BIGINT NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColourScheme" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "primaryColour" VARCHAR(255) NOT NULL,
    "secondaryColour" VARCHAR(255) NOT NULL,
    "accentColour" VARCHAR(255) NOT NULL,
    "errorColour" VARCHAR(255) NOT NULL,
    "neutralColour" VARCHAR(255) NOT NULL,
    "lightColour" VARCHAR(255) NOT NULL,
    "darkColour" VARCHAR(255) NOT NULL,
    "backgroundColour" VARCHAR(255) NOT NULL,

    CONSTRAINT "ColourScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "genderId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "contents" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gender_name_key" ON "Gender"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_identifier_key" ON "Preferences"("identifier");

-- CreateIndex
CREATE INDEX "Preferences_identifier_idx" ON "Preferences"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "ColourScheme_name_key" ON "ColourScheme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_nickname_idx" ON "User"("nickname");

-- AddForeignKey
ALTER TABLE "Pronoun" ADD CONSTRAINT "Pronoun_masterPronounId_fkey" FOREIGN KEY ("masterPronounId") REFERENCES "Pronoun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
