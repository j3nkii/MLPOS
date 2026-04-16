const express = require('express');
const cognito = require('../modules/cognito');
const pool = require('../modules/pool');
const router = express.Router();
const stripeModule = require('../modules/stripe')
const { Stripe } = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);





// Create a Connected Account
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { email } = req.body;
    const { mplos_account_id, stripe_account_id } = req.user.attributes;
    await client.query('BEGIN');
    // const { rows: [{ check }]} = await client.query(`
    //   SELECT EXISTS (
    //     SELECT 1
    //     FROM accounts_stripe
    //     WHERE account_id = $1
    //   ) AS "check";`, [mplos_account_id]);
    // console.log(check);
    if(!false){
      const account = await stripeModule.createAccount({ email });
      // await client.query('INSERT INTO accounts_stripe (account_id, stripe_account_id) VALUES ($1, $2)', [ mplos_account_id, account.id ]);
      await client.query('COMMIT');
      const accountSession = await stripeModule.createAccountSession({ accountID: account.id });
      return res.json({ client_secret: accountSession.client_secret });
    }
    const accountSession = await stripeModule.createAccountSession({ accountID: stripe_account_id });
    console.log(accountSession)
    res.json({ client_secret: accountSession.client_secret });
  } catch (err) {
    console.error(err.message);
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});






router.post('/account-session', async (req, res) => {
  try {
    const { stripe_account_id } = req.user.attributes;
    const accountSession = await stripeModule.createAccountSession({ accountID: stripe_account_id });
    console.log(accountSession)
    res.json({ client_secret: accountSession.client_secret });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});





// Create Account Link for onboarding
router.post('/create-account-link', async (req, res) => {
  const accountID = req.body.accountID;
  try {
    const accountLink = await stripeModule.createAccountLink({ accountID });
    res.json({ url: accountLink.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// Get Connected Account Status
router.get('/account-status/:accountId', async (req, res) => {
  try {
    const { accountID } = req.params;
    const stripeAccountStatus = await stripeModule.getAccountStatus({ accountID });
    res.json(stripeAccountStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Create a Connected Account
router.post('/create-payment-link', async (req, res) => {
  const client = await pool.connect();
  try {
    const { stripe_account_id } = req.user.attributes;
    const paymentLink = await stripeModule.createPaymentLink({ accountID: 'acct_1TMGt3DkUNzhE4SJ' })
    res.json({ paymentLink: paymentLink.url });
  } catch (err) {
    console.error(err.message);
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});



module.exports = router;
