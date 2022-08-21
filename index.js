// Defines the express package

const express = require('express');

// Defines our database connection
const db = require('./config/connection');
const routes = require('./routes');

// Defines what local port we will be using
const PORT = process.env.port || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// Initializes the database
db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Social Network API running on port ${PORT}`);
    });
});