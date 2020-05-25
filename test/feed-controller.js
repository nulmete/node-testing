const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function() {
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
    it('should add a created post to the posts of the creator', function(done) {
        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post'
            },
            file: {
                path: 'abc'
            },
            userId: '5c0f66b979af55031b35551a'
        };

        const res = {
            status: function() {
                return this;
            },
            json: function() {}
        };

        FeedController.createPost(req, res, () => {})
            .then(savedUser => {
                expect(savedUser).to.have.property('posts');
                expect(savedUser.posts).to.have.length(1);
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
