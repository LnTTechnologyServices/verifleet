import * as types from '../constants';

import initialState from './initialState';

function reduceUser(user) {
  return user;
}

function userReducer(state=initialState.users, action) {
  switch (action.type) {
  case types.RECEIVE_USERS:
    return action.users.map(user => reduceUser(user))
  case types.RECEIVE_USER:
    if(state.length > 0) {
      return state.map(user => {
        if(user.email === action.user.email) {
          return user
        } else {
          return user
        }
      })
    } else {
      return [action.user];
    }
  default:
    return state;
  }
}

function userNotificationReducer(state = initialState.notifications, action) {
  switch(action.type) {
    case types.REQUEST_USER_NOTIFICATIONS:
      return state;
    case types.RECEIVE_USER_NOTIFICATIONS:
      if(state.length > 0) {
        return state.map(notification => {
          if(notification.email === action.email) {
            return notification
          }
        })
      } else {
        return [action.notifications];
      }
    default:
      return state;
  }
}

function currentUserReducer(state=initialState.current_user, action) {
  switch(action.type) {
    case types.USER_LOGGED_IN:
      return action.profile;
    case types.USER_LOGGED_OUT:
      return {};
    default:
      return state;
  }
}

export { userReducer, userNotificationReducer, currentUserReducer }
