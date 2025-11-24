// Import express and create app
const express = require('express');
const app = express();

// Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Require model so mongoose knows it
require('./app/models/inventory.model.js');

// Configure environment variables
require('dotenv').config();

// Mongoose setup
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect(process.env.DATABASE);


// Log database connection status
mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

// Routes
require('./app/routes/inventory.router.js')(app);

// Start server on port 8080
const server = app.listen(8080, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("App listening at http://%s:%s", host, port);
});
