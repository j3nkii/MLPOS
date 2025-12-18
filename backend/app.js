require('dotenv').config();
const express = require('express');
const app = express();

const authMiddleware = require('./middleware/auth.middleware');


app.use(express.json());

app.use((req, res, next) => {
  if(process.env.NODE_ENV === 'production'){
    console.log('=== INCOMING REQUEST ===');
    console.log('Path:', req.path);
    console.log('Query params:', req.query);
    console.log('Body:', req.body);
    const originalSend = res.send;
    res.send = function(data) {
      console.log('=== OUTGOING RESPONSE ===');
      console.log('Status:', res.statusCode);
      console.log('Response body:', data);
      originalSend.call(this, data);
    };
  }
  next();
});


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