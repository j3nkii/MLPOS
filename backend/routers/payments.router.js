const express = require('express');
const router = express.Router();
const { handleTicketStatus } = require('../models/ticket.model');

async function ticketInAccount(db, ticketID, accountId) {
    const { rowCount } = await db.query(
        'SELECT 1 FROM tickets WHERE id = $1 AND account_id = $2 AND is_deleted = false',
        [ticketID, accountId]
    );
    return rowCount > 0;
}

router.post('/', async (req, res) => {
    try {
        const { ticketID, price, method } = req.body;
        if (!(await ticketInAccount(req.db, ticketID, req.accountId))) {
            return res.status(404).json({ success: false });
        }
        await req.db.query('BEGIN');
        await req.db.query(
            'INSERT INTO payments (ticket_id, price, method) VALUES ($1, $2, $3)',
            [ticketID, price, method]
        );
        await handleTicketStatus({ client: req.db, ticketID });
        await req.db.query('COMMIT');
        res.status(200).json({ success: true });
    } catch (err) {
        await req.db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ success: false });
    }
});

router.put('/', async (req, res) => {
    try {
        const { price, method, paymentID } = req.body;
        const params = [paymentID, req.accountId];
        let idx = 3;
        const sets = [];
        if (price !== undefined && price !== null) {
            sets.push(`price = $${idx++}`);
            params.push(price);
        }
        if (method) {
            sets.push(`method = $${idx++}`);
            params.push(method);
        }
        if (!sets.length) throw new Error('No fields to update');

        await req.db.query('BEGIN');
        const { rows, rowCount } = await req.db.query(`
            UPDATE payments p
            SET ${sets.join(', ')}
            FROM tickets t
            WHERE p.id = $1 AND p.ticket_id = t.id AND t.account_id = $2
            RETURNING p.ticket_id AS ticket_id
        `, params);

        if (!rowCount) {
            await req.db.query('ROLLBACK');
            return res.status(404).json({ success: false });
        }
        await handleTicketStatus({ client: req.db, ticketID: rows[0].ticket_id });
        await req.db.query('COMMIT');
        res.status(200).json({ success: true });
    } catch (err) {
        await req.db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ success: false });
    }
});

router.delete('/:paymentID', async (req, res) => {
    try {
        const { paymentID } = req.params;
        await req.db.query('BEGIN');
        const { rows, rowCount } = await req.db.query(`
            UPDATE payments
            SET is_deleted = true
            WHERE id = $1
              AND EXISTS (
                SELECT 1 FROM tickets t
                WHERE t.id = payments.ticket_id
                  AND t.account_id = $2
              )
            RETURNING ticket_id
        `, [paymentID, req.accountId]);

        if (!rowCount) {
            await req.db.query('ROLLBACK');
            return res.status(404).json({ success: false });
        }
        await handleTicketStatus({ client: req.db, ticketID: rows[0].ticket_id });
        await req.db.query('COMMIT');
        res.status(200).json({ success: true });
    } catch (err) {
        await req.db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
