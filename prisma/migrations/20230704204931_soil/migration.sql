-- RenameForeignKey
ALTER TABLE "farms" RENAME CONSTRAINT "farms_user_id_foreign" TO "farms_owner_fkey";
