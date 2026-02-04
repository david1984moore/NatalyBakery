-- AlterTable: Add deliveryLocation and make customerPhone required
-- Handles existing data before applying NOT NULL constraints

-- Step 1: Add deliveryLocation column as nullable first (for existing rows)
ALTER TABLE "Order" ADD COLUMN "deliveryLocation" TEXT;

-- Step 2: Backfill deliveryLocation for existing orders
UPDATE "Order" SET "deliveryLocation" = 'Address not specified' WHERE "deliveryLocation" IS NULL;

-- Step 3: Make deliveryLocation NOT NULL
ALTER TABLE "Order" ALTER COLUMN "deliveryLocation" SET NOT NULL;

-- Step 4: Backfill customerPhone for existing orders that have NULL
UPDATE "Order" SET "customerPhone" = 'Not provided' WHERE "customerPhone" IS NULL;

-- Step 5: Make customerPhone NOT NULL
ALTER TABLE "Order" ALTER COLUMN "customerPhone" SET NOT NULL;
