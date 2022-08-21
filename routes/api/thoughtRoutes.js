// This file is used to define the individual thought routes that the user can use to interact with our database.

const router = require('express').Router();

// We import the functions that we will be using to handle the API requests. 
const {
    getThoughts,
    getSingleThought,
    createThought,
    updateSingleThought,
    deleteThought,
    createReaction,
    deleteReaction,
} = require('../../controllers/thoughtsController');

// The following defines the different methods that can be used with the routes and what functions
// need to be invoked for the particular request. 
router.route('/').get(getThoughts).post(createThought);
router.route('/:thoughtId').get(getSingleThought).put(updateSingleThought).delete(deleteThought);
router.route('/:thoughtId/reactions').post(createReaction);
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);


module.exports = router;
