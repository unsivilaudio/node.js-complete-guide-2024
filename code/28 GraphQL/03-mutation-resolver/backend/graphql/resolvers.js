const bcrypt = require('bcryptjs');

const User = require('../models/user');

/**
 *  All ROOT RESOLVERS RECEIVE (args, context, info) ARGS
 *  NOTE CONFIGURATION IN app.js INJECTING req,res INTO context ARG
 */
module.exports = {
    createUser: async ({ userInput }, _context, _info) => {
        // const email = source.userInput.email;
        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
            const error = new Error('User exists already!');
            throw error;
        }

        const hashPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashPw,
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
};
