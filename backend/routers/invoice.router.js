const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../modules/pool');
const router = express.Router();




router.get('/', async (req, res) => {
    try {
        const userID = req.user.attributes.mlpos_id;
        const { rows } = await pool.query(`
            SELECT
                invoices.*,
                customers.name,
                COALESCE(JSON_AGG(invoices_details) FILTER (WHERE invoices_details.invoices_id IS NOT NULL), '[]') as details
            FROM invoices
            LEFT JOIN invoices_details
                ON invoices_details.invoices_id = invoices.id
                AND invoices_details.is_deleted = false
            JOIN customers
                ON customers.id = invoices.customer_id
            WHERE invoices.user_id = $1
                AND invoices.is_deleted = false
            GROUP BY invoices.id, customers.name
            ORDER BY created_at DESC;
        `, [ userID ]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



router.get('/:id', async (req, res) => {
    try {
        const { rows: [ invoice ] } = await pool.query(`
            SELECT
                *,
                JSON_AGG(invoice_details)
            FROM invoices
            JOIN invoice_details
                ON invoice_details.invoices_id = invoices.id
                AND invoice_details.is_deleted = false
            WHERE id = $1
                AND is_deleted = false;
        `, [ req.params.id ]);
        console.log(invoice)
        res.status(200).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



router.post('/', async(req, res) => {
    const client = await pool.connect();
    try {
        const userID = req.user.attributes.mlpos_id;
        const { details, customerID } = req.body;
        if (!details || !customerID) throw new Error('Missing Fields');
        console.log(details);
        let invoiceTotal = 0;
        details.forEach(detail => {
            invoiceTotal += Number(detail.amount);
        });
        await client.query('BEGIN');
        await client.query(`
            INSERT INTO invoices (amount, customer_id, user_id)
            VALUES ($1, $2, $3);
        `, [ invoiceTotal, customerID, userID]
        );
        await client.query('COMMIT');
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.put('/:id', async(req, res) => {
    try {
        const { amount, customerID, status } = req.body;
        console.log(req.body)
        console.log(req.params)
        const { id: invoiceID } = req.params;
        if(!amount && !customerID && !status) throw new Error('Missing Fields');
        const INSERT_SQL = [];
        const INSERT_PARAMS = [];
        let idx = 2;
        if (amount) {
            INSERT_SQL.push(`amount = $${idx++}`);
            INSERT_PARAMS.push(amount);
        } if (customerID) {
            INSERT_SQL.push(`customer_id = $${idx++}`);
            INSERT_PARAMS.push(customerID);
        } if (status) {
            INSERT_SQL.push(`status = $${idx++}`);
            INSERT_PARAMS.push(status);
        }
        const END_SQL = `
            UPDATE invoices
            SET ${INSERT_SQL.join(', ')}
            WHERE
                invoices.id = $1;
        `
        const END_PARAMS = [ invoiceID, ...INSERT_PARAMS ];
        await pool.query(END_SQL, END_PARAMS);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.delete('/:id', async(req, res) => {
    try {
        const { id: customerID } = req.params;
        await pool.query(`
            UPDATE invoices
            SET is_deleted = true
            WHERE
                invoices.id = $1
        `, [ customerID ]);
        res.status(201).json({ message: 'User Deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;