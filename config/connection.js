const { connect, connection } = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/usersDB';

connectionString(connectionString, {
    userNewUrlParser: true,
    userUnifiedTopology: true,
});

module.exports = connection;