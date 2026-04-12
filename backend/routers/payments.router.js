const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


// right now invoices will be in charge of fetching most of this data.
// this will be used for reporting in the future.... should there be a reporting route...? no, probbs not.
// router.get('/', async (req, res) => {
//     try {
//         const { mplos_id } = req.user;
//         const { rows } = await pool.query(`
//             SELECT * FROM payments
//             JOIN invoices ON 
//                 invoices.id = payments.invoices_id
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
            'INSERT INTO payments (invoices_id, price, method) VALUES ($1, $2, $3)',
            [invoiceID, price, method]
        );
        let totalPaid = 0;
        const { rows:  [ invoice ] } = await client.query('SELECT * FROM invoices WHERE id = $1', [invoiceID]);
        const { rows: paymentsRows } = await client.query(`SELECT * FROM payments WHERE invoices_id = $1 AND is_deleted = 'false'`, [invoiceID]);
        for(let row of paymentsRows){
            totalPaid += row.price;
        }
        if(invoice.price <= totalPaid){
            await client.query(`UPDATE invoice SET status = 'paid' WHERE id = $1`);
        } else {
            // not sure how were going to handle refunds. refund will probably be a sperate payment with negative price. will need to configure rules for automated status setting (pending, paid overdue ect.)
            // await client.query(`UPDATE invoice SET status = 'pending' WHERE id = $1`);
        }
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



router.put('/:paymentID', async (req, res) => {
    const client = await pool.connect();
    try {
        const { price, method } = req.body;
        const { paymentID, } = req.params;
        await client.query('BEGIN');
        let updateSQL = [];
        const updateParams = [paymentID];
        if(price){
            updateParams.push(price);
            updateSQL.push(`price = ${updateParams.length}`);
        }
        if(method){
            updateParams.push(method);
            updateSQL.push(`method = ${updateParams.length}`);
        }
        const {rows: [{ invoices_ID: invoiceID }]} = await client.query(`
            UPDATE payments
            SET ${updateSQL.join(', ')}
            WHERE id = $1
            RETURNING invoices_id;
            `, updateParams
        );
        let totalPaid = 0;
        const { rows:  [ invoice ] } = await client.query('SELECT * FROM invoices WHERE id = $1', [invoiceID]);
        const { rows: paymentsRows } = await client.query(`SELECT * FROM payments WHERE invoices_id = $1 AND id_deleted = 'false'`, [invoiceID]);
        for(let row of paymentsRows){
            totalPaid += row.price;
        }
        if(invoice.price <= totalPaid){
            await client.query(`UPDATE invoice SET status = 'pending' WHERE id = $1`);
        }
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
        const {rows: [{ invoices_ID: invoiceID }]} = await client.query(`
            UPDATE payments
            SET is_deleted = 'false'
            WHERE id = $1
            RETURNING invoices_id;
            `, [paymentID]
        );
        let totalPaid = 0;
        const { rows:  [ invoice ] } = await client.query('SELECT * FROM invoices WHERE id = $1', [invoiceID]);
        const { rows: paymentsRows } = await client.query(`SELECT * FROM payments WHERE invoices_id = $1 AND id_deleted = 'false'`, [invoiceID]);
        for(let row of paymentsRows){
            totalPaid += row.price;
        }
        if(invoice.price <= totalPaid){
            await client.query(`UPDATE invoice SET status = 'pending' WHERE id = $1`);
        }
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
