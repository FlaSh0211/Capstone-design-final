import { Map } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

const SET_HEADER_VISIBILITY = 'base/SET_HEADER_VISIBILITY'; // 헤더 렌더링 여부 설정
const SET_ADMIN_HEADER_VISIBILITY = 'base/SET_ADMIN_HEADER_VISIBILITY'; // 헤더 렌더링 여부 설정

export const setHeaderVisibility = createAction(SET_HEADER_VISIBILITY); // visible
export const setAdminHeaderVisibility = createAction(SET_HEADER_VISIBILITY); // visible

const initialState = Map({
    header: Map({
        default: true,
        admin: false,
    })
});

export default handleActions({
    [SET_HEADER_VISIBILITY]: (state, action) => state.setIn(['header', 'default'], action.payload),
    [SET_ADMIN_HEADER_VISIBILITY]: (state, action) => state.setIn(['header', 'admin'], action.payload),
}, initialState);