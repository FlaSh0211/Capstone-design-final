import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'redux/modules/base';
import { AuthWrapper } from 'components/Auth';
import { ListWrapper } from 'components/List';
import { SearchContainer, SearchDetail, SearchDriver} from 'containers/Search';
import { Route, Redirect } from 'react-router-dom';

function Search({ BaseActions, memberInfo, groupInfo, loggedIn }) {
  useEffect(() => {
    BaseActions.setHeaderVisibility(false);
    return () => {
      BaseActions.setHeaderVisibility(true);
    };
  }, [BaseActions]);

  // 검색페이지 접근은 인증된 유저만 가능한지, 아닌지 논의가 필요
  return (
    <ListWrapper>
      <Route path="/search/list" component={ SearchContainer } >
      </Route>
      <Route path="/search/driverSelector/:id" component={ SearchDriver } >
        {memberInfo.role != "driver" && <Redirect to="/" />}
      </Route>
      <Route path="/search/result/:id" component={ SearchDetail } >
      </Route>
    </ListWrapper>
  );
};

export default connect(
  (state) => ({
    loggedIn: state.user.get('logged'),
    memberInfo: state.list.getIn(['courseInfo', 'memberInfo']),
    groupInfo: state.list.getIn(['courseInfo', 'groupInfo'])
  }),
  (dispatch) => ({
      BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(Search);