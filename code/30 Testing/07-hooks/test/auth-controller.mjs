import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';

import User from '../models/user.js';
import AuthController from '../controllers/auth.js';

describe('Auth Controller', function () {
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

    beforeEach(function () {});

    afterEach(function () {});

    it('should throw an error with code 500 if accessing the database fails', function (done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester',
            },
        };
        AuthController.login(req, {}, () => {}).then((result) => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user', function (done) {
        const req = { userId: '5c0f66b979af55031b34728a' };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            },
        };
        AuthController.getUserStatus(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
            done();
        });
    });

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
});
