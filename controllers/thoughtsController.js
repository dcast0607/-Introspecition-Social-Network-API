// Defines the required objects/packages.

const { ObjectId } = require('mongoose').Types;

const { response, request } = require('express');
const { User, Thought } = require('../models');

module.exports = {

// Beginning of thought functions

    // Beginning of get all thoughts function
        getThoughts(req, res) {
            // Uses the find() method to retrieve a list of all thoughts
            // that exist in teh database.
            Thought.find()
            // Data is sent to the user as a response and we return a 200 code.
            .then(async (thoughts) => {
                const thoughtObj = {
                    thoughts,
                };
                return res.status(200).json(thoughtObj);
            })
            // If no data is found or we encounter an error, we return a 500 error and 
            // the respective  error. 
            .catch((error) => {
                console.log(error);
                return res.status(500).json(err);
            })
        },
    // End of get all thoughts function

    // Beginning of get single thought function
        getSingleThought(req, res) {
            // We use the findOne() method to find an individual thought
            // record. The thoughtId that is provided in the request
            // is used to query for the individual thought record. 
            Thought.findOne( { _id: req.params.thoughtId } )
            .select('-__v')
            .then((thought) => 
            // If no thought is found we return an error code and an error 
            // message. 
            !thought
            ? res.status(404).json({ message: "No such thought with that ID"})
            // If we do find a thought record we return that to the user an issue
            // a 200 response code.
            : res.status(200).json(thought)
            )
            // If the request fails, we return a 500 error code and ask the user to try again.
            .catch((err) => res.status(500).json({ Message: "Please make sure that you include a valid thought ID. Please try again."}));
        },
    // End of single thought function

    // Beginning of thought creation function
    // This function was a little tricky to build as it not only requires,
    // that we create a new thought record but also that when a new record 
    // is created, that the ID of that thought is added to the users object
    // as a new entry in the "thoughts" array. 
        createThought(req, res) {

            let username = '';
            let thoughtData = new Object();

            // Create a new thought
            Thought.create(req.body)
            // We store the API request data as it will be used to make subsequent
            // calls to our database. 

            // Thought is created here. We store, the username so that we can then
            // use this username to update the existing user record with the associated
            // thought ID. 
            .then((thought) => {
                username = thought.username;
                thoughtData = thought;
            })
            .then(() => {
                Thought.find( { username: username })
                .then((thoughts) => {
                    const thoughtIds = [];
                    thoughts.forEach((thought) => {
                        thoughtIds.push(thought._id);
                    })
                    return thoughtIds;
                })
                .then((thoughtIds) => {
                    console.log(thoughtIds);
                    const filter = { username: username };
                    const update = { thoughts: thoughtIds };
                    User.findOneAndUpdate(filter, update, {
                        new: true,
                    })
                    .then(() => {
                        console.log(`Updated ${username} thoughts!`)
                    })
                    .catch((err) => {
                        console.log(`Failed to update ${username} thoughts.`);
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
            })
            .then(() => {
                res.status(200).json(thoughtData);
            }).catch((err) => {
                res.status(500).json({Message: "We were not able to create the thought, please try again and make sure you include the required information."});
            })
        },
    // End of thought creation function

    // Beginning of update single thought function
    // We are just updating the existing thought data with this function. It
    // is similar to the update function we used on our userControllers file.
        updateSingleThought(req, res) {
            const filter = { _id: req.params.thoughtId };
            const update = {
                thoughtText: req.body.thoughtText,
                username: req.body.username,
            };
            Thought.findOneAndUpdate( filter, update, {
                new: true
            })
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json({Message: "Could not find thought association to that thought ID. Please try again."}));
        },
    // End of update single thought function

    // Beginning of delete thought function\
    // Added similar logic here as the logic that was added in the userControllers file
    // to delete a user record. The only difference here is that we have not added additional
    // logic to delete database entries from other database collections.
        deleteThought(req, res) {
            Thought.deleteOne( { _id: req.params.thoughtId })
            .then(() => {
                console.log("Thought deleted successfully")
                res.status(200).json({ message: 'Thought deleted successfully'});
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({Message: "Could not find thought associated to that thought ID. Please try again."});
            });
        },
    // End of delete thought function

    // Beginning of function to add a reaction to a thought
    // I decided to take the more efficient approach here. 
    // We are using a single method findOneAndUpdate() to handle
    // both the identifying of the record that we will be updating
    // and the addition of the new data that has been sent in our API request.
        createReaction(req, res) {
            let thoughtId = req.params.thoughtId;
            let newReactionData = {
                reactionBody: req.body.reactionBody,
                username: req.body.username
            }

            const filter = { _id: thoughtId };
            // We add the new data from the API request to our existing data.
            const update = { $addToSet: { reactions: newReactionData} };

            Thought.findOneAndUpdate(filter, update, {
                new: true,
            })
            .then((thought) => {
                !thought
                ? res.status(405).json({ Message: "We were not able to locate any thoughts with that ID. Please try again."})
                : res.status(200).json(thought)
            })
            .catch((err) => {
                res.status(500).json({ Message: "Could not find thought associated to that ID. Please enter a valid ID and try again."});
            })


        },
    // End of function add a reaction to a thought

    // Beginning of function to delete a reaction from a thought
    // Similar to the function above, we are using similar logic to update the existing
    // user record, however, in this case we are pulling/removing the data defined by 
    // the reactionId. 
        deleteReaction(req, res) {
            let thoughtId = req.params.thoughtId;
            let reactionId = req.params.reactionId;

            const filter = { _id: thoughtId };
            const update = { $pull: {reactions: { reactionId: reactionId } } };

            Thought.findOneAndUpdate(filter, update, {
                new: true,
            })
            .then((thought) => {
                !thought 
                ? res.status(405).json({ Message: "Could not find thought associated to that ID. Please enter a valid ID and try again."})
                : res.status(200).json(thought);
            })
            .catch((err) => {
                res.status(500).json({ Message: "We were not able to delete the reaction. Please make sure that you include a valid thought ID and a valid reaction ID, please try again."});
            })
        }
    // End of function to delete a reaction from a thought

// End of thought functions
}
