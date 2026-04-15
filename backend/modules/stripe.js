const { Stripe } = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const createAccount = ({ email }) => stripe.v2.core.accounts.create({
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
    },
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
