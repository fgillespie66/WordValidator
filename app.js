const express = require('express');
const path = require('path');
const logger = require('morgan');

// Create our app
const app = express();

// Set up the app to use dev logger
app.use(logger('dev'));

// Accept json
app.use(express.json());

// Server html+css+js frontend
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;