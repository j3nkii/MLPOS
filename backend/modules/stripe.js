const { Stripe } = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);




const getAccountStatus = async ({ accountID }) => {
  const account = await stripe.v2.core.accounts.retrieve(
    accountID,
    {
      include: ['requirements', 'configuration.merchant'],
    }
  );
  const payoutsEnabled = account.configuration?.merchant?.capabilities?.stripe_balance?.payouts?.status === 'active'
  const chargesEnabled = account.configuration?.merchant?.capabilities?.card_payments?.status === 'active'

  // No pending requirments
  const summaryStatus = account.requirements?.summary?.minimum_deadline?.status
  const detailsSubmitted = !summaryStatus || summaryStatus === 'eventually_due'

  return {
    id: account.id,
    payoutsEnabled,
    chargesEnabled,
    detailsSubmitted,
    requirements: account.requirements?.entries,
  };
}



const createAccount = ({ email }) => stripe.v2.core.accounts.create({
  contact_email: 'furever_contact@example.com',
  display_name: 'Furever',
  dashboard: 'full',
  identity: {
    business_details: {
      registered_name: 'Furever',
    },
    country: 'us',
    entity_type: 'company',
  },
  configuration: {
    customer: {

    },
    merchant: {
      capabilities: {
        card_payments: {
          requested: true,
        },
      },
    },
  },
  defaults: {
    currency: 'usd',
    responsibilities: {
      fees_collector: 'stripe',
      losses_collector: 'stripe',
    },
    locales: ['en-US'],
  },
  include: [
    'configuration.customer',
    'configuration.merchant',
    'identity',
    'requirements',
  ],
});



const createAccountSession = ({ accountID }) => stripe.accountSessions.create({
    account: accountID,
    components: {
        account_onboarding: {
            enabled: true,
        },
    },
});



const createAccountLink = ({ accountID }) => stripe.v2.core.accountLinks.create({
    account: accountID,
    use_case: {
        type: 'account_onboarding',
        account_onboarding: {
            configurations: ['merchant'],
            refresh_url: 'http://localhost:4200/',
            return_url: `http://localhost:4200/`,
        },
    },
});



const createPaymentLink = ({ accountID, destination, line_items }) => {
    return stripe.paymentLinks.create({
      application_fee_amount: 99,
      transfer_data: { destination },
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
}



module.exports = {
    createAccount,
    createAccountLink,
    createAccountSession,
    createPaymentLink,
    getAccountStatus,
}
