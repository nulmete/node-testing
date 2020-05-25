const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function() {
    it('should throw an error if no Authorization header is present', function() {
        const req = {
            get: function() {
                // simulate that there isn't an Authorization header
                return null;
            }
        };
    
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
    });
    
    it('should throw an error if the Authorization header is only one string', function() {
        const req = {
            get: function() {
                return 'xyz';
            }
        };
    
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('should throw an error if the token cannot be verified', function() {
        const req = {
            get: function() {
                return 'Bearer xyz';
            }
        };

        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    })

    it('should yield a userId after decoding the token', function() {
        const req = {
            get: function() {
                return 'Bearer asdasd';
            }
        };
        // change jwt.verify method for this test
        sinon.stub(jwt, 'verify');
        // returns => method added by Sinon
        jwt.verify.returns({ userId: 'abc' });
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        // restore original function
        jwt.verify.restore();
    })
});
