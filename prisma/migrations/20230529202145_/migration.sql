-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_email" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,

    CONSTRAINT "users_email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_phone" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "users_phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts_email" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,

    CONSTRAINT "contacts_email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts_phone" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,

    CONSTRAINT "contacts_phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_contacts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,

    CONSTRAINT "users_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_email_key" ON "users_email"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_email_email_key" ON "contacts_email"("email");

-- AddForeignKey
ALTER TABLE "users_email" ADD CONSTRAINT "users_email_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_phone" ADD CONSTRAINT "users_phone_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts_email" ADD CONSTRAINT "contacts_email_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts_phone" ADD CONSTRAINT "contacts_phone_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_contacts" ADD CONSTRAINT "users_contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_contacts" ADD CONSTRAINT "users_contacts_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
