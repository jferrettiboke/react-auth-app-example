const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');

const User = require('../src/models/User');

const server = require('../src/server');

describe('Graph API', () => {
  after((done) => {
    User.remove({})
      .then(() => done());
  });

  describe('mutation', () => {
    describe('signUp', () => {
      it('returns an error when email is empty', (done) => {
        const query = `
          mutation {
            signUp(
              firstName: "John"
              lastName: "Taylor"
              email: ""
              password: "123"
            ) {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signUp: {
                  token: null,
                  errors: [{ key: 'email.empty', value: 'Email is empty.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when email is invalid', (done) => {
        const query = `
          mutation {
            signUp(
              firstName: "John"
              lastName: "Taylor"
              email: "johndomain.com"
              password: "123"
            ) {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signUp: {
                  token: null,
                  errors: [{ key: 'email.invalid', value: 'You have to provide a valid email.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when password is empty', (done) => {
        const query = `
          mutation {
            signUp(
              firstName: "John"
              lastName: "Taylor"
              email: "john@domain.com"
              password: ""
            ) {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signUp: {
                  token: null,
                  errors: [{ key: 'password.empty', value: 'You have to provide a password.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns a user token after create the user with no errors', (done) => {
        const query = `
          mutation {
            signUp(
              firstName: "John"
              lastName: "Taylor"
              email: "john@domain.com"
              password: "123"
            ) {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            const obj = JSON.parse(res.text);
            const { token, errors } = obj.data.signUp;
            expect(token).to.not.be.null; // eslint-disable-line no-unused-expressions
            expect(token).to.be.a('string');
            expect(errors).to.be.empty; // eslint-disable-line no-unused-expressions
            return done();
          });
      });

      it('returns an error when user already exists with the same email', (done) => {
        const query = `
          mutation {
            signUp(
              firstName: "Alice"
              lastName: "Brown"
              email: "john@domain.com"
              password: "789"
            ) {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signUp: {
                  token: null,
                  errors: [{ key: 'user.exists', value: 'There is already a user with this email.' }]
                }
              }
            });
            return done();
          });
      });
    });

    describe('signIn', () => {
      it('returns an error when email is empty', (done) => {
        const query = `
          mutation {
            signIn(email: "", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signIn: {
                  token: null,
                  errors: [{ key: 'email.empty', value: 'Email is empty.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when email is invalid', (done) => {
        const query = `
          mutation {
            signIn(email: "johndomain.com", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signIn: {
                  token: null,
                  errors: [{ key: 'email.invalid', value: 'You have to provide a valid email.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when password is empty', (done) => {
        const query = `
          mutation {
            signIn(email: "john@domain.com", password: "") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signIn: {
                  token: null,
                  errors: [{ key: 'password.empty', value: 'You have to provide a password.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when the user does not exist', (done) => {
        const query = `
          mutation {
            signIn(email: "johnnn@domain.com", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signIn: {
                  token: null,
                  errors: [{ key: 'user.not_found', value: 'Authentication failed. User not found.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when the password is wrong', (done) => {
        const query = `
          mutation {
            signIn(email: "john@domain.com", password: "abc") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signIn: {
                  token: null,
                  errors: [{ key: 'password.wrong', value: 'Wrong password.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns a user token after log in the user with no errors', (done) => {
        const query = `
          mutation {
            signIn(email: "john@domain.com", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            const obj = JSON.parse(res.text);
            const { token, errors } = obj.data.signIn;
            expect(token).to.not.be.null; // eslint-disable-line no-unused-expressions
            expect(token).to.be.a('string');
            expect(errors).to.be.empty; // eslint-disable-line no-unused-expressions
            return done();
          });
      });
    });
  });
});
