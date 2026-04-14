const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const userID = req.user.attributes.mlpos_id;
        const { rows } = await pool.query(`
            SELECT
                invoices.*,
                customers.name,
                SUM(invoice_items.price * invoice_items.quantity) as price,
                COALESCE(JSON_AGG(invoice_items) FILTER (WHERE invoice_items.invoice_id IS NOT NULL), '[]') as details,
                COALESCE((
                    WITH payments_clone AS (
                        SELECT * FROM payments WHERE invoice_id = invoices.id AND is_deleted = false
                    )
                    SELECT JSON_AGG(payments_clone.*) AS reults FROM payments_clone
                ), '[]') AS payments
            FROM invoices
            LEFT JOIN invoice_items
                ON invoice_items.invoice_id = invoices.id
                AND invoice_items.is_deleted = false
            JOIN customers
                ON customers.id = invoices.customer_id
                AND customers.is_deleted = false
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
//                 ON invoice_details.invoice_id = invoices.id
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
        // if (!details || !customerID) throw new Error('Missing Fields');
        // let invoiceTotal = 0;
        // details.forEach(detail => {
        //     invoiceTotal += Number(detail.price);
        // });
        await client.query('BEGIN');
        const {rows: [result]} = await client.query(`
            INSERT INTO invoices (customer_id, user_id)
            VALUES ($1, $2)
            RETURNING id;
        `, [ customerID, userID]
        );
        // REMOVING MASS INPUTS FOR NOW.
        // let idx = 2;
        // const detailsParams = [result.id];
        // const detailsSQLArray = [];
        // details.forEach(detail => {
        //     detailsParams.push(detail.name, detail.price, detail.quantity)
        //     detailsSQLArray.push(`($1, $${idx++}, $${idx++}, $${idx++})`);
        // });
        // const detailsSQL = (`
        //     INSERT INTO invoice_items (invoice_id, name, price, quantity)
        //     VALUES ${detailsSQLArray.join(', ')}
        // `);
        // await client.query(detailsSQL, detailsParams);
        await client.query('COMMIT');
        res.status(201).json({ message: 'User created successfully', data: { invoiceID: result.id } });
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

        const { price, customerID, status, details: DO_NOT_USE } = req.body;
        const details = null;
        console.log(req.body)
        console.log(req.params)
        const { id: invoiceID } = req.params;
        if(!price && !customerID && !status && !details) throw new Error('No Fields Detected');
        if(!customerID || !invoiceID) throw new Error('Missing Essential Fields');
        const INSERT_SQL = [];
        const INSERT_PARAMS = [];
        let idx = 2;
        if (customerID) {
            INSERT_SQL.push(`customer_id = $${idx++}`);
            INSERT_PARAMS.push(customerID);
        } if (status) {
            INSERT_SQL.push(`status = $${idx++}`);
            INSERT_PARAMS.push(status);
        } if (details) {
            await client.query('UPDATE invoice_items SET is_deleted = true WHERE invoice_id = $1', [invoiceID]);
            if (details.length > 0) {
                let paramIndex = 2;
                let detailsSQLArray = [];
                let detailsParams = [invoiceID];
                details.forEach(detail => {
                    detailsParams.push(detail.name, detail.price, detail.quantity)
                    detailsSQLArray.push(`($1, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
                });
                const detailsSQL = (`
                    INSERT INTO invoice_items (invoice_id, name, price, quantity)
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



router.post('/line-item/:id', async(req, res) => {
    const client = await pool.connect();
    try {
        console.log(req.body)
        const { name, price, quantity } = req.body;
        const { id: invoiceID } = req.params;
        if(!invoiceID || !name || !price || !quantity) throw new Error('Missing Essential Fields');
        const END_SQL = `INSERT INTO invoice_items (invoice_id, name, price, quantity) VALUES ($1, $2, $3, $4)`;
        const END_PARAMS = [invoiceID, name, price, quantity];
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



router.put('/line-item/:id', async(req, res) => {
    const client = await pool.connect();
    try {

        const { name, price, quantity } = req.body;
        const { id: lineItemID } = req.params;
        if(!price && !quantity) throw new Error('No Fields Detected');
        if(!lineItemID) throw new Error('Missing Essential Fields');
        const INSERT_SQL = [];
        const END_PARAMS = [lineItemID];
        let idx = 2;
        if (name) {
            INSERT_SQL.push(`name = $${idx++}`);
            END_PARAMS.push(name);
        } 
        if (price) {
            INSERT_SQL.push(`price = $${idx++}`);
            END_PARAMS.push(price);
        } if (quantity) {
            INSERT_SQL.push(`quantity = $${idx++}`);
            END_PARAMS.push(quantity);
        }
        const END_SQL = `
            UPDATE invoice_items
            SET ${INSERT_SQL.join(', ')}
            WHERE
                invoice_items.id = $1;
        `
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


router.post('/send/:id', async(req, res) => {
    try {
        const { id: invoiceID } = req.params;
        await pool.query(`
            INSERT INTO sent_payments (invoice_id) VALUES ($1);
        `, [ invoiceID ]);
        res.status(201).json({ message: 'User Deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;
