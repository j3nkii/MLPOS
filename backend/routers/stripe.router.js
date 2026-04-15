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




    const account = await stripe.v2.core.accounts.create({
      display_name: 'displayName',
      contact_email: email,
      identity: { country: 'us' },
      dashboard: 'full',              // Stripe handles auth/SMS, not your problem
      defaults: {
        responsibilities: {
          fees_collector: 'stripe',   // ← Stripe takes fees
          losses_collector: 'stripe', // ← Stripe eats losses, not you
        },
      },
      configuration: {
        merchant: {
          capabilities: {
            card_payments: { requested: true },
          },
        },
      },
    });







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






// Create a Connected Account
router.post('/account-session', async (req, res) => {
  const client = await pool.connect();
  try {
    const { stripe_account_id } = req.user.attributes;
    await client.query('BEGIN');
    const accountSession = await stripeModule.createAccountSession({ accountID: 'acct_1TMXFJDkUNj2wF2G' });
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
          configurations: ['merchant'],
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




// Create a Connected Account
router.post('/create-payment-link', async (req, res) => {
  const client = await pool.connect();
  try {
    const { stripe_account_id } = req.user.attributes;
    const paymentLink = await stripe.paymentLinks.create({
      application_fee_amount: 99,
      transfer_data: { destination: 'acct_1TMGt3DkUNzhE4SJ' },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'test',
            },
            unit_amount: 999
          },
          quantity: 1,
        },
      ],
    });
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
