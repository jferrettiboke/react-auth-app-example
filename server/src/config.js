module.exports = {
  server: {
    host: 'localhost',
    port: 4000
  },
  database: {
    host: 'localhost',
    port: 27017,
    name: 'react_auth_app_example'
  },
  auth: {
    secret: 'super_secret_word', // CHANGE IT!
    expiresIn: 86400 // expires in 24 hours
  }
};
