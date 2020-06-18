import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'redux/modules/base';
import { AdminWrapper } from 'components/Admin';
import { 
  Maintain, 
  HeaderContainer, 
  CarRegister, 
  CarList, 
  CourseList, 
  CourseRegister, 
  CarUpdate, 
  CourseUpdate,
  DriverCtrl } from 'containers/Admin';
import { Route, Redirect } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

const ContentWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`;

function Admin({ BaseActions, loggedIn, history }) {
  useEffect(() => {
    BaseActions.setHeaderVisibility(false);
    return () => {
      BaseActions.setHeaderVisibility(true);
    };
  }, [BaseActions]);

  return (
    <HeaderContainer history={history} >
      <ContentWrapper>
        <Route path="/admin/management" component={ Maintain } >
          {/* {!loggedIn && <Redirect to="/" />} */}
        </Route>
        <Route path="/admin/cars" component={ CarList } >
          {/* {!loggedIn && <Redirect to="/" />} */}
        </Route>
        <Route path="/admin/car/update/:id" component = { CarUpdate } >
           {/* {!loggedIn && <Redirect to="/" />} */}
        </Route>
        <Route path="/admin/courses" component={ CourseList } >
          {/* {!loggedIn && <Redirect to="/" />} */}
        </Route>
        <Route path="/admin/car/register" component={ CarRegister } >
            {/* {!loggedIn && <Redirect to="/" />} */}
        </Route>
        <Route path="/admin/course/register" component={ CourseRegister } >
            {/* {!loggedIn && <Redirect to="/" />} */}
        </Route>
        <Route path="/admin/course/update/:id" component={ CourseUpdate } >
            {/* {!loggedIn && <Redirect to="/" />} */}
        </Route>
      </ContentWrapper>
    </HeaderContainer>

  );
};

export default connect(
  (state) => ({
    loggedIn: state.user.get('logged')
  }),
  (dispatch) => ({
      BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(Admin);