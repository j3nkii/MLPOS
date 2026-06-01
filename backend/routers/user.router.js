const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { rows: [user] } = await req.db.query(
            'SELECT * FROM users WHERE id = $1 AND account_id = $2',
            [req.userId, req.accountId]
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;
