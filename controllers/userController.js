// We bring in the required objects/packages here. 

const { ObjectId } = require('mongoose').Types;

const { User, Reaction, Thought } = require('../models');

// We use a function that was imported from the users model.

const userCount = async () => 
    User.aggregate()
        .count('userCount')
        .then((numberOfUsers) => numberOfUsers);



// We define the individual user functions here. This is what defines
// how the api requests will be handled. 
module.exports = {

// USER ROUTES

    // Function to get all users and number of users.
    getUsers(req, res) {
        // We invoke the find() method to retrieve all users from the
        // database.
        User.find()
        //Users data is returned here and presented to the user as an API response. 
            .then(async (users) => {
                const userObj = {
                    users,
                    userCount: await userCount(),
                };
                return res.status(200).json(userObj);
            })
            // If we encounter an error we return the error to the user and return
            // a 500 error. 
            .catch((error) => {
                console.log(error);
                return res.status(500).json(err);
            })
    },
    // End of function to get all users and number of users.

    // Get a single user function
    getSingleUser(req, res) {
        // We take the userId that is sent as part of the APi request and
        // we use this to pull an individual user record. We then parse
        // though this record and display the data to the user. 
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .lean()
            .then(async (user) =>
            // If no user record is returned, we return a 404 error letting
            // the user know that no user was found.
                !user
                ? res.status(404).json({ message: 'No such user with that ID'})
                // If we do find a user we record a 200 code and return the individual user
                // object. 
                : res.status(200).json({
                    user
                    })
                )
                // If the findOne() request fails, we return the following error message.
            .catch((error) => {
                return res.status(500).json({ Message: "User does not exist with that user ID, please try again with a valid user ID."});
            });
    },
    // End of get a single user function.

    // Function to create a new user record
    createUser (req, res) {
        // create() method is invoked to create a new user. On our users
        // schema we have defined the necessary information that is required
        // to create a new user record. If some information is missing we 
        // return an error indicating that the right information is not present.
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json({ Message: "User creation failed. Please make sure that your request includes a username and an email. Please make sure that this is also a new user."}));
    },
    // End of function to create a new user record.

    // Function to update an existing user record
    // and return updated user record
    updateUser (req, res) {
        // We store the information that is sent to us in our API request
        // so that this can be used to update the existing user record. 

        // Filter is used to define what record needs to be updated.
        const filter = { _id: req.params.userId };
        // Update defines the data that we will be updating.
        const update = { 
            username: req.body.username,
            email: req.body.email,
        };
        User.findOneAndUpdate( filter, update, {
            new: true
        })
        // If the request succeeds, we return the updated record to the user. 
        .then((user) => res.status(200).json(user))
        // If the request fails, we return an error code and let the user know that
        // we were not able to update the user record.
        .catch((err) => res.status(500).json({ Message: "Could not identify user with the supplied user ID. Please try again with a valid user ID."}));
    },
    // End of user update function

    // Function to delete an existing user record

    // I played around with different ways to delete a user record, 
    // I wanted to give myself a challenge here to see how else we could
    // delete a user record. 
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
    // Again, wanted to give myself a challenge by using array methods
    // to change the existing data in the database. 
    updateUserFriends(req, res) {
        // We declare some variables here and we defined some of those
        // variables so that we can use them in subsequent queries.
        const userFriends = [];
        let userId = req.params.userId;
        let friendId = req.params.friendId;
        let newUserData = {};
        // We pull the user record that matches the userId send in the
        // api request.
        User.findOne( { _id: userId })
        .select('-__v')
        .lean()
        .then((user) => {
            // We cycle through the data that is returned for the user
            // and create a new array that contains the existing friends
            // data for this user.
            user.friends.forEach((friend) => {
                userFriends.push(friend);
            })
            // Once we have created the array with the existing friends data
            // we "push" the newly submitted friends data to create a new array
            // that contains both the old data and the new data in the API request.
            userFriends.push(friendId);
            return userFriends;
        })
        // We then use this function to update the existing user data with the newly
        // created friends array that contains both the old data and the new data.
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
            res.status(500).json({Message: "Please include a valid user ID in your request and then try again."});
        })
    },
    // End of function to add friends to user record

    // Beginning of function to remove friend from user record
    // We are using a similar overall logic as to the function above, however, in this
    // case we are removing the array element from the friends array instead of 
    // adding data to it. 
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
            res.status(200).json({ message: "Friend removed from user's friend list."} );
        })
        .catch((err) => {
            res.status(500).json({ Message: "Unable to remove friend from user's friend list. Please try again and make sure you have included the required information."});
        })
    }
    // End of function to remove friend from user record
// END OF USER ROUTES

};