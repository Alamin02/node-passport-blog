const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('Unit testing the / route', function() {
    describe('Unit Testing Home page', function() {
        it('Should return OK status if / is found', function() {
            return request(app)
                .get('/')
                .then(function(response) {
                    assert.equal(response.status, 200);
                });
        });

        it('should contain some text on rendering', function() {
            return request(app)
                .get('/')
                .then(function(response) {
                    expect(response.text).to.contain('Home');
                });
        });
    });

    describe('Unit testing the Post Description page', function() {
        it('Should return OK status if /post/:postID is valid', function() {
            return (
                request(app)
                    // Here, the post ID should be valid
                    .get('/post/5c514ee2b2832a05344c157d')
                    .then(function(response) {
                        assert.equal(response.status, 200);
                    })
            );
        });

        it('Should contain "Author" if /post/:postID is valid', function() {
            return (
                request(app)
                    // Here, the post ID should be valid
                    .get('/post/5c514ee2b2832a05344c157d')
                    .then(function(response) {
                        expect(response.text).to.contain('Author');
                    })
            );
        });

        it('Should redirect if /post/:postID is invalid', function() {
            return request(app)
                .get('/post/dafjhdjkasfh')
                .then(function(response) {
                    assert.equal(response.status, 302);
                });
        });
    });
});

describe('Unit testing the /users route', function() {
    it('Should return OK status if /users is found', function() {
        return request(app)
            .get('/users')
            .then(function(response) {
                assert.equal(response.status, 200);
            });
    });

    it('Should return OK if Login page is found', function() {
        return request(app)
            .get('/users/login')
            .then(function(response) {
                assert.equal(response.status, 200);
            });
    });

    it('should contain heading -> "Login page" on rendering', function() {
        return request(app)
            .get('/users/login')
            .then(function(response) {
                expect(response.text).to.contain('Login page');
            });
    });

    it('Should respond with redirect on Login', function() {
        return request(app)
            .post('/users/login')
            .send({ username: 'new_user', password: '1234' })
            .then(function(response) {
                console.log(response.status);
                assert.equal(response.status, 302);
            });
    });

    it('Should return OK if Signup page is found', function() {
        return request(app)
            .get('/users/signup')
            .then(function(response) {
                assert.equal(response.status, 200);
            });
    });

    it('Should return 302 if Logout successfully redirects', function() {
        return request(app)
            .get('/users/logout')
            .then(function(response) {
                assert.equal(response.status, 302);
            });
    });
});
