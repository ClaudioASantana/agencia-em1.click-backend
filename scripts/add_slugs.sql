ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "Segment" ADD COLUMN IF NOT EXISTS "slug" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Location_slug_key" ON "Location"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Segment_slug_key" ON "Segment"("slug");
