// TODO: If enough time add data to the DB
const connection = require('../config/connection');
const User = require('../models/User');
const Thought  = require('../models/Thought');
const { getRandomThought, getUserName } = require('./data');
let db;

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('Connected');

    await User.deleteMany({});

    await Thought.deleteMany({});

    const users = [];
    const thoughtsData = [];
    let createdAt = new Date();


    function generateRandomThoughtData () {
        for (let i =0; i < 6; i++) {
            const username = getUserName(i);
            for (thoughtCounter = 0; thoughtCounter < 2; thoughtCounter++) {
                const randomThoughtIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                const thoughtRandomizer = Math.floor(Math.random() * randomThoughtIndex.length);
                const thoughtText = getRandomThought(randomThoughtIndex[thoughtRandomizer]);
                thoughtsData.push({
                    thoughtText,
                    username,
                    createdAt,
                });
            };
        };
    };

    function generateUserData () {
        for (let i =0; i < 6; i++) {
            const username = getUserName(i);
            const email = `testEmail${i}@email.com`;

            const query = Thought.find( { 'username': username });

            query.exec(function(err, thoughtData) {
                if (err) {
                    return handleError(err)
                };
                console.log(thoughtData);
            })

            users.push({
                username,
                email,
            });
        }
    }

    generateRandomThoughtData();
    await Thought.collection.insertMany(thoughtsData);

    await User.collection.insertOne({
        username: 'dancastro',
        email: 'dancastro.java@gmail.com',
        thoughts: "This is a thought",
    })

    generateUserData();
    await User.collection.insertMany(users);


    console.table(users);
    console.table(thoughtsData);
    console.info('Seeding completed');
    process.exit(0);
});