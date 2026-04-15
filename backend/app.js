require('dotenv').config();
const express = require('express');
const app = express();

const authMiddleware = require('./middleware/auth.middleware');


app.use(express.json());



// const SAMPLE = require('./routers/SAMPLE.router');
// app.use('/api/SAMPLE', SAMPLE);
const AUTH_ROUTER = require('./routers/auth.router');
app.use('/api/auth', AUTH_ROUTER);
const USER_ROUTER = require('./routers/user.router');
app.use('/api/user', authMiddleware, USER_ROUTER);
const CUSTOMERS_ROUTER = require('./routers/customers.router');
app.use('/api/customer', authMiddleware, CUSTOMERS_ROUTER);
TICKET_ROUTER = require('./routers/ticket.router');
app.use('/api/ticket', authMiddleware, TICKET_ROUTER);
const PAYMENTS_ROUTER = require('./routers/payments.router');
app.use('/api/payments', authMiddleware, PAYMENTS_ROUTER);
const STRIPE_ROUTER = require('./routers/stripe.router');
app.use('/api/stripe', authMiddleware, STRIPE_ROUTER);


module.exports = app;