// This file is used to define the specific user routes that will be used to interact
// with the users object in our database.

const router = require('express').Router();

// We import the functions that we will be using here. 
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    updateUserFriends,
    removeUserFriend
} = require('../../controllers/userController');

// Routes and functions are defined here. 
router.route('/').get(getUsers).post(createUser);
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);
router.route('/:userId/friends/:friendId').post(updateUserFriends).delete(removeUserFriend);

module.exports = router;