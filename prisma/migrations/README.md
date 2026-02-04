# Database Migrations

## Applying the migration

When your database is available, run:

```bash
npx prisma migrate deploy
```

This applies all pending migrations, including `add_delivery_location_and_require_phone`.

**Note:** If this is the first migration and your database already has tables (e.g., from `prisma db push`), you may need to [baseline](https://www.prisma.io/docs/orm/prisma-migrate/getting-started#adding-prisma-migrate-to-an-existing-project) first.

## What this migration does

- **Adds `deliveryLocation`** (required). Existing orders get `'Address not specified'`.
- **Makes `customerPhone` required.** Existing orders with NULL get `'Not provided'`.
