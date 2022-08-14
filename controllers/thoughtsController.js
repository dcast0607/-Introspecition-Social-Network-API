const { ObjectId } = require('mongoose').Types;

const { response } = require('express');
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
            .catch((err) => res.status(500).json(err));
        },
    // End of single thought function

    // Beginning of thought creation function
        createThought(req, res) {
            Thought.create(req.body)
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
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
            .catch((err) => res.status(500).json(err));
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
                return res.status(500).json(err);
            });
        }
    // End of delete thought function

// End of thought functions
}
