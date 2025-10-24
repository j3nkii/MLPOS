const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../modules/pool');
const router = express.Router();



router.post('/', async (req, res) => {
    try {
        // first user will be the user used to interact with the web app durring v0.
        const dbRes = await pool.query(`
            SELECT * FROM users
            WHERE username = $1
            LIMIT 1
        `, [req.body.username]);
        const { rows: [user] } = dbRes;
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unknown Error' });
    }
});



router.post('/', async(req, res) => {
    try {
        const { username, email } = req.body;
        if(!username || !email) throw new Error('Missing Fields')
        await pool.query(`
            INSERT INTO users (username, email)
            VALUES ($1, $2)
        `, [username, email]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // console.error(error);
        if (error.code === '23505') {
            if (error.constraint === 'users_username_key') {
                return res.status(400).json({ message: 'Username already taken' });
            }
            if (error.constraint === 'users_email_key') {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;