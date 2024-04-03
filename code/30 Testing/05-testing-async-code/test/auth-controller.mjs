import { expect } from 'chai';
import sinon from 'sinon';

import User from '../models/user.js';
import AuthController from '../controllers/auth.js';

describe('Auth Controller -- Login', function () {
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
});
