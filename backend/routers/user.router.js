const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../modules/pool');
const auth = require('../modules/cognito');
const router = express.Router();



router.post('/login', async (req, res) => {
    try {
        const { identity, password } = req.body;
        let identifier = identity;
        const usernameCheck = await pool.query(`
            SELECT * FROM users
            WHERE username = $1
            LIMIT 1
        `, [identifier]);
        if(usernameCheck)
            identifier = usernameCheck.email;
        const tokens = await auth.signIn(identifier, password);
        const decoded = auth.decodeToken(tokens.accessToken);
        const dbRes = await pool.query(`
            SELECT * FROM users
            WHERE cog_id = $1
            LIMIT 1
        `, [decoded.sub]);
        const { rows: [user] } = dbRes;
        console.log(user);
        res.status(200).json({
            tokens,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unknown Error' });
    }
});



router.post('/signup', async(req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            throw new Error('Missing Fields');
        const cogRes = await auth.signUp(email, password);
        console.log(cogRes);
        await pool.query(`
            INSERT INTO users (username, email)
            VALUES ($1, $2)
        `, [username, email]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.code === '23505') {
            if (error.constraint === 'users_username_key')
                return res.status(400).json({ message: 'Username already taken' });
            if (error.constraint === 'users_email_key')
                return res.status(400).json({ message: 'Email already in use' });
        }
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.post('/confirm', async(req, res ) => {
    try {
        const { email, password } = req.body;
        await auth.confirmSignUp(email, password);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;
