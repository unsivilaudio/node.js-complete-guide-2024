import { expect } from 'chai';

/** MUST ADD FILE EXTENSIONS WHEN USING MJS */
import authMiddleware from '../middleware/is-auth.js';

describe('Auth middleware', function () {
    it('should throw an error if no authorization header is present', function () {
        const req = {
            get: function () {
                return null;
            },
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
            'Not authenticated.'
        );
    });

    it('should throw an error if the authorization header is only one string', function () {
        const req = {
            get: function () {
                return 'xyz';
            },
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });
});
