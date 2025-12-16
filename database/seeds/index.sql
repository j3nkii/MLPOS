-- Seed Data for Invoice System

-- Insert system users (businesses/staff)
INSERT INTO users (id, username, email, is_deleted, created_at, updated_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'acme_corp', 'contact@acmecorp.com', FALSE, '2024-01-15 09:00:00+00', '2024-01-15 09:00:00+00'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'techstart_solutions', 'hello@techstart.io', FALSE, '2024-02-01 10:30:00+00', '2024-02-01 10:30:00+00'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'design_studio', 'info@designstudio.co', FALSE, '2024-02-20 14:15:00+00', '2024-02-20 14:15:00+00'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'consulting_pro', 'admin@consultingpro.com', FALSE, '2024-03-05 08:45:00+00', '2024-03-05 08:45:00+00'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'creative_agency', 'team@creativeagency.com', FALSE, '2024-03-12 11:20:00+00', '2024-03-12 11:20:00+00');

-- Insert customers for each business
INSERT INTO customers (id, user_id, name, email, phone, is_deleted, created_at, updated_at) VALUES
-- Customers for acme_corp
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'John Smith', 'john.smith@email.com', '+1-555-0101', FALSE, '2024-01-16 10:00:00+00', '2024-01-16 10:00:00+00'),
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sarah Johnson', 'sarah.j@email.com', '+1-555-0102', FALSE, '2024-01-20 14:30:00+00', '2024-01-20 14:30:00+00'),
('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Michael Brown', 'mbrown@email.com', '+1-555-0103', FALSE, '2024-02-05 09:15:00+00', '2024-02-05 09:15:00+00'),

-- Customers for techstart_solutions
('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Emily Davis', 'emily.davis@company.com', '+1-555-0201', FALSE, '2024-02-02 11:00:00+00', '2024-02-02 11:00:00+00'),
('f9eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'David Wilson', 'dwilson@enterprise.com', '+1-555-0202', FALSE, '2024-02-10 15:45:00+00', '2024-02-10 15:45:00+00'),

-- Customers for design_studio
('faeebc99-9c0b-4ef8-bb6d-6bb9bd380abb', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Jessica Martinez', 'jmartinez@startup.io', '+1-555-0301', FALSE, '2024-02-21 10:30:00+00', '2024-02-21 10:30:00+00'),
('fbeebc99-9c0b-4ef8-bb6d-6bb9bd380acc', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Robert Taylor', 'rtaylor@business.com', '+1-555-0302', FALSE, '2024-03-01 13:20:00+00', '2024-03-01 13:20:00+00'),
('fceebc99-9c0b-4ef8-bb6d-6bb9bd380add', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Amanda Lee', 'alee@email.com', '+1-555-0303', FALSE, '2024-03-10 16:00:00+00', '2024-03-10 16:00:00+00'),

-- Customers for consulting_pro
('fdeebc99-9c0b-4ef8-bb6d-6bb9bd380aee', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Christopher Anderson', 'canderson@corp.com', '+1-555-0401', FALSE, '2024-03-06 09:00:00+00', '2024-03-06 09:00:00+00'),
('feeebc99-9c0b-4ef8-bb6d-6bb9bd380aff', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Jennifer White', 'jwhite@organization.org', '+1-555-0402', FALSE, '2024-03-15 12:30:00+00', '2024-03-15 12:30:00+00'),

-- Customers for creative_agency
('ffeebc99-9c0b-4ef8-bb6d-6bb9bd380b00', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Daniel Harris', 'dharris@tech.com', '+1-555-0501', FALSE, '2024-03-13 14:00:00+00', '2024-03-13 14:00:00+00'),
('00febc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Michelle Clark', 'mclark@email.com', '+1-555-0502', FALSE, '2024-03-20 10:45:00+00', '2024-03-20 10:45:00+00');

-- Insert invoices with various statuses
INSERT INTO invoices (id, user_id, customer_id, amount, status, date_sent, is_deleted, created_at, updated_at) VALUES
-- Invoices for acme_corp
('10febc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 150000, 'paid', '2024-01-17 10:00:00+00', FALSE, '2024-01-17 10:00:00+00', '2024-01-25 14:30:00+00'),
('11febc99-9c0b-4ef8-bb6d-6bb9bd380b33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 275000, 'paid', '2024-02-15 09:30:00+00', FALSE, '2024-02-15 09:30:00+00', '2024-02-20 11:00:00+00'),
('12febc99-9c0b-4ef8-bb6d-6bb9bd380b44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 89500, 'pending', '2024-11-15 10:00:00+00', FALSE, '2024-11-15 10:00:00+00', '2024-11-15 10:00:00+00'),
('13febc99-9c0b-4ef8-bb6d-6bb9bd380b55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 320000, 'overdue', '2024-09-10 08:00:00+00', FALSE, '2024-09-10 08:00:00+00', '2024-09-10 08:00:00+00'),

-- Invoices for techstart_solutions
('14febc99-9c0b-4ef8-bb6d-6bb9bd380b66', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 500000, 'paid', '2024-02-05 11:00:00+00', FALSE, '2024-02-05 11:00:00+00', '2024-02-12 16:30:00+00'),
('15febc99-9c0b-4ef8-bb6d-6bb9bd380b77', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 750000, 'pending', '2024-11-10 09:00:00+00', FALSE, '2024-11-10 09:00:00+00', '2024-11-10 09:00:00+00'),
('16febc99-9c0b-4ef8-bb6d-6bb9bd380b88', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'f9eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 425000, 'paid', '2024-03-01 14:00:00+00', FALSE, '2024-03-01 14:00:00+00', '2024-03-08 10:15:00+00'),

-- Invoices for design_studio
('17febc99-9c0b-4ef8-bb6d-6bb9bd380b99', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'faeebc99-9c0b-4ef8-bb6d-6bb9bd380abb', 185000, 'paid', '2024-02-25 10:30:00+00', FALSE, '2024-02-25 10:30:00+00', '2024-03-02 09:00:00+00'),
('18febc99-9c0b-4ef8-bb6d-6bb9bd380baa', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'fbeebc99-9c0b-4ef8-bb6d-6bb9bd380acc', 295000, 'overdue', '2024-08-20 13:00:00+00', FALSE, '2024-08-20 13:00:00+00', '2024-08-20 13:00:00+00'),
('19febc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'fceebc99-9c0b-4ef8-bb6d-6bb9bd380add', 125000, 'pending', '2024-11-18 15:30:00+00', FALSE, '2024-11-18 15:30:00+00', '2024-11-18 15:30:00+00'),

-- Invoices for consulting_pro
('1afebc99-9c0b-4ef8-bb6d-6bb9bd380bcc', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'fdeebc99-9c0b-4ef8-bb6d-6bb9bd380aee', 680000, 'paid', '2024-03-10 09:00:00+00', FALSE, '2024-03-10 09:00:00+00', '2024-03-18 14:00:00+00'),
('1bfebc99-9c0b-4ef8-bb6d-6bb9bd380bdd', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'fdeebc99-9c0b-4ef8-bb6d-6bb9bd380aee', 920000, 'pending', '2024-11-12 10:30:00+00', FALSE, '2024-11-12 10:30:00+00', '2024-11-12 10:30:00+00'),
('1cfebc99-9c0b-4ef8-bb6d-6bb9bd380bee', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'feeebc99-9c0b-4ef8-bb6d-6bb9bd380aff', 540000, 'paid', '2024-10-05 11:00:00+00', FALSE, '2024-10-05 11:00:00+00', '2024-10-15 09:30:00+00'),
('1dfebc99-9c0b-4ef8-bb6d-6bb9bd380bff', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'feeebc99-9c0b-4ef8-bb6d-6bb9bd380aff', 385000, 'cancelled', '2024-07-15 14:00:00+00', FALSE, '2024-07-15 14:00:00+00', '2024-07-20 16:00:00+00'),

-- Invoices for creative_agency
('1efebc99-9c0b-4ef8-bb6d-6bb9bd380c00', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'ffeebc99-9c0b-4ef8-bb6d-6bb9bd380b00', 215000, 'paid', '2024-03-18 14:00:00+00', FALSE, '2024-03-18 14:00:00+00', '2024-03-25 10:00:00+00'),
('1ffebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'ffeebc99-9c0b-4ef8-bb6d-6bb9bd380b00', 465000, 'pending', '2024-11-20 09:00:00+00', FALSE, '2024-11-20 09:00:00+00', '2024-11-20 09:00:00+00'),
('20febc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '00febc99-9c0b-4ef8-bb6d-6bb9bd380b11', 175000, 'paid', '2024-09-12 13:30:00+00', FALSE, '2024-09-12 13:30:00+00', '2024-09-20 11:45:00+00'),
('21febc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '00febc99-9c0b-4ef8-bb6d-6bb9bd380b11', 335000, 'overdue', '2024-09-01 10:00:00+00', FALSE, '2024-09-01 10:00:00+00', '2024-09-01 10:00:00+00');
