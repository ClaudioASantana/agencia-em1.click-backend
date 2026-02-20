-- AddColumn showPrice to Establishment
ALTER TABLE "Establishment" ADD COLUMN IF NOT EXISTS "showPrice" BOOLEAN NOT NULL DEFAULT false;
