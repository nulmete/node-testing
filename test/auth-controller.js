const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', function() {
    // Connect to DB and create a new user before executing npm test
    before(function(done)  {
        mongoose
            .connect('mongodb+srv://nicolas:nicolas@cluster0-xf55q.mongodb.net/test-messages?retryWrites=true')
            .then(() => {
                const user = new User({
                    email: 'test2@test2.com',
                    password: 'tester2',
                    name: 'Test2',
                    posts: [],
                    _id: '5c0f66b979af55031b35551a'
                });
                return user.save();
            })
            .then(() => {
                done();
            })
    });

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

    it('should send a response with a valid user status for an existing user', function(done) {
        const req = { userId: '5c0f66b979af55031b35551a' };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.userStatus = data.status;
            }
        };
        AuthController.getUserStatus(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
            done();
        });
    });

    // Delete dummy user & disconnect from DB
    after(function(done) {
        User
            .deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    })
});
