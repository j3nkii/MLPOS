const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT * FROM products
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { name, price } = req.body;
        await client.query(`INSERT INTO products (name, price) VALUES ($1, $2)`, [name, price]);
        await client.query('COMMIT');
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    } finally {
        client.release();
    }
});



router.put('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        // TODO: destructure req.body and build dynamic update
        await client.query('COMMIT');
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    } finally {
        client.release();
    }
});



router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`
            UPDATE products
            SET is_deleted = true
            WHERE id = $1
        `, [id]);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



module.exports = router;
