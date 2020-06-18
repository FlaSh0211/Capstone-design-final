import React, { useEffect } from 'react';
import { InputWithLabel, AuthButton, AuthError } from 'components/Auth';
import { AdminContent, ManagerBox, AdminStepper } from 'components/Admin';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'redux/modules/auth';
import * as userActions from 'redux/modules/user';
import * as adminActions from 'redux/modules/admin';
import storage from 'lib/storage';
import {isEmail, isLength, isAlphanumeric} from 'validator';
import debounce from 'lodash/debounce';
import Paper from '@material-ui/core/Paper';
import UsersTransferList from './UsersTransferList';


function Maintain({managers, result, AdminActions, history}) {
  return (
    <>
    <UsersTransferList managers={managers} result={result} AdminActions={AdminActions} history={history} />
    </>
  );
};

export default connect(
  (state) => ({
    managers: state.admin.get('managers').toJS(),
    result: state.admin.get('result')
  }),
  (dispatch) => ({
    AdminActions: bindActionCreators(adminActions, dispatch),

  })
)(Maintain);