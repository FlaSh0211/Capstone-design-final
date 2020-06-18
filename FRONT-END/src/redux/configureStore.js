import { createStore, applyMiddleware, compose } from 'redux';
import penderMiddleware from 'redux-pender';
import logger from 'redux-logger';
import ReduxThunk from 'redux-thunk';   
import modules from './modules';

// Store를 생성해서 반환하는 fuction 입니다.
const configureStore = (initialState) => {
    const devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    const composeEnhancers = devTools || compose;

    const middlewares = [ReduxThunk, penderMiddleware(), logger];

    const store = createStore(modules, composeEnhancers(
        applyMiddleware(...middlewares)
    ));
    return store;
}

export default configureStore;