import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';

import User from '../models/user.js';
import Post from '../models/post.js';
import FeedController from '../controllers/feed.js';

describe('Feed Controller', function () {
    before(function (done) {
        /** REPLACE CONNECTION STRING IF USING ATLAS
         *  "mongodb+srv://<username>:<password>@<cluster-id>.mongodb.net/<dbName>?retryWrites=true&authSource=admin"
         */
        mongoose
            .connect(
                'mongodb://127.0.0.1:27017/test-messages?retryWrites=true&authSource=admin'
            )
            .then(() => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'tester',
                    name: 'Test',
                    posts: [],
                    _id: '5c0f66b979af55031b34728a',
                });
                return user.save();
            })
            .then(() => {
                done();
            });
    });

    it('should add a created post to the posts of the creator', function (done) {
        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post.',
            },
            file: {
                path: 'abc',
            },
            userId: '5c0f66b979af55031b34728a',
        };
        const res = {
            status: function () {
                return this;
            },
            json: function () {},
        };
        FeedController.createPost(req, res, () => {}).then((savedUser) => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        });
    });

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                /** cleanup Posts */
                return Post.deleteMany({});
            })
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
});
