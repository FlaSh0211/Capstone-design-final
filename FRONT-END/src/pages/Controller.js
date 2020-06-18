import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'redux/modules/base';
import { AuthWrapper } from 'components/Auth';
import { ListWrapper } from 'components/List';
import { DriverCtrl} from 'containers/Controller';
import { Route, Redirect } from 'react-router-dom';
import storage from 'lib/storage';

function Controller({ BaseActions, memberInfo, groupInfo, driverInfo, loggedIn }) {
  const auth = storage.get('driverInfo')
    ? storage.get('driverInfo').auth
    : driverInfo.auth;

  useEffect(() => {
    BaseActions.setHeaderVisibility(false);
    return () => {
      BaseActions.setHeaderVisibility(true);
    };
  }, [BaseActions]);

  // 검색페이지 접근은 인증된 유저만 가능한지, 아닌지 논의가 필요
  return (
    <ListWrapper>
      <Route path="/controller/driver" component={ DriverCtrl } >
          {/* {!loggedIn && <Redirect to="/" />} */}
          {!auth && <Redirect to="/" />}
      </Route>
    </ListWrapper>
  );
};

export default connect(
  (state) => ({
    loggedIn: state.user.get('logged'),
    memberInfo: state.list.getIn(['courseInfo', 'memberInfo']),
    groupInfo: state.list.getIn(['courseInfo', 'groupInfo']),
    driverInfo: state.list.get('driverInfo').toJS(),
  }),
  (dispatch) => ({
      BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(Controller);