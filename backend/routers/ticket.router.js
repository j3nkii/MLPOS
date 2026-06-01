const express = require('express');
const router = express.Router();
const stripeModule = require('../modules/stripe');

router.get('/', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT
                tickets.*,
                customers.name,
                SUM(ticket_items.price * ticket_items.quantity) as price,
                COALESCE(JSON_AGG(ticket_items) FILTER (WHERE ticket_items.ticket_id IS NOT NULL), '[]') as details,
                COALESCE((
                    WITH payments_clone AS (
                        SELECT * FROM payments
                        WHERE ticket_id = tickets.id
                            AND is_deleted = false
                        ORDER BY created_at DESC
                    )
                    SELECT JSON_AGG(payments_clone.*) AS reults
                    FROM payments_clone
                ), '[]') AS payments
            FROM tickets
            LEFT JOIN ticket_items
                ON ticket_items.ticket_id = tickets.id
                AND ticket_items.is_deleted = false
            LEFT JOIN products
                ON ticket_items.product_id = products.id
            JOIN customers
                ON customers.id = tickets.customer_id
                AND customers.is_deleted = false
            WHERE tickets.account_id = $1
                AND tickets.is_deleted = false
            GROUP BY tickets.id, customers.name
            ORDER BY tickets.created_at DESC
        `, [req.accountId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { customerID } = req.body;
        const { rows: [result] } = await req.db.query(`
            INSERT INTO tickets (customer_id, user_id, account_id)
            VALUES ($1, $2, $3)
            RETURNING id
        `, [customerID, req.userId, req.accountId]);
        res.status(201).json({ message: 'Ticket created', data: { ticketID: result.id } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { customerID, status, invoice_status } = req.body;
        const invoiceStatus = invoice_status ?? status;
        const { id: ticketID } = req.params;
        const sets = [];
        const params = [ticketID, req.accountId];
        let idx = 3;
        if (customerID) {
            sets.push(`customer_id = $${idx++}`);
            params.push(customerID);
        }
        if (invoiceStatus) {
            sets.push(`invoice_status = $${idx++}`);
            params.push(invoiceStatus);
        }
        if (!sets.length) throw new Error('No fields to update');
        const { rowCount } = await req.db.query(`
            UPDATE tickets SET ${sets.join(', ')}
            WHERE id = $1 AND account_id = $2
        `, params);
        if (!rowCount) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Ticket updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { rowCount } = await req.db.query(`
            UPDATE tickets SET is_deleted = true
            WHERE id = $1 AND account_id = $2
        `, [req.params.id, req.accountId]);
        if (!rowCount) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.post('/ticket-item/:id', async (req, res) => {
    try {
        const { name, price, quantity, productID } = req.body;
        const ticketID = req.params.id;
        if (!ticketID || (!productID && !name) || price == null || !quantity) {
            throw new Error('Missing essential fields');
        }
        const { rowCount } = await req.db.query(
            'SELECT 1 FROM tickets WHERE id = $1 AND account_id = $2',
            [ticketID, req.accountId]
        );
        if (!rowCount) return res.status(404).json({ message: 'Ticket not found' });

        await req.db.query(
            `INSERT INTO ticket_items (ticket_id, name, price, quantity, product_id)
             VALUES ($1, $2, $3, $4, $5)`,
            [ticketID, name, price, quantity, productID || null]
        );
        res.status(200).json({ message: 'Line item created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.put('/ticket-item/:id', async (req, res) => {
    try {
        const { name, price, quantity, productID } = req.body;
        const lineItemID = req.params.id;
        const sets = [];
        const params = [lineItemID, req.accountId];
        let idx = 3;
        if (name) {
            sets.push(`name = $${idx++}`);
            params.push(name);
        }
        if (price != null) {
            sets.push(`price = $${idx++}`);
            params.push(price);
        }
        if (quantity != null) {
            sets.push(`quantity = $${idx++}`);
            params.push(quantity);
        }
        if (productID) {
            sets.push(`product_id = $${idx++}`);
            params.push(productID);
        }
        if (!sets.length) throw new Error('No fields to update');

        const { rowCount } = await req.db.query(`
            UPDATE ticket_items ti
            SET ${sets.join(', ')}
            FROM tickets t
            WHERE ti.id = $1 AND ti.ticket_id = t.id AND t.account_id = $2
        `, params);
        if (!rowCount) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Line item updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.delete('/ticket-item/:id', async (req, res) => {
    try {
        const { rowCount } = await req.db.query(`
            UPDATE ticket_items ti
            SET is_deleted = true
            FROM tickets t
            WHERE ti.id = $1 AND ti.ticket_id = t.id AND t.account_id = $2
        `, [req.params.id, req.accountId]);
        if (!rowCount) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Line item deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.post('/send/:id', async (req, res) => {
    try {
        const ticketID = req.params.id;
        const { stripe_account_id } = req.user.attributes;
        if (!stripe_account_id) {
            return res.status(400).json({ message: 'Stripe account not connected' });
        }

        await req.db.query('BEGIN');
        const { rows: [ticketFull] } = await req.db.query(`
            SELECT
                tickets.*,
                customers.name,
                customers.email,
                SUM(ticket_items.price * ticket_items.quantity) as price,
                COALESCE(JSON_AGG(ticket_items) FILTER (WHERE ticket_items.ticket_id IS NOT NULL), '[]') as details
            FROM tickets
            LEFT JOIN ticket_items
                ON ticket_items.ticket_id = tickets.id
                AND ticket_items.is_deleted = false
            JOIN customers
                ON customers.id = tickets.customer_id
                AND customers.is_deleted = false
            WHERE tickets.id = $1
                AND tickets.account_id = $2
                AND tickets.is_deleted = false
            GROUP BY tickets.id, customers.name, customers.email
        `, [ticketID, req.accountId]);

        if (!ticketFull) {
            await req.db.query('ROLLBACK');
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const line_items = (ticketFull.details || []).map((item) => ({
            quantity: item.quantity,
            price_data: {
                currency: 'usd',
                unit_amount: item.price,
                product_data: { name: item.name },
            },
        }));

        await req.db.query(`INSERT INTO sent_payments (ticket_id) VALUES ($1)`, [ticketID]);
        await req.db.query(`UPDATE tickets SET invoice_status = 'sent' WHERE id = $1`, [ticketID]);
        const paymentLink = await stripeModule.createPaymentLink({
            destination: stripe_account_id,
            line_items,
        });
        await req.db.query('COMMIT');
        res.status(201).json(paymentLink);
    } catch (error) {
        await req.db.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;
