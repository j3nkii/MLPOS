const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../modules/pool');
const router = express.Router();




router.get('/', async (req, res) => {
    try {
        const userID = req.user.attributes.mlpos_id;
        const { rows } = await pool.query(`
            SELECT
                invoices.*,
                customers.name,
                COALESCE(JSON_AGG(invoices_details) FILTER (WHERE invoices_details.invoices_id IS NOT NULL), '[]') as details
            FROM invoices
            LEFT JOIN invoices_details
                ON invoices_details.invoices_id = invoices.id
                AND invoices_details.is_deleted = false
            JOIN customers
                ON customers.id = invoices.customer_id
            WHERE invoices.user_id = $1
                AND invoices.is_deleted = false
            GROUP BY invoices.id, customers.name
            ORDER BY created_at DESC;
        `, [ userID ]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


// CURRENTLY GET / FETCHES ALL DATA, SO FRONT END DOES NOT NEED A "DETAILED" VIEW
// router.get('/:id', async (req, res) => {
//     try {
//         const { rows: [ invoice ] } = await pool.query(`
//             SELECT
//                 *,
//                 JSON_AGG(invoice_details)
//             FROM invoices
//             JOIN invoice_details
//                 ON invoice_details.invoices_id = invoices.id
//                 AND invoice_details.is_deleted = false
//             WHERE id = $1
//                 AND is_deleted = false;
//         `, [ req.params.id ]);
//         console.log(invoice)
//         res.status(200).json(invoice);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// });



router.post('/', async(req, res) => {
    const client = await pool.connect();
    try {
        const userID = req.user.attributes.mlpos_id;
        const { details, customerID } = req.body;
        if (!details || !customerID) throw new Error('Missing Fields');
        let invoiceTotal = 0;
        details.forEach(detail => {
            invoiceTotal += Number(detail.amount);
        });
        await client.query('BEGIN');
        const {rows: [result]} = await client.query(`
            INSERT INTO invoices (customer_id, user_id)
            VALUES ($1, $2)
            RETURNING id;
        `, [ customerID, userID]
        );
        let idx = 2;
        const detailsParams = [result.id];
        const detailsSQLArray = [];
        details.forEach(detail => {
            detailsParams.push(detail.name, detail.amount, detail.quantity)
            detailsSQLArray.push(`($1, $${idx++}, $${idx++}, $${idx++})`);
        });
        const detailsSQL = (`
            INSERT INTO invoices_details (invoices_id, name, amount, quantity)
            VALUES ${detailsSQLArray.join(', ')}
        `);
        await client.query(detailsSQL, detailsParams);
        await client.query('COMMIT');
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    } finally {
        client.release();
    }
});



router.put('/:id', async(req, res) => {
    const client = await pool.connect();
    try {

        const { amount, customerID, status, details } = req.body;
        console.log(req.body)
        console.log(req.params)
        const { id: invoiceID } = req.params;
        if(!amount && !customerID && !status && !details) throw new Error('No Fields Detected');
        if(!customerID || !invoiceID) throw new Error('Missing Essential Fields');
        const INSERT_SQL = [];
        const INSERT_PARAMS = [];
        let idx = 2;
        if (amount) {
            INSERT_SQL.push(`amount = $${idx++}`);
            INSERT_PARAMS.push(amount);
        } if (customerID) {
            INSERT_SQL.push(`customer_id = $${idx++}`);
            INSERT_PARAMS.push(customerID);
        } if (status) {
            INSERT_SQL.push(`status = $${idx++}`);
            INSERT_PARAMS.push(status);
        } if (details) {
            await client.query('UPDATE invoices_details SET is_deleted = true WHERE invoices_id = $1', [invoiceID]);
            if (details.length > 0) {
                let paramIndex = 2;
                let detailsSQLArray = [];
                let detailsParams = [invoiceID];
                details.forEach(detail => {
                    detailsParams.push(detail.name, detail.amount, detail.quantity)
                    detailsSQLArray.push(`($1, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
                });
                const detailsSQL = (`
                    INSERT INTO invoices_details (invoices_id, name, amount, quantity)
                    VALUES ${detailsSQLArray.join(', ')}
                `);
                await client.query(detailsSQL, detailsParams);
            }
        }
        const END_SQL = `
            UPDATE invoices
            SET ${INSERT_SQL.join(', ')}
            WHERE
                invoices.id = $1;
        `
        const END_PARAMS = [ invoiceID, ...INSERT_PARAMS ];
        await client.query(END_SQL, END_PARAMS);
        await client.query('COMMIT');
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    } finally {
        client.release();
    }
});



router.delete('/:id', async(req, res) => {
    try {
        const { id: customerID } = req.params;
        await pool.query(`
            UPDATE invoices
            SET is_deleted = true
            WHERE
                invoices.id = $1
        `, [ customerID ]);
        res.status(201).json({ message: 'User Deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;