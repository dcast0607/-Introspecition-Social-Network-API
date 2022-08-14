const router = require('express').Router();

const {
    getThoughts,
    getSingleThought,
    createThought,
    updateSingleThought,
    deleteThought,
    // thoughtReactions,
    // createReaction,
    // deleteReaction,
} = require('../../controllers/thoughtsController');

router.route('/').get(getThoughts).post(createThought);
router.route('/:thoughtId').get(getSingleThought).put(updateSingleThought).delete(deleteThought);
// router.route('/:thoughtId/reactions').get(thoughtReactions).post(createReaction);
// router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);


module.exports = router;
