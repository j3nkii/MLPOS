

-- accounts / tenants — umbrella for users and business data
DROP TABLE IF EXISTS accounts CASCADE;
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(256) NOT NULL,
    slug VARCHAR(63) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



DROP TABLE IF EXISTS accounts_stripe CASCADE;
CREATE TABLE accounts_stripe (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id          UUID NOT NULL REFERENCES accounts(id),
    stripe_account_id   VARCHAR(255) UNIQUE NOT NULL,
    merchant_enabled    BOOLEAN DEFAULT FALSE,
    charges_enabled     BOOLEAN DEFAULT FALSE,
    payouts_enabled     BOOLEAN DEFAULT FALSE,
    details_submitted   BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    role VARCHAR(320) NOT NULL DEFAULT 'primary',
    username VARCHAR(320) UNIQUE NOT NULL,
    email VARCHAR(320) UNIQUE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255),
    email VARCHAR(320),
    phone VARCHAR(50),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



DROP TYPE IF EXISTS ticket_invoice_status CASCADE;
CREATE TYPE ticket_invoice_status AS ENUM (
    'quote',
    'sent',
    'partially_paid',
    'overdue',
    'paid',
    'cancelled'
);

DROP TYPE IF EXISTS ticket_order_status CASCADE;
CREATE TYPE ticket_order_status AS ENUM (
    'waiting',
    'in_progress',
    'fufilled',
    'rework',
    'cancelled'
);


DROP TYPE IF EXISTS product_type CASCADE;
CREATE TYPE product_type AS ENUM (
    'service',
    'physical'
);
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    name            VARCHAR(255) NOT NULL,
    description     VARCHAR(255),
    product_type    product_type,
    price           INTEGER NOT NULL,
    wholesale_price INTEGER,
    internal_sku    VARCHAR(50),
    external_sku    VARCHAR(50),
    api_available   BOOLEAN DEFAULT false NOT NULL,
    is_bookable     BOOLEAN DEFAULT false NOT NULL,
    is_shippable    BOOLEAN DEFAULT false NOT NULL,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS tickets CASCADE;
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    user_id UUID NOT NULL REFERENCES users(id),
    customer_id UUID REFERENCES customers(id),
    invoice_status ticket_invoice_status DEFAULT 'quote',
    order_status ticket_order_status DEFAULT 'waiting',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



DROP TABLE IF EXISTS ticket_items CASCADE;
CREATE TABLE ticket_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id),
    product_id UUID REFERENCES products(id),
    name VARCHAR(257),
    quantity INTEGER,
    price INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


DROP TYPE IF EXISTS payment_method_type CASCADE;
CREATE TYPE payment_method_type AS ENUM (
    'cash',
    'check',
    'venmo',
    'cash app',
    'square',
    'paypal',
    'zelle',
    'bitcoin',
    'stripe'
);
DROP TABLE IF EXISTS payments CASCADE;
CREATE TABLE payments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id   UUID NOT NULL REFERENCES tickets(id),
    price       INTEGER NOT NULL,
    method      payment_method_type NOT NULL,
    alt_id      VARCHAR(50),
    is_deleted  BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



DROP TABLE IF EXISTS sent_payments CASCADE;
CREATE TABLE sent_payments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id               UUID NOT NULL REFERENCES tickets(id),
    is_deleted BOOLEAN      DEFAULT FALSE,
    created_at TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);



CREATE INDEX idx_customers_account_id ON customers(account_id);
CREATE INDEX idx_tickets_account_id ON tickets(account_id);
CREATE INDEX idx_products_account_id ON products(account_id);
CREATE INDEX idx_ticket_items_ticket_id ON ticket_items(ticket_id);
CREATE INDEX idx_payments_ticket_id ON payments(ticket_id);


-- Tenant lock: app must SET app.account_id per request (see tenant.middleware.js)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_payments ENABLE ROW LEVEL SECURITY;

ALTER TABLE customers FORCE ROW LEVEL SECURITY;
ALTER TABLE tickets FORCE ROW LEVEL SECURITY;
ALTER TABLE ticket_items FORCE ROW LEVEL SECURITY;
ALTER TABLE payments FORCE ROW LEVEL SECURITY;
ALTER TABLE products FORCE ROW LEVEL SECURITY;
ALTER TABLE sent_payments FORCE ROW LEVEL SECURITY;

CREATE POLICY customers_tenant ON customers
    USING (account_id = current_setting('app.account_id', true)::uuid);

CREATE POLICY tickets_tenant ON tickets
    USING (account_id = current_setting('app.account_id', true)::uuid);

CREATE POLICY ticket_items_tenant ON ticket_items
    USING (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = ticket_items.ticket_id
              AND t.account_id = current_setting('app.account_id', true)::uuid
        )
    );

CREATE POLICY payments_tenant ON payments
    USING (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = payments.ticket_id
              AND t.account_id = current_setting('app.account_id', true)::uuid
        )
    );

CREATE POLICY products_tenant ON products
    USING (account_id = current_setting('app.account_id', true)::uuid);

CREATE POLICY sent_payments_tenant ON sent_payments
    USING (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = sent_payments.ticket_id
              AND t.account_id = current_setting('app.account_id', true)::uuid
        )
    );
