import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'redux/modules/base';
import { AuthWrapper } from '../components/Auth';
import { Login, Register, UpdateProfile } from '../containers/Auth';
import { AdminRegister, Maintain } from '../containers/Admin';
import { Register as GroupRegister } from '../containers/Group';
import { Route, Redirect } from 'react-router-dom';

function Auth({ BaseActions, loggedIn }) {
  useEffect(() => {
    BaseActions.setHeaderVisibility(false);
    return () => {
      BaseActions.setHeaderVisibility(true);
    };
  }, [BaseActions]);

  return (
    <AuthWrapper>
      <Route path="/auth/login" component={ Login } >
        {loggedIn && <Redirect to="/" />}
      </Route>
      <Route path="/auth/register" component={ Register } >
        {loggedIn && <Redirect to="/" />}
      </Route>
      <Route path="/auth/profile" component={ UpdateProfile } >
        {!loggedIn && <Redirect to="/" />}
      </Route>
      <Route path="/auth/admin/register" component={ AdminRegister } >
        {!loggedIn && <Redirect to="/" />}
      </Route>
      <Route path="/auth/admin/management" component={ Maintain } >
        {!loggedIn && <Redirect to="/" />}
      </Route>
      <Route path="/auth/group/register/:id" component={ GroupRegister } >
        {!loggedIn && <Redirect to="/" />}
      </Route>
    </AuthWrapper>
  );
};

export default connect(
  (state) => ({
    loggedIn: state.user.get('logged')
  }),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(Auth);