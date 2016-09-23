import * as types from '../constants';

import initialState from './initialState';

function websocketReducer(state=initialState.websocket, action) {
  switch (action.type) {
  case types.WEBSOCKET_SHOULD_CONNECT:
    return Object.assign({}, state, {shouldConnect: action.shouldConnect});
  case types.WEBSOCKET_CONNECTING:
    console.log("attempts: ", state.attempts);
    return Object.assign({}, state, {connecting: true, connected: false, attempts: state.attempts+1})
  case types.WEBSOCKET_CONNECTED:
    return Object.assign({}, state, {connecting: false, connected: true, lastHeard: moment(), attempts: 1, hasConnected: true})
  case types.WEBSOCKET_DISCONNECTED:
    return Object.assign({}, state, {connected: false});
  case types.WEBSOCKET_INVALID_AUTH:
    return Object.assign({}, state, {connected: false, connecting: false, shouldConnect: false});
  case types.USER_LOGGED_IN:
    return Object.assign({}, state, {connected: false, connecting: false, shouldConnect: true, attempts: 1});
  case types.WEBSOCKET_LIVE_DATA:
    return Object.assign({}, state, {lastHeard: moment()});
  default:
    return state
  }
}

function subscriptionReducer(state=initialState.subscriptions, action) {
  var updatedState;
  switch(action.type) {
    case types.SUBSCRIBE_DEVICES:
      let mapped = _.map(action.rids, function(rid) {
        if(_.isArray(state[rid])) {
          return [rid, _.uniq(state[rid].concat(action.aliases))];
        } else {
          return [rid, action.aliases];
        }
      })
      let updatedState = _.fromPairs(mapped)
      return Object.assign({}, state, updatedState)
    case types.UNSUBSCRIBE_DEVICES:
      if(action.rids) {
        updatedState = _.fromPairs(_.filter(_.map(action.rids, function(rid) {
          if(_.isArray(state[rid])) {
            return [rid, _.difference(state[rid], action.aliases)];
          } else {
            return [null, null]
          }
        }), (x) => x[0]));

        return Object.assign({}, state, updatedState);
      } else {
        return {}
      }
    default:
      return state;
  }
}

export { websocketReducer, subscriptionReducer }
