import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import DashboardPage from '../components/DashboardPage';

const usersQuery = gql`
  query {
    users {
      id
      firstName
      lastName
      email
    }
  }
`;

const DashboardPageWithData = graphql(usersQuery)(DashboardPage);

export default DashboardPageWithData;
