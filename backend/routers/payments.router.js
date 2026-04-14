const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { handleInvoiceStatus } = require('../models/invoice.model');


// right now invoices will be in charge of fetching most of this data.
// this will be used for reporting in the future.... should there be a reporting route...? no, probbs not.
// router.get('/', async (req, res) => {
//     try {
//         const { mplos_id } = req.user;
//         const { rows } = await pool.query(`
//             SELECT * FROM payments
//             JOIN invoices ON 
//                 invoices.id = payments.invoice_id
//             AND user_id = $1
//         `, [mplos_id])
//         res.status(200).json({ success: true, data: rows});
//     } catch (err) {
//         console.error(err);
//         res.status(401).json({ success: false });
//     }
// });



router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const { invoiceID, price, method } = req.body;
        await client.query('BEGIN');
        await client.query(
            'INSERT INTO payments (invoice_id, price, method) VALUES ($1, $2, $3)',
            [invoiceID, price, method]
        );
        await handleInvoiceStatus({ client, invoiceID });
        await client.query('COMMIT');
        res.status(200).json({ success: true});
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ success: false });
    } finally {
        client.release();
    }
});



router.put('/', async (req, res) => {
    const client = await pool.connect();
    try {
        console.log(req.body)
        const { price, method, paymentID } = req.body;
        await client.query('BEGIN');
        let updateSQL = [];
        const updateParams = [paymentID];
        if(price){
            updateParams.push(price);
            updateSQL.push(`price = $${updateParams.length}`);
        }
        if(method){
            updateParams.push(method);
            updateSQL.push(`method = $${updateParams.length}`);
        }
        const {rows: [{ invoice_id: invoiceID }]} = await client.query(`
            UPDATE payments
            SET ${updateSQL.join(', ')}
            WHERE id = $1
            RETURNING invoice_id;
            `, updateParams
        );
        await handleInvoiceStatus({ client, invoiceID });
        await client.query('COMMIT');
        res.status(200).json({ success: true});
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(401).json({ success: false });
    } finally {
        client.release();
    }
});



router.delete('/:paymentID', async (req, res) => {
    const client = await pool.connect();
    try {
        const { paymentID } = req.params;
        await client.query('BEGIN');
        const {rows: [{ invoice_id: invoiceID }]} = await client.query(`
            UPDATE payments
            SET is_deleted = true
            WHERE id = $1
            RETURNING invoice_id;
            `, [paymentID]
        );
        await handleInvoiceStatus({ client, invoiceID });
        await client.query('COMMIT');
        res.status(200).json({ success: true});
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(401).json({ success: false });
    } finally {
        client.release();
    }
});



module.exports = router;
