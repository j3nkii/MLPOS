-- accounts / tennants , used to umbrella users .
DROP TABLE IF EXISTS accounts CASCADE;
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



DROP TABLE IF EXISTS auth_confirmation;
CREATE TABLE auth_confirmation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)



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



-- invoices, to contain: details(line items), payments.
DROP TABLE IF EXISTS invoices CASCADE;
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    status VARCHAR(50) DEFAULT 'quote', -- quote/draft?, pending/sent?, paid, cancelled, overdue
    date_sent TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



DROP TABLE IF EXISTS invoice_line_items CASCADE;
CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoices_id UUID NOT NULL REFERENCES invoices(id),
    name VARCHAR(257),
    quantity INTEGER,
    price INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



DROP TABLE IF EXISTS payments CASCADE;
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoices_id UUID NOT NULL REFERENCES invoices(id),
    price INTEGER NOT NULL,
    method VARCHAR(50) NOT NULL, -- cash, check, venmo, stripe, paypal, cashapp, zelle .... ect.
    alt_id VARCHAR(50), -- id's or payment no's from alternate payment methods. (stripe will be default) ... maybe stripe ID goes here too? 
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price INTEGER NOT NULL,
    unit VARCHAR(50) NOT NULL -- single, gram, oz, pound, ..ect,
    wholesale_price INTEGER,
    internal_sku VARCHAR(50) NOT NULL, -- maybe define default sku system for mlpos inventory.
    external_sku VARCHAR(50) NOT NULL,
    api_available BOOLEAN DEFAULT false NOT NULL, -- weather or not this can be booked or sold online
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- Add this for mechanics (or post-MVP) via claude
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity_delta INTEGER NOT NULL, -- +/- amount
    type VARCHAR(50) NOT NULL, -- 'sale', 'restock', 'adjustment'
    invoice_line_item_id UUID REFERENCES invoice_line_items(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
