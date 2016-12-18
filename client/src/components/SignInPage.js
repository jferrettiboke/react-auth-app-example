import React from 'react';

import SignInFormContainer from '../containers/SignInFormContainer';

export default () => (
  <div className="container">
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <h1>Sign in</h1>
        <hr />
        <SignInFormContainer />
      </div>
    </div>
  </div>
);
