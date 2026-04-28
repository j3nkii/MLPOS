


-- accounts / tennants , used to umbrella users .
DROP TABLE IF EXISTS accounts CASCADE;
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(256) NOT NULL,
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



-- account users
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



-- DROP TABLE IF EXISTS auth_confirmation;
-- CREATE TABLE auth_confirmation (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID NOT NULL REFERENCES users(id),
--     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
-- );



-- customers (end clients of the businesses)
DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255),
    email VARCHAR(320),
    phone VARCHAR(50),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);





-- so tihking about the flow. right? so in general we can break this down into diff entities... ticket, ticket, order, receipt... am i missing any??
-- anyways, so thiking this status can reflect that? draft, quote, pending fufillment, ....(paid and partially paid can be derrived) ... overdue, cancelled ... reopened?
-- fuck this is getting complicated.
-- ECommmerce basically skips the "ticket building" i mean customers will do it on their own... but they pay before fufillment.. vs service based who are typically fufilled before payment.
DROP TYPE IF EXISTS ticket_status_type CASCADE;
CREATE TYPE ticket_status_type AS ENUM (
    'draft',
    'pending',
    'closed',
    'completed'
);

-- TO fight the above problem... im thinking we split into two seprate status's ??? then we can see if tickets have been paid seprately from fufillment. 
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
    'waiting', -- que?
    'in_progress', -- is this where shipped happens? 
    'fufilled',
    'rework',
    'cancelled'
);


DROP TABLE IF EXISTS tickets CASCADE;
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    method      payment_method_type NOT NULL, -- cash, check, venmo, stripe, paypal, cashapp, zelle .... ect.
    alt_id      VARCHAR(50), -- id's or payment no's from alternate payment methods. (stripe will be default) ... maybe stripe ID goes here too? 
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



DROP TYPE IF EXISTS product_type CASCADE;
CREATE TYPE product_type AS ENUM (
    'service',
    'physical'
);
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    description     VARCHAR(255),
    product_type    VARCHAR(255),
    price INTEGER   NOT NULL,
    wholesale_price INTEGER,
    internal_sku    VARCHAR(50) NOT NULL, -- maybe define default sku system for mlpos inventory.
    external_sku    VARCHAR(50) NOT NULL,

    api_available   BOOLEAN DEFAULT false NOT NULL, -- weather or not this can be booked or sold online
    is_bookable     BOOLEAN DEFAULT false NOT NULL, -- may be redundant. 
    is_shippable    BOOLEAN DEFAULT false NOT NULL, -- will this need to be shipped at some point?
    
    is_deleted  BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- -- Add this for mechanics (or post-MVP) via claude
-- DROP TABLE IF EXISTS inventory_transactions CASCADE;
-- CREATE TABLE inventory_transactions (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     product_id UUID NOT NULL REFERENCES products(id),
--     quantity_delta INTEGER NOT NULL, -- +/- amount
--     type VARCHAR(50) NOT NULL, -- 'sale', 'restock', 'adjustment'
--     ticket_line_item_id UUID REFERENCES ticket_items(id),
--     notes TEXT,
--     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
-- );
