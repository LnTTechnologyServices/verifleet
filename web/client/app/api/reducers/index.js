import * as types from '../constants';
import initialState from './initialState';

function loadingReducer(state=initialState.isLoading, action) {
  switch (action.type) {
  case types.REQUEST_DEVICES:
    return Object.assign({}, state, {devices: true})
  case types.RECEIVE_DEVICES:
    return Object.assign({}, state, {devices: false})
  case types.REQUEST_DEVICE:
    return Object.assign({}, state, {device: true})
  case types.RECEIVE_DEVICE:
    return Object.assign({}, state, {device: false})
  case types.REQUEST_USERS:
    return Object.assign({}, state, {users: true})
  case types.RECEIVE_USERS:
    return Object.assign({}, state, {users: false})
  default:
    return state
  }
}

function updatedReducer(state=initialState.lastUpdated, action) {
  switch (action.type) {
  case types.RECEIVE_DEVICES:
    return Object.assign({}, state, {devices: moment()})
  case types.RECEIVE_DEVICE:
    return Object.assign({}, state, {device: moment()})
  case types.RECEIVE_USERS:
    return Object.assign({}, state, {users: moment()})
  default:
    return state
  }
}

export { loadingReducer, updatedReducer };
