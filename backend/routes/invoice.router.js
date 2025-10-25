const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../modules/pool');
const router = express.Router();




router.get('/', async (req, res) => {
    try {
        const userID = req.query.userID;
        const { rows } = await pool.query(`
            SELECT
                invoices.*,
                customers.name
            FROM invoices
            JOIN customers
                ON customers.id = invoices.customer_id
            WHERE invoices.user_id = $1
                AND invoices.is_deleted = false
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
        const { rows: [ user ] } = await pool.query(`
            SELECT * FROM invoices
            WHERE id = $1
                AND is_deleted = false;
        `, [ req.params.id ]);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



router.post('/', async(req, res) => {
    try {
        console.log(req.body);
        const { amount, customerID, userID } = req.body;
        if (!amount || !customerID || !userID) throw new Error('Missing Fields')
        await pool.query(`
            INSERT INTO invoices (amount, customer_id, user_id)
            VALUES ($1, $2, $3);
        `, [ amount, customerID, userID]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.put('/:id', async(req, res) => {
    try {
        const { amount, customerID, status } = req.body;
        const { id: invoiceID } = req.params;
        if(!amount && !customerID && !status) throw new Error('Missing Fields');
        const INSERT_SQL = [];
        const INSERT_PARAMS = [];
        let idx = 2;
        if(amount) {
            INSERT_SQL.push(`amount = $${idx++}`);
            INSERT_PARAMS.push(amount);
        } if(customerID) {
            INSERT_SQL.push(`customer_id = $${idx++}`);
            INSERT_PARAMS.push(customerID);
        } if(status) {
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
        `, [ customerID ]
        );
        res.status(201).json({ message: 'User Deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;