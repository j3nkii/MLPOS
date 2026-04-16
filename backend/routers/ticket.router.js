const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const stripeModule = require('../modules/stripe');



// CURRENTLY GET / FETCHES ALL DATA, SO FRONT END DOES NOT NEED A "DETAILED" VIEW
// router.get('/:id', async (req, res) => {
//     try {
//         const { rows: [ ticket ] } = await pool.query(`
//             SELECT
//                 *,
//                 JSON_AGG(ticket_details)
//             FROM tickets
//             JOIN ticket_details
//                 ON ticket_details.ticket_id = tickets.id
//                 AND ticket_details.is_deleted = false
//             WHERE id = $1
//                 AND is_deleted = false;
//         `, [ req.params.id ]);
//         console.log(ticket)
//         res.status(200).json(ticket);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// });



router.get('/', async (req, res) => {
    try {
        const userID = req.user.attributes.mlpos_id;
        const { rows } = await pool.query(`
            SELECT
                tickets.*,
                customers.name,
                SUM(ticket_items.price * ticket_items.quantity) as price,
                COALESCE(JSON_AGG(ticket_items) FILTER (WHERE ticket_items.ticket_id IS NOT NULL), '[]') as details,
                COALESCE((
                    WITH payments_clone AS (
                        SELECT * FROM payments
                        WHERE ticket_id = tickets.id
                            AND is_deleted = false
                        ORDER BY created_at DESC
                    )
                    SELECT JSON_AGG(payments_clone.*) AS reults
                    FROM payments_clone
                ), '[]') AS payments
            FROM tickets
            LEFT JOIN ticket_items
                ON ticket_items.ticket_id = tickets.id
                AND ticket_items.is_deleted = false
            JOIN customers
                ON customers.id = tickets.customer_id
                AND customers.is_deleted = false
            WHERE tickets.user_id = $1
                AND tickets.is_deleted = false
            GROUP BY tickets.id, customers.name
            ORDER BY tickets.created_at DESC;
        `, [ userID ]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



router.post('/', async(req, res) => {
    const client = await pool.connect();
    try {
        const userID = req.user.attributes.mlpos_id;
        const { details, customerID } = req.body;
        // if (!details || !customerID) throw new Error('Missing Fields');
        // let ticketTotal = 0;
        // details.forEach(detail => {
        //     ticketTotal += Number(detail.price);
        // });
        await client.query('BEGIN');
        const {rows: [result]} = await client.query(`
            INSERT INTO tickets (customer_id, user_id)
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
        //     INSERT INTO ticket_items (ticket_id, name, price, quantity)
        //     VALUES ${detailsSQLArray.join(', ')}
        // `);
        // await client.query(detailsSQL, detailsParams);
        await client.query('COMMIT');
        res.status(201).json({ message: 'User created successfully', data: { ticketID: result.id } });
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
        const { id: ticketID } = req.params;
        if(!price && !customerID && !status && !details) throw new Error('No Fields Detected');
        if(!customerID || !ticketID) throw new Error('Missing Essential Fields');
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
            await client.query('UPDATE ticket_items SET is_deleted = true WHERE ticket_id = $1', [ticketID]);
            if (details.length > 0) {
                let paramIndex = 2;
                let detailsSQLArray = [];
                let detailsParams = [ticketID];
                details.forEach(detail => {
                    detailsParams.push(detail.name, detail.price, detail.quantity)
                    detailsSQLArray.push(`($1, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
                });
                const detailsSQL = (`
                    INSERT INTO ticket_items (ticket_id, name, price, quantity)
                    VALUES ${detailsSQLArray.join(', ')}
                `);
                await client.query(detailsSQL, detailsParams);
            }
        }
        const END_SQL = (`
            UPDATE tickets
            SET ${INSERT_SQL.join(', ')}
            WHERE
                tickets.id = $1;
        `);
        const END_PARAMS = [ ticketID, ...INSERT_PARAMS ];
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
            UPDATE tickets
            SET is_deleted = true
            WHERE
                tickets.id = $1
        `, [ customerID ]);
        res.status(201).json({ message: 'User Deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.post('/ticket-item/:id', async(req, res) => {
    const client = await pool.connect();
    try {
        console.log(req.body)
        const { name, price, quantity } = req.body;
        const { id: ticketID } = req.params;
        if(!ticketID || !name || !price || !quantity) throw new Error('Missing Essential Fields');
        const END_SQL = `INSERT INTO ticket_items (ticket_id, name, price, quantity) VALUES ($1, $2, $3, $4)`;
        const END_PARAMS = [ticketID, name, price, quantity];
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



router.put('/ticket-item/:id', async(req, res) => {
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
            UPDATE ticket_items
            SET ${INSERT_SQL.join(', ')}
            WHERE
                ticket_items.id = $1;
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



router.delete('/ticket-item/:id', async(req, res) => {
    try {
        const { id: lineItemID } = req.params;
        await pool.query(`
            UPDATE ticket_items
            SET is_deleted = true
            WHERE
                id = $1
        `, [ lineItemID ]);
        res.status(201).json({ message: 'User Deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



router.post('/send/:id', async(req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id: ticketID } = req.params;
        const { stripe_account_id } = req.user.attributes;
        const { rows: [ ticketFull ]} = await client.query(`
            SELECT
                tickets.*,
                customers.name,
                customers.email,
                SUM(ticket_items.price * ticket_items.quantity) as price,
                COALESCE(JSON_AGG(ticket_items) FILTER (WHERE ticket_items.ticket_id IS NOT NULL), '[]') as details,
                COALESCE((
                    WITH payments_clone AS (
                        SELECT * FROM payments
                        WHERE ticket_id = tickets.id
                            AND is_deleted = false
                        ORDER BY created_at DESC
                    )
                    SELECT JSON_AGG(payments_clone.*) AS reults
                    FROM payments_clone
                ), '[]') AS payments
            FROM tickets
            LEFT JOIN ticket_items
                ON ticket_items.ticket_id = tickets.id
                AND ticket_items.is_deleted = false
            JOIN customers
                ON customers.id = tickets.customer_id
                AND customers.is_deleted = false
            WHERE tickets.id = $1
                AND tickets.is_deleted = false
            GROUP BY tickets.id, customers.name, customers.email
            ORDER BY tickets.created_at DESC
            LIMIT 1;
        `, [ticketID]);

    //     {
    //   id: '22222222-1111-0000-0000-000000000009',
    //   ticket_id: '22222222-0000-0000-0000-000000000002',
    //   name: 'Underwear',
    //   quantity: 7,
    //   price: 2999,
    //   is_deleted: false,
    //   created_at: '2026-04-15T18:01:21.326343-05:00',
    //   updated_at: '2026-04-15T18:01:21.326343-05:00'
    // }
        console.log(ticketFull)
        console.log(ticketFull)
        const line_items = ticketFull.details.map(item => ({
            quantity: item.quantity,
            price_data: {
                currency: 'usd',
                unit_amount: item.price,
                product_data: {
                    name: item.name
                }
            }
        }));
        await pool.query(`INSERT INTO sent_payments (ticket_id) VALUES ($1);`, [ ticketID ]);
        await pool.query(`UPDATE tickets SET invoice_status = 'sent' WHERE id = $1;`, [ ticketID ]);
        const paymentLink = await stripeModule.createPaymentLink({ destination: stripe_account_id, line_items });
        await client.query('COMMIT');
        res.status(201).json(paymentLink);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    } finally {
        client.release();
    }
});



module.exports = router;
