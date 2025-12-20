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
const INVOICE_ROUTER = require('./routers/invoice.router');
app.use('/api/invoice', authMiddleware, INVOICE_ROUTER);


module.exports = app;