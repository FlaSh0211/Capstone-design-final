import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from 'redux/modules/map';

const KaKaoMap = ({MapActions, kakaoMap, kakao}) => {

  return <div id="kakao-map" style={{ height: "100%", minHeight: 500 }}></div>
}

export default connect(
  (state) => ({
    kakaoMap: state.map.get('map'),
    kakao: state.map.get('kakao')
  }),
  (dispatch) => ({
    MapActions: bindActionCreators(mapActions, dispatch)
  })
)(KaKaoMap);