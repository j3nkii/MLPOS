const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT * FROM bookings
            WHERE is_deleted = false
            ORDER BY created_at DESC;
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



router.post('/', async (req, res) => {
    const { book_start, book_end, ticket_id } = req.body;
    try {
        await req.db.query('BEGIN');
        await req.db.query(`
            INSERT INTO bookings (book_start, book_end, ticket_id)
            VALUES ($1, $2, $3)
        `, [ book_start, book_end, ticket_id ]);
        await req.db.query('COMMIT');
        res.status(201).json({ message: 'Booking created successfully' });
    } catch (error) {
        await req.db.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // TODO: destructure req.body and build dynamic update
        await req.db.query('COMMIT');
        res.status(200).json({ message: 'Booking updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await req.db.query(`
            UPDATE bookings
            SET is_deleted = true
            WHERE id = $1
        `, [id]);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;
