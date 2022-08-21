const { ObjectId } = require('mongoose').Types;

const { response, request } = require('express');
const { User, Thought } = require('../models');

module.exports = {

// Beginning of thought functions

    // Beginning of get all thoughts function
        getThoughts(req, res) {
            Thought.find()
            .then(async (thoughts) => {
                const thoughtObj = {
                    thoughts,
                };
                return res.json(thoughtObj);
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json(err);
            })
        },
    // End of get all thoughts function

    // Beginning of get single thought function
        getSingleThought(req, res) {
            Thought.findOne( { _id: req.params.thoughtId } )
            .select('-__v')
            .then((thought) => 
            !thought
            ? res.status(404).json({ message: "No such thought with that ID"})
            : res.json(thought)
            )
            .catch((err) => res.status(500).json({ Message: "Please make sure that you include a valid thought ID. Please try again."}));
        },
    // End of single thought function

    // Beginning of thought creation function
        createThought(req, res) {
            let username = '';
            let thoughtData = new Object();

            // Create a new thought
            Thought.create(req.body)
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

    // Beginning of delete thought function
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
        createReaction(req, res) {
            let thoughtId = req.params.thoughtId;
            let newReactionData = {
                reactionBody: req.body.reactionBody,
                username: req.body.username
            }

            const filter = { _id: thoughtId };
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
