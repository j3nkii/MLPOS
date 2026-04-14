const express = require('express');
const cognito = require('../modules/cognito');
const pool = require('../modules/pool');
const router = express.Router();
const stripeModule = require('../modules/stripe')
// const { Stripe } = require('stripe');
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



// const accountSession = await stripe.accountSessions.create({
//   account: '{{CONNECTED_ACCOUNT_ID}}',
//   components: {
//     account_onboarding: {
//       enabled: true,
//     },
//   },
// });



// Create a Connected Account
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { email } = req.body;
    const { mplos_account_id, stripe_account_id } = req.user.attributes;
    await client.query('BEGIN');
    const { rows: [{ check }]} = await client.query(`
      SELECT EXISTS (
        SELECT 1
        FROM stripe_accounts
        WHERE account_id = $1
      ) AS "check";`, [mplos_account_id]);
    console.log(check);
    if(!check){
      const account = await stripeModule.createAccount({ email });
      await client.query('INSERT INTO stripe_accounts (account_id, stripe_account_id) VALUES ($1, $2)', [ mplos_account_id, account.id ]);
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

// Create Account Link for onboarding
router.post('/create-account-link', async (req, res) => {
  const accountId = req.body.accountId;
  try {
    const accountLink = await stripe.v2.core.accountLinks.create({
      account: accountId,
      use_case: {
        type: 'account_onboarding',
        account_onboarding: {
          configurations: ['merchant'
],
          refresh_url: 'https://example.com',
          return_url: `https://example.com?accountId=${accountId}`,
        },
      },
    });
    res.json({ url: accountLink.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Connected Account Status
router.get('/account-status/:accountId', async (req, res) => {
  try {
    const account = await stripe.v2.core.accounts.retrieve(
      req.params.accountId,
      {
        include: ['requirements', 'configuration.merchant'],
      }
    );
    const payoutsEnabled = account.configuration?.merchant?.capabilities?.stripe_balance?.payouts?.status === 'active'
    const chargesEnabled = account.configuration?.merchant?.capabilities?.card_payments?.status === 'active'

    // No pending requirments
    const summaryStatus = account.requirements?.summary?.minimum_deadline?.status
    const detailsSubmitted = !summaryStatus || summaryStatus === 'eventually_due'

    res.json({
      id: account.id,
      payoutsEnabled,
      chargesEnabled,
      detailsSubmitted,
      requirements: account.requirements?.entries,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
