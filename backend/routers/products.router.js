const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT * FROM products
            WHERE account_id = $1 AND is_deleted = false
            ORDER BY created_at DESC
        `, [req.accountId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, price } = req.body;
        const sku = `sku-${Date.now()}`;
        await req.db.query(`
            INSERT INTO products (name, price, account_id, internal_sku, external_sku)
            VALUES ($1, $2, $3, $4, $4)
        `, [name, price, req.accountId, sku]);
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, price } = req.body;
        const updates = [];
        const params = [req.params.id, req.accountId];
        let idx = 3;
        if (name) {
            updates.push(`name = $${idx++}`);
            params.push(name);
        }
        if (price !== undefined && price !== null) {
            updates.push(`price = $${idx++}`);
            params.push(price);
        }
        if (!updates.length) throw new Error('No fields to update');
        const { rowCount } = await req.db.query(`
            UPDATE products SET ${updates.join(', ')}
            WHERE id = $1 AND account_id = $2
        `, params);
        if (!rowCount) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { rowCount } = await req.db.query(`
            UPDATE products SET is_deleted = true
            WHERE id = $1 AND account_id = $2
        `, [req.params.id, req.accountId]);
        if (!rowCount) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;
