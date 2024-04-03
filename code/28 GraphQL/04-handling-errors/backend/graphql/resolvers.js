const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');

/**
 *  All ROOT RESOLVERS RECEIVE (args, context, info) ARGS
 *  NOTE CONFIGURATION IN app.js INJECTING req,res INTO context ARG
 */
module.exports = {
    createUser: async ({ userInput }, _context, _info) => {
        // const email = source.userInput.email;
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'Email is invalid.' });
        }
        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5 })
        ) {
            errors.push({ message: 'Password too short!' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
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
