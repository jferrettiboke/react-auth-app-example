import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { signOut } from '../actions';
import Navbar from '../components/Navbar';

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated
});

const mapDispatchToProps = (dispatch) => ({
  logout() {
    dispatch(signOut());
    browserHistory.push('/');
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
