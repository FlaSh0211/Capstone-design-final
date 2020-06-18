import { handleActions, createAction } from 'redux-actions';

import { Map, List } from 'immutable';
import { pender } from 'redux-pender';

const SET_MAP ='map/SET_MAP'
const GET_MAP = 'map/GET_MAP'; // car list 받아오기
const SET_PICK_MARKER = 'map/SET_PICK_MARKER'

export const setMap = createAction(SET_MAP); // Obj(Map)
export const getMap = createAction(GET_MAP); // 없음
export const setPickMarker = createAction(SET_PICK_MARKER);

const initialState = Map({
  kakao: window.kakao,
  map: {},
  pickMarker: null,
  result: Map({
    map: false
  })
})

export default handleActions({
  [SET_MAP]: (state, action) => state.set('map', action.payload).set('result', Map({map: true})),
  [GET_MAP]: (state, action) => state.setIn(['header', 'visible'], action.payload),
  [SET_PICK_MARKER]: (state, action) => state.set('pickMarker', action.payload)
}, initialState);