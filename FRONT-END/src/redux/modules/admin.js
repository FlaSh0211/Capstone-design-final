import { Map } from 'immutable';
import { handleActions, createAction } from 'redux-actions';
import * as AdminAPI from 'lib/api/admin';
import { pender } from 'redux-pender';

const GET_MANAGERS = 'admin/GET_MANAGERS'; // 서버로부터 manager정보를 받아온다.
const UPDATE_MANAGERS = 'admin/UPDATE_MANAGERS'; // 수정된 manager정보를 서버에 저장한다.

export const getManagers = createAction(GET_MANAGERS, AdminAPI.getManagers); // api 요청
export const updateManagers = createAction(UPDATE_MANAGERS, AdminAPI.updateManagers); // api 요청 {Users:[], Drivers:[]}

const initialState = Map({
  // 그룹위 구성원들
  managers: Map({
    Users: [],
    Drivers: []
  }),
  result: Map({})
});

export default handleActions({
  ...pender({
      type: GET_MANAGERS,
      onSuccess: (state, action) => {
        return state.set('managers', Map(action.payload.data)
      )}
  }),
  ...pender({
      type: UPDATE_MANAGERS,
      onSuccess: (state, action) => state.set('result', Map(action.payload.data))
  }),
}, initialState);