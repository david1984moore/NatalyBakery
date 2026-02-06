-- AlterTable: Add delivery date, time, and confirmation fields to Order

-- Add deliveryDate column (nullable for existing orders)
ALTER TABLE "Order" ADD COLUMN "deliveryDate" TIMESTAMP(3);

-- Add deliveryTime column (nullable for existing orders)
ALTER TABLE "Order" ADD COLUMN "deliveryTime" TEXT;

-- Add deliveryConfirmed column (default false)
ALTER TABLE "Order" ADD COLUMN "deliveryConfirmed" BOOLEAN NOT NULL DEFAULT false;

-- Add deliveryConfirmedAt column (nullable)
ALTER TABLE "Order" ADD COLUMN "deliveryConfirmedAt" TIMESTAMP(3);
