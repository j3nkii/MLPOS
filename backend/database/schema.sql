-- system users (the businesses / staff)
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_identification VARCHAR(320) UNIQUE NOT NULL,
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

-- invoices (example POS feature)
DROP TABLE IF EXISTS invoices;
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),       -- business owner
    customer_id UUID NOT NULL REFERENCES customers(id), -- end client
    amount INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, cancelled, overdue
    date_sent TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- optional login creds for customers
-- DROP TABLE IF EXISTS customer_credentials CASCADE;
-- CREATE TABLE customer_credentials (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     customer_id UUID NOT NULL REFERENCES customers(id),
--     email_identification VARCHAR(320) UNIQUE,
--     password_hash TEXT, -- you'll need this if they log in
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
-- );


-- customers (end clients of the businesses)
-- DROP TABLE IF EXISTS customer_relation;
-- CREATE TABLE customer_relation (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user
--     is_deleted BOOLEAN DEFAULT 'false',
--     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
-- );



-- -- link customers to users (mini-CRM per user)
-- DROP TABLE IF EXISTS customer_user_links;
-- CREATE TABLE customer_user_links (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID NOT NULL REFERENCES users(id),
--     customer_id UUID NOT NULL REFERENCES customers(id),
--     UNIQUE (user_id, customer_id)
-- );

-- -- appointments (scheduling feature)
-- DROP TABLE IF EXISTS appointments;
-- CREATE TABLE appointments (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID NOT NULL REFERENCES users(id),
--     customer_id UUID NOT NULL REFERENCES customers(id),
--     start_time TIMESTAMPTZ NOT NULL,
--     end_time TIMESTAMPTZ NOT NULL,
--     notes TEXT,
--     status VARCHAR(50), -- booked, cancelled, completed
--     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
-- );