const connectors = require('./connectors');

const User = require('./models/User');

const resolvers = {
  Query: {
    users() {
      return connectors.User.getUsers()
        .then((users) => {
          return users.map((user) => {
            return {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            };
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  },
  Mutation: {
    signUp(root, args) {
      const errors = [];

      return connectors.Auth.signUp(args)
        .then(token => ({
          token,
          errors
        }))
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });
            return { token: null, errors };
          }

          throw new Error(err);
        });
    },
    signIn(root, args) {
      const errors = [];

      return connectors.Auth.signIn(args)
        .then(token => ({
          token,
          errors
        }))
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });

            return { token: null, errors };
          }

          throw new Error(err);
        });
    }
  }
};

module.exports = resolvers;
