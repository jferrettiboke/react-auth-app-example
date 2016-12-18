const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { apolloExpress, graphiqlExpress } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const { server, database } = require('./config');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const { getTokenFromRequest } = require('./utils/auth');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${database.host}:${database.port}/${database.name}`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('We are connected!'));

const app = express();
const schema = makeExecutableSchema({ typeDefs, resolvers });
var corsOptions = { origin: 'http://localhost:3000' };

app.use(cors(corsOptions));

app.use('/graphql', bodyParser.json(), apolloExpress(request => ({
  schema,
  context: { token: getTokenFromRequest(request) }
})));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(server.port, () => console.log(`Now browse to ${server.host}:${server.port}/graphiql`));

module.exports = app;
