import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { reducer as formReducer } from 'redux-form';

import { AUTH_SIGNIN } from './actions';
import authReducer from './reducers/authReducer';
import RequireAuth from './containers/RequireAuth';
import App from './components/App';
import NoMatch from './components/NoMatch';
import HomePageContainer from './containers/HomePageContainer';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import DashboardPageContainer from './containers/DashboardPageContainer';

const token = localStorage.getItem('token');
const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql' });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }

    // Get the authentication token from local storage if it exists
    req.options.headers.token = token ? token : null;
    next();
  }
}]);

const client = new ApolloClient({
  networkInterface
});

const store = createStore(
  combineReducers({
    apollo: client.reducer(),
    form: formReducer,
    auth: authReducer,
  }),
  {}, // initial state
  compose(
      applyMiddleware(client.middleware()),
      // If you are using the devToolsExtension, you can add it here also
      window.devToolsExtension ? window.devToolsExtension() : f => f,
  )
);

if (token) {
  // We need to update application state if the token exists
  store.dispatch({ type: AUTH_SIGNIN });
}

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
      <Route path="/" component={App}>
        <IndexRoute component={HomePageContainer} />
        <Route path="signup" component={SignUpPage} />
        <Route path="signin" component={SignInPage} />
        <Route path="dashboard" component={RequireAuth(DashboardPageContainer)} />
        <Route path="*" component={NoMatch} />
      </Route>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);
