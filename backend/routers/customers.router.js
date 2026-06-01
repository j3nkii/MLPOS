const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT
                customers.*,
                JSON_AGG(tickets.*) AS tickets
            FROM customers
            LEFT JOIN tickets
                ON tickets.customer_id = customers.id
                AND tickets.is_deleted = false
            WHERE customers.account_id = $1
                AND customers.is_deleted = false
            GROUP BY customers.id
            ORDER BY customers.created_at;
        `, [req.accountId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { rows: [customer] } = await req.db.query(`
            SELECT * FROM customers
            WHERE id = $1 AND account_id = $2 AND is_deleted = false
        `, [req.params.id, req.accountId]);
        if (!customer) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) throw new Error('Missing Fields');
        await req.db.query(`
            INSERT INTO customers (name, email, phone, account_id, user_id)
            VALUES ($1, $2, $3, $4, $5)
        `, [name, email, phone, req.accountId, req.userId]);
        res.status(201).json({ message: 'Customer created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const { id: customerID } = req.params;
        if (!name && !email && !phone) throw new Error('Missing Fields');
        const INSERT_SQL = [];
        const INSERT_PARAMS = [];
        let idx = 3;
        if (name) {
            INSERT_SQL.push(`name = $${idx++}`);
            INSERT_PARAMS.push(name);
        }
        if (email) {
            INSERT_SQL.push(`email = $${idx++}`);
            INSERT_PARAMS.push(email);
        }
        if (phone) {
            INSERT_SQL.push(`phone = $${idx++}`);
            INSERT_PARAMS.push(phone);
        }
        const { rowCount } = await req.db.query(`
            UPDATE customers
            SET ${INSERT_SQL.join(', ')}
            WHERE id = $1 AND account_id = $2
        `, [customerID, req.accountId, ...INSERT_PARAMS]);
        if (!rowCount) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { rowCount } = await req.db.query(`
            UPDATE customers
            SET is_deleted = true
            WHERE id = $1 AND account_id = $2
        `, [req.params.id, req.accountId]);
        if (!rowCount) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;
