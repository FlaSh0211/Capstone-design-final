import React, { useEffect, useState } from 'react';
import { KaKaoMap, KaKaoSearch, MapController } from 'components/Map';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mapActions from 'redux/modules/map';
import * as authActions from 'redux/modules/auth';
import 'css/kakaoMap.css';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function MapSelector({kakaoMap, pickMarker, kakao, mapResult, position, setPosition}) {
  const classes = useStyles();
  const [btn, setBtn] = useState({
      search: true
  });

  const {search} = btn;
  const map = kakaoMap;
  const marker = pickMarker;

  if(mapResult){
    // 지도에 마커를 표시합니다
    marker.setMap(map);
    // 지도에 클릭 이벤트를 등록합니다
    // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
        
      // 클릭한 위도, 경도 정보를 가져옵니다 
      var latlng = mouseEvent.latLng; 
      
      // 마커 위치를 클릭한 위치로 옮깁니다
      marker.setPosition(latlng);
      
      var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
      message += '경도는 ' + latlng.getLng() + ' 입니다';
      
      var resultDiv = document.getElementById('clickLatlng'); 
      resultDiv.innerHTML = message;

      setPosition({
        ...position,
        longitude: latlng.getLng(),
        latitude: latlng.getLat()
      })
    });
  }
  const searchBtn = () => {
    console.log(search)
    var searchBox = document.getElementById('menu_wrap'); 
    if(search){
        console.log(search)
        searchBox.style.display = "none"
    }else{
        searchBox.style.display = "block"
    }
    setBtn({...btn, search: !btn.search})
  }
  const addCourseBtn = ({idx, stationName, position}) => {
    const station = {
      stationName,
      longitude: position.longitude,
      latitude: position.latitude
    }
    const update = position.stations.map(value => value);
    update[idx]=station

    setPosition({
      ...position,
      stations: update
    })
  }

  return (
    <>
    <MapController searchBtn={searchBtn} addCourseBtn={addCourseBtn} position={position}/>
    <div className="map_wrap">
      <KaKaoMap/>

      <KaKaoSearch id="kakaoSearchBtn"/>
    </div>
    <p><em>지도를 클릭해주세요!</em></p> 
    <div id="clickLatlng"></div>
    </>
  );
};
export default connect(
  (state) => ({
    kakaoMap: state.map.get('map'),
    pickMarker: state.map.get('pickMarker'),
    kakao: state.map.get('kakao'),
    mapResult: state.map.get('result').toJS().map,
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    MapActions: bindActionCreators(mapActions, dispatch)
  })
)(MapSelector);