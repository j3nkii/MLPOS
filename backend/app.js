require('dotenv').config();
const express = require('express');
const app = express();


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
const USER_ROUTER = require('./routers/user.router');
app.use('/api/user', USER_ROUTER);
const CUSTOMERS_ROUTER = require('./routers/customers.router');
app.use('/api/customers', CUSTOMERS_ROUTER);
const INVOICE_ROUTER = require('./routers/invoice.router');
app.use('/api/invoice', INVOICE_ROUTER);


module.exports = app;