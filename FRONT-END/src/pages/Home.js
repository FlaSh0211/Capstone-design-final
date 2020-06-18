import React from 'react';
import { FavoriteCarList } from 'containers/List';
import { ListWrapper } from 'components/List';
import { connect } from 'react-redux';
import { HomeController } from 'containers/Information';

function Home({loggedIn, history}) {
  return (
    loggedIn ? 
    <ListWrapper title="My Car List">
      <FavoriteCarList history={history}/>
    </ListWrapper>
    : <HomeController/>
  );
};
export default connect(
  (state) => ({
    loggedIn: state.user.get('logged')
  }),
  (dispatch) => ({
  })
)(Home);