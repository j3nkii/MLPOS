const { Stripe } = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const createAccount_ = ({ email }) => stripe.v2.core.accounts.create({
    display_name: email,
    contact_email: email,
    dashboard: 'none',
    defaults: {
        responsibilities: {
            fees_collector: 'application',
            losses_collector: 'stripe',
        },
    },
    identity: {
        country: 'US',
        entity_type: 'individual',
    },
    configuration: {
        merchant: {
            capabilities: {
                card_payments: { requested: true },
            },
        },
        customer: {
            capabilities: {
                automatic_indirect_tax: {
                requested: true,
                },
            },
        },
    },
});


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



module.exports = {
    createAccount,
    createAccountLink,
    createAccountSession,
}
