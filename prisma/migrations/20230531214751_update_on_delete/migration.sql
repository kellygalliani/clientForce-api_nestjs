-- DropForeignKey
ALTER TABLE "contacts_email" DROP CONSTRAINT "contacts_email_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "contacts_phone" DROP CONSTRAINT "contacts_phone_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "users_contacts" DROP CONSTRAINT "users_contacts_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "users_contacts" DROP CONSTRAINT "users_contacts_user_id_fkey";

-- AddForeignKey
ALTER TABLE "contacts_email" ADD CONSTRAINT "contacts_email_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts_phone" ADD CONSTRAINT "contacts_phone_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_contacts" ADD CONSTRAINT "users_contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_contacts" ADD CONSTRAINT "users_contacts_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
