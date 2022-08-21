const router = require('express').Router();

const {
    getThoughts,
    getSingleThought,
    createThought,
    updateSingleThought,
    deleteThought,
    createReaction,
    deleteReaction,
} = require('../../controllers/thoughtsController');

router.route('/').get(getThoughts).post(createThought);
router.route('/:thoughtId').get(getSingleThought).put(updateSingleThought).delete(deleteThought);
router.route('/:thoughtId/reactions').post(createReaction);
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);


module.exports = router;
