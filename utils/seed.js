/*
This entire file is used to seed the database with the data that we have added in the data.js file. 

This seed file will also delete any existing data and repopulate the database each time you run this
file. The goal of this is to make it easier for the end user that is testing our API. Having the seed
data gives them a place starter to start testing the API right away. 
*/

const connection = require('../config/connection');
const User = require('../models/User');
const Thought  = require('../models/Thought');
const { ObjectId } = require('mongoose').Types;
const { getRandomThought, getUserName, getRandomReaction } = require('./data');
const { default: mongoose } = require('mongoose');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('Connected');

    await User.deleteMany({});

    await Thought.deleteMany({});

    const users = [];
    const thoughtsData = [];
    let createdAt = new Date();


    // This function is used to generate random thought data. I introduced a random number
    // generator to randomly pull a thought from the data in our data.js file.
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

    // This function will cycle through the available users in our data.js file and it will
    // generate data that can used to populate our database. 
    function generateUserData () {
        for (let i =0; i < 6; i++) {
            const username = getUserName(i);
            const email = `testEmail${i}@email.com`;
            const friends = [ new mongoose.Types.ObjectId ]  
            users.push({
                username,
                email,
                friends
            });
        }
    }
    
    // Generated data is added to the database with the insertMany method.
    generateRandomThoughtData();
    await Thought.collection.insertMany(thoughtsData);


    // Adding a user that contains a lot of data to make it easier for testing.
    await User.collection.insertOne({
        username: 'dancastro',
        email: 'dancastro.java@gmail.com',
        thoughts: [
            new mongoose.Types.ObjectId,
            new mongoose.Types.ObjectId,
            new mongoose.Types.ObjectId
        ],
        friends: [
            new mongoose.Types.ObjectId,
            new mongoose.Types.ObjectId,
            new mongoose.Types.ObjectId
        ]
    })


    // User data is added to the database.
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

    for (let i = 0; i < 6; i++) {
        const username = getUserName(i);
        const randomThoughtIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const thoughtRandomizer = Math.floor(Math.random() * randomThoughtIndex.length);
        const reaction = getRandomReaction(randomThoughtIndex[thoughtRandomizer]);

        const update = { username: username };
        const filter = { 
            reactions: {
                reactionBody: reaction,
                username: username
            }
        };

        // User data is updated with thought data. 
        await Thought.findOneAndUpdate( update, filter, {
            new: true
        });
    }


    console.table(users);
    console.table(thoughtsData);
    console.info('Seeding completed');
    process.exit(0);
});