// TODO: If enough time add data to the DB

const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('Connected');

    await User.deleteMany({});

    await Thought.deleteMany({});
})