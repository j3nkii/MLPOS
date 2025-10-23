require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;


app.use(express.json());

// const SAMPLE = require('./routes/SAMPLE.router');
// app.use('/api/SAMPLE', SAMPLE);


const USER_ROUTER = require('./routes/user.router');
app.use('/api/user', USER_ROUTER);
const CUSTOMERS_ROUTER = require('./routes/customers.router');
app.use('/api/customers', CUSTOMERS_ROUTER);
const INVOICE_ROUTER = require('./routes/invoice.router');
app.use('/api/invoice', INVOICE_ROUTER);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


module.exports = app;