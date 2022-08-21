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
                    })
                )
            .catch((error) => {
                return res.status(500).json({ Message: "User does not exist with that user ID, please try again with a valid user ID."});
            });
    },
    // End of get a single user function.

    // Function to create a new user record
    createUser (req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json({ Message: "User creation failed. Please make sure that your request includes a username and an email. Please make sure that this is also a new user."}));
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
        let queriedUsername= '';
        // We query here to retrieve the username of the respective user record
        // and store that in a variable called queriedUsername.
        User.findOne( { _id: req.params.userId })
        .then(async (user) => {
            queriedUsername = user.username;
            console.log(queriedUsername);
        })
        // We user a then function to delete the user that corresponds to the 
        // user ID passed in the API request. 
        .then(() => {
            User.deleteOne( { _id: req.params.userId })
            // Once the user is deleted we make a request to pull all the existing
            // user data so that we can show how many users are left in our API response.
            .then(() => {
                User.find()
                .then(async (users) => {
                    const userObj = {
                        users,
                        userCount: await userCount(),
                    };
                    console.log(`There are ${JSON.stringify(userObj.userCount)} users left. User deleted successfully.`)
                }).catch((err) => {
                    console.log("We were not able to delete the user.")
                });
            })
            .catch((err) => {
                console.log("User deletion unsuccessful.")
            })
        })
        // Using the username that we queried prior to the user being deleted, we can make a delete many request
        // to delete the associated thoughts for that username. 
        .then(() => {
            Thought.deleteMany({ username: queriedUsername })
            .then(() => {
                res.status(200).json({ message: `User: ${queriedUsername} deleted. Thoughts for this user deleted as well.` });
            }).catch((err) => {
                console.log("We were not able to delete the associated user thoughts.")
            })
        })
        .catch((err) => {
            res.status(500).json({ message: "Invalid user, please verify that you have the right user ID"});
        });
    },
    //End of function to delete an existing user record

    // Beginning of function to add friend to user record
    updateUserFriends(req, res) {
        const userFriends = [];
        let userId = req.params.userId;
        let friendId = req.params.friendId;
        let newUserData = {};
        User.findOne( { _id: userId })
        .select('-__v')
        .lean()
        .then((user) => {
            user.friends.forEach((friend) => {
                userFriends.push(friend);
            })
            userFriends.push(friendId);
            return userFriends;
        })
        .then((userFriends) => {
            filter = { _id: userId };
            update = { friends: userFriends }; 
            User.findOneAndUpdate(filter, update, {
                new: true,
            })
            .then((updatedData) => {
                newUserData = updatedData;
                console.log(newUserData);
            })
            .then(() => {
                console.log('User friend list has been updated.');
            })
            .catch((err) => {
                console.log("Could not update the user's friend list");
            });
        })
        .then(() => {
            res.status(200).json({ Message: "User friend list has been updated successfully."});
        })
        .catch((err) => {
            res.status(500).json(err.message);
        })
    },
    // End of function to add friends to user record

    // Beginning of function to remove friend from user record
    removeUserFriend(req, res) {
        const userFriends = [];
        
        let userId = req.params.userId;
        let friendId = req.params.friendId;
        let newUserData = {};

        User.findOne( { _id: userId })
        .then((user) => {
            user.friends.forEach((friend) => {
                userFriends.push(friend);
            })
            const newFriendsArray = userFriends.filter((userFriend) => userFriend != friendId);
            // console.log(newFriendsArray);
            return newFriendsArray;
        })
        .then((newFriendsArray) => {
            const filter = { _id: userId };
            const update = { friends: newFriendsArray };

            User.findOneAndUpdate(filter, update, {
                new: true,
            })
            .then((updatedData) => {
                newUserData = updatedData;
                // console.log(newUserData);
            })
            .then(() => {
                console.log('User friend list has been updated.');
            })
            .catch((err) => {
                console.log("Could not update the user's friend list");
            });
        })
        .then(() => {
            res.status(200).json("Friend removed from user's friend list");
        })
        .catch((err) => {
            res.status(500).json(err.message);
        })
    }
    // End of function to remove friend from user record
// END OF USER ROUTES

};