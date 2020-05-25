const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', function() {
    // Add 'done' argument to test async code
    it('should throw an error if accessing the DB fails', function(done) {
        // overwrite User.findOne
        sinon.stub(User, 'findOne');
        // throw an error
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };

        AuthController.login(req, {}, () => {}).then(result => {
            // console.log(result);
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            // signal Mocha to wait until this code is executed to finish the test
            done();
        });

        User.findOne.restore();
    });
});
