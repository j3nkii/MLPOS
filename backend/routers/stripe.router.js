const express = require('express');
const router = express.Router();
const stripeModule = require('../modules/stripe');

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        const { mlpos_account_id, stripe_account_id } = req.user.attributes;
        if (stripe_account_id) {
            return res.status(400).json({ message: 'Stripe account already connected' });
        }
        await req.db.query('BEGIN');
        const account = await stripeModule.createAccount({ email });
        await req.db.query(
            'INSERT INTO accounts_stripe (account_id, stripe_account_id) VALUES ($1, $2)',
            [mlpos_account_id, account.id]
        );
        await req.db.query('COMMIT');
        const accountSession = await stripeModule.createAccountSession({ accountID: account.id });
        res.json({ client_secret: accountSession.client_secret });
    } catch (err) {
        await req.db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

router.get('/create-account-session', async (req, res) => {
    try {
        const { stripe_account_id } = req.user.attributes;
        if (!stripe_account_id) {
            return res.status(400).json({ error: 'No Stripe account' });
        }
        const accountSession = await stripeModule.createAccountSession({ accountID: stripe_account_id });
        res.json({ client_secret: accountSession.client_secret });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

router.post('/create-account-link', async (req, res) => {
    try {
        const { stripe_account_id } = req.user.attributes;
        if (!stripe_account_id) {
            return res.status(400).json({ error: 'No Stripe account' });
        }
        const accountLink = await stripeModule.createAccountLink({ accountID: stripe_account_id });
        res.json({ url: accountLink.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/account-status/:accountId', async (req, res) => {
    try {
        const stripeAccountStatus = await stripeModule.getAccountStatus({
            accountID: req.params.accountId,
        });
        res.json(stripeAccountStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
