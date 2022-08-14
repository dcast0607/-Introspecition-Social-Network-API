const { ObjectId } = require('mongoose').Types;

const { User, Reaction, Thought } = require('../models');

const userCount = async () => 
    User.aggregate()
        .count('userCount')
        .then((numberOfUsers) => numberOfUsers);


module.exports = {

// USER ROUTES

    // Function to get all users and number of users.
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                    userCount: await userCount(),
                };
                return res.json(userObj);
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json(err);
            })
    },
    // End of function to get all users and number of users.

    // Get a single user function
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .lean()
            .then(async (user) =>
                !user
                ? res.status(404).json({ message: 'No such user with that ID'})
                : res.json({
                    user
                    //TODO: Add support to fetch friends list and thoughts
                    })
                )
            .catch((error) => {
                console.log(error);
                return res.status(500).json(error);
            });
    },
    // End of get a single user function.

    // Function to create a new user record
    createUser (req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },
    // End of function to create a new user record.

    // Function to update an existing user record
    // and return updated user record
    updateUser (req, res) {
        const filter = { _id: req.params.userId };
        const update = { 
            username: req.body.username,
            email: req.body.email,
        };
        User.findOneAndUpdate( filter, update, {
            new: true
        })
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },
    // End of user update function

    // Function to delete an existing user record
    deleteUser (req, res) { 
        User.deleteOne( { _id: req.params.userId })
        .then(() => {
            User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                    userCount: await userCount(),
                };
                return res.json({message: `User deleted successfully. These are the remaining users: ${JSON.stringify(userObj)}`});
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    }
    //End of function to delete an existing user record

    // TODO: Add a way to delete user's thoughts when the user is deleted. 

// END OF USER ROUTES

};