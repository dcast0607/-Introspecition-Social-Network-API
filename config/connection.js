
// Defines that mongoose is required.
const { connect, connection } = require('mongoose');

// Defines where our database is being hosted.
const connectionString =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/usersDB';

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
