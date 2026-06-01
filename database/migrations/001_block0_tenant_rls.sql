-- Run on an existing DB after backup. Fresh installs: use schema.sql instead.
-- psql $DATABASE_URL -f database/migrations/001_block0_tenant_rls.sql

-- ticket_items.product_id (API already uses it)
ALTER TABLE ticket_items
    ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id);

-- Tenant column on business-owned tables
ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id);

ALTER TABLE tickets
    ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id);

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id);

-- Backfill account_id from owning user
UPDATE customers c
SET account_id = u.account_id
FROM users u
WHERE c.user_id = u.id AND c.account_id IS NULL;

UPDATE tickets t
SET account_id = u.account_id
FROM users u
WHERE t.user_id = u.id AND t.account_id IS NULL;

UPDATE products p
SET account_id = (SELECT account_id FROM users LIMIT 1)
WHERE p.account_id IS NULL;

ALTER TABLE customers ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE tickets ALTER COLUMN account_id SET NOT NULL;

-- Products: relax SKU requirements for MVP inserts
ALTER TABLE products ALTER COLUMN internal_sku DROP NOT NULL;
ALTER TABLE products ALTER COLUMN external_sku DROP NOT NULL;

UPDATE products p
SET account_id = u.account_id
FROM users u
WHERE p.account_id IS NULL
  AND u.id = (SELECT id FROM users ORDER BY created_at LIMIT 1);

ALTER TABLE products ALTER COLUMN account_id SET NOT NULL;

-- Optional subdomain slug (Phase 2)
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS slug VARCHAR(63) UNIQUE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_account_id ON customers(account_id);
CREATE INDEX IF NOT EXISTS idx_tickets_account_id ON tickets(account_id);
CREATE INDEX IF NOT EXISTS idx_products_account_id ON products(account_id);
CREATE INDEX IF NOT EXISTS idx_ticket_items_ticket_id ON ticket_items(ticket_id);
CREATE INDEX IF NOT EXISTS idx_payments_ticket_id ON payments(ticket_id);

-- Row Level Security (tenant lock via session variable)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS customers_tenant ON customers;
CREATE POLICY customers_tenant ON customers
    USING (account_id = current_setting('app.account_id', true)::uuid);

DROP POLICY IF EXISTS tickets_tenant ON tickets;
CREATE POLICY tickets_tenant ON tickets
    USING (account_id = current_setting('app.account_id', true)::uuid);

DROP POLICY IF EXISTS ticket_items_tenant ON ticket_items;
CREATE POLICY ticket_items_tenant ON ticket_items
    USING (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = ticket_items.ticket_id
              AND t.account_id = current_setting('app.account_id', true)::uuid
        )
    );

DROP POLICY IF EXISTS payments_tenant ON payments;
CREATE POLICY payments_tenant ON payments
    USING (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = payments.ticket_id
              AND t.account_id = current_setting('app.account_id', true)::uuid
        )
    );

DROP POLICY IF EXISTS products_tenant ON products;
CREATE POLICY products_tenant ON products
    USING (account_id = current_setting('app.account_id', true)::uuid);

DROP POLICY IF EXISTS sent_payments_tenant ON sent_payments;
CREATE POLICY sent_payments_tenant ON sent_payments
    USING (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = sent_payments.ticket_id
              AND t.account_id = current_setting('app.account_id', true)::uuid
        )
    );

ALTER TABLE customers FORCE ROW LEVEL SECURITY;
ALTER TABLE tickets FORCE ROW LEVEL SECURITY;
ALTER TABLE ticket_items FORCE ROW LEVEL SECURITY;
ALTER TABLE payments FORCE ROW LEVEL SECURITY;
ALTER TABLE products FORCE ROW LEVEL SECURITY;
ALTER TABLE sent_payments FORCE ROW LEVEL SECURITY;
