require('dotenv').config();
const express = require('express');
const app = express();

const authMiddleware = require('./middleware/auth.middleware');
const tenantMiddleware = require('./middleware/tenant.middleware');

app.use(express.json());

const AUTH_ROUTER = require('./routers/auth.router');
app.use('/api/auth', AUTH_ROUTER);

const authed = [authMiddleware, tenantMiddleware];

const USER_ROUTER = require('./routers/user.router');
app.use('/api/user', ...authed, USER_ROUTER);
const CUSTOMERS_ROUTER = require('./routers/customers.router');
app.use('/api/customer', ...authed, CUSTOMERS_ROUTER);
const TICKET_ROUTER = require('./routers/ticket.router');
app.use('/api/ticket', ...authed, TICKET_ROUTER);
const PAYMENTS_ROUTER = require('./routers/payments.router');
app.use('/api/payments', ...authed, PAYMENTS_ROUTER);
const STRIPE_ROUTER = require('./routers/stripe.router');
app.use('/api/stripe', ...authed, STRIPE_ROUTER);
const PRODUCTS_ROUTER = require('./routers/products.router');
app.use('/api/product', ...authed, PRODUCTS_ROUTER);
// ::PLOPPIN::

module.exports = app;
