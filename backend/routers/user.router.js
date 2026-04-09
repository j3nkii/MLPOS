const express = require('express');
const cognito = require('../modules/cognito');
const pool = require('../modules/pool');
const router = express.Router();

const { MPLOSerr } = require('../modules/errHandle')



router.get('/', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'develop') {
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.mlpos_id]);
            return res.status(200).json({ user: user.rows[0] });
        }
        const cogres = await cognito.getUser(req.body.accessToken);
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [cogres.attributes.email]);
        res.status(200).json({ user: user.rows[0] });
    } catch (err) {
        console.error(err)
        res.status(401).json({ error: 'Invalid token' });
    }
});



module.exports = router;
