const connection = require('../config/connection');
const User = require('../models/User');
const Thought  = require('../models/Thought');
const { ObjectId } = require('mongoose').Types;
const { getRandomThought, getUserName } = require('./data');

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
            users.push({
                username,
                email
            });
        }
    }

    generateRandomThoughtData();
    await Thought.collection.insertMany(thoughtsData);

    await User.collection.insertOne({
        username: 'dancastro',
        email: 'dancastro.java@gmail.com',
        thoughts: [
            {
                thoughtText: "This is a thought.",
                username: "dancastro",
            }
        ],
    })

    generateUserData();
    await User.collection.insertMany(users);


    for (let i = 0; i < 6; i++) {
        const username = getUserName(i);
        const thoughts = await Thought.find( { username: username });
        console.log(thoughts.map( thought => thought._id).sort());
        let thoughtsArray = thoughts.map( thought => thought._id).sort();

        const update = { username: username };
        const filter = { thoughts: thoughtsArray };


        await User.findOneAndUpdate( update, filter, {
            new: true
        });
    };


    console.table(users);
    console.table(thoughtsData);
    console.info('Seeding completed');
    process.exit(0);
});