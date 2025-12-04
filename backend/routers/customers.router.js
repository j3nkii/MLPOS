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
                customers.*,
                JSON_AGG( invoices.* ) as invoices
            FROM customers
            LEFT JOIN invoices
                ON invoices.customer_id = customers.id
                AND invoices.is_deleted = false
            WHERE customers.user_id = $1
                AND customers.is_deleted = false
            GROUP BY customers.id;
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
            SELECT * FROM customers
            WHERE id = $1 AND is_deleted = false
        `, [ req.params.id ]);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



router.post('/', async(req, res) => {
    try {
        const { name, email, phone, userID } = req.body;
        if(!name || !email || !phone) throw new Error('Missing Fields')
        await pool.query(`
            INSERT INTO customers (name, email, phone, user_id)
            VALUES ($1, $2, $3, $4)
        `, [ name, email, phone, userID ]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.put('/:id', async(req, res) => {
    try {
        const { name, email, phone } = req.body;
        const { id: customerID } = req.params;
        if(!name && !email && !phone) throw new Error('Missing Fields');
        const INSERT_SQL = [];
        const INSERT_PARAMS = [];
        let idx = 2;
        if(name) {
            INSERT_SQL.push(`name = $${idx++}`);
            INSERT_PARAMS.push(name);
        } if(email) {
            INSERT_SQL.push(`email = $${idx++}`);
            INSERT_PARAMS.push(email);
        } if(phone) {
            INSERT_SQL.push(`phone = $${idx++}`);
            INSERT_PARAMS.push(phone);
        }
        const END_SQL = `
            UPDATE CUSTOMERS
            SET ${INSERT_SQL.join(', ')}
            WHERE
                customers.id = $1
        `
        const END_PARAMS = [ customerID, ...INSERT_PARAMS ]
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
            UPDATE CUSTOMERS
            SET is_deleted = true
            WHERE
                customers.id = $1
        `, [ customerID ]
        );
        res.status(201).json({ message: 'User Deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;