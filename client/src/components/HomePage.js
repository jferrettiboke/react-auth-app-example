import React from 'react';

import LandingPage from './LandingPage';
import DashboardPageContainer from '../containers/DashboardPageContainer';

export default (props) => (
  props.authenticated ? <DashboardPageContainer /> : <LandingPage />
);
