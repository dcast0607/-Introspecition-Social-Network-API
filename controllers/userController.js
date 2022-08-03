const { ObjectId } = require('mongoose').Types;

const { User, Reaction, Thought } = require('../models');

const userCount = async () => 
    User.aggregate()
        .count('userCount')
        .then((numberOfUser) => numberOfUsers);


module.exports = {

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
    }
    // End of get a single user function.
};