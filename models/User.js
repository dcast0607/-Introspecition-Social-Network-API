const { Schema, model } = require('mongoose');
const { Thought, thoughtSchema } = require('./Thought');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            // We check to make sure that the email entered by the user is valid.
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email address']
        },
        thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought'}],
        friends: [{ type: Schema.Types.ObjectId, ref: 'User'}]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    }
);

// Created a virtual to get the "friendCount" of how many friends a user has.
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});


const User = model('user', userSchema);

module.exports = User;