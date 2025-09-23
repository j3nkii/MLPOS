const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../modules/pool');
const router = express.Router();

const TEMP_USER_ID = '52d9665a-3187-4b0c-8316-487784bf84a0'



router.get('/', async (req, res) => {
    try {
        const userID = TEMP_USER_ID;
        const { rows } = await pool.query(`
            SELECT * FROM customers
            WHERE user_id = $1
        `, [ userID ]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unknown Error' });
    }
});



router.get('/:id', async (req, res) => {
    try {
        const { rows: [ user ] } = await pool.query(`
            SELECT * FROM customers
            WHERE id = $1
        `, [ req.params.id ]);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unknown Error' });
    }
});



router.post('/', async(req, res) => {
    try {
        const { name, email, phone } = req.body;
        if(!name || !email || !phone) throw new Error('Missing Fields')
        await pool.query(`
            INSERT INTO customers (name, email, phone)
            VALUES ($1, $2, $3)
        `, [ name, email, phone ]
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
        const { id: customerID } = req.params.id;
        const userID = TEMP_USER_ID;
        if(!name || !email || !phone) throw new Error('Missing Fields');
        const INSERT_SQL = [];
        const INSERT_PARAMS = [];
        let idx = 2;
        if(name)
            INSERT_SQL.push(`name = ${idx++}`);
            INSERT_PARAMS.push(name);
        if(email)
            INSERT_SQL.push(`email = ${idx++}`);
            INSERT_PARAMS.push(email);
        if(phone)
            INSERT_SQL.push(`phone = ${idx++}`);
            INSERT_PARAMS.push(phone);

        await pool.query(`
            UPDATE CUSTOMERS
            SET ${INSERT_SQL.join(' ')}
            WHERE
                customers.id = $1 AND user_id = $2
        `, [ customerID, userID, ...INSERT_PARAMS ]
        );
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.delete('/:id', async(req, res) => {
    try {
        const { id: customerID } = req.params.id;
        const userID = TEMP_USER_ID;
        await pool.query(`
            UPDATE CUSTOMERS
            SET is_deleted = 'true'
            WHERE
                customers.id = $1 AND user_id = $2
        `, [ customerID, userID ]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;