const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT
                appointments.*,
                customers.name
            FROM appointments
            JOIN tickets
                ON tickets.id = appointments.ticket_id
                AND tickets.is_deleted = false
            JOIN customers
                ON customers.id = tickets.customer_id
                AND customers.is_deleted = false
            WHERE appointments.is_deleted = false
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
            INSERT INTO appointments (book_start, book_end, ticket_id)
            VALUES ($1, $2, $3)
        `, [ book_start, book_end, ticket_id ]);
        await req.db.query('COMMIT');
        res.status(201).json({ message: 'Appointment created successfully' });
    } catch (error) {
        await req.db.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { book_start, book_end, appointment_status } = req.body;
        if(!id) throw new Error('Missing ID');
        if(!book_start && !book_end && !appointment_status) throw new Error('Missing Essential fields');
        await req.db.query('BEGIN');
        await req.db.query(`
           UPDATE appointments
           SET book_end = $1, book_start = $2, appointment_status = $3
           WHERE id = $4 
        `, [ book_start, book_end, appointment_status, id ]);
        await req.db.query('COMMIT');
        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
        await req.db.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await req.db.query(`
            UPDATE appointments
            SET is_deleted = true
            WHERE id = $1
        `, [id]);
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;
