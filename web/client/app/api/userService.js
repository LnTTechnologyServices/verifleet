import * as types from './constants';

function requestUser(id) {
  return {
    type: types.REQUEST_USER,
    id: id
  }
}

function receiveUser(user) {
  return {
    type: types.RECEIVE_USER,
    user: user
  }
}

function requestUsers() {
  return {
    type: types.REQUEST_USERS
  }
}

function receiveUsers(users) {
  return {
    type: types.RECEIVE_USERS,
    users: users
  }
}

function receiveCurrentUser(profile) {
  return {
    type: types.USER_LOGGED_IN,
    profile: profile
  }
}

function removeCurrentUser() {
  return {
    type: types.USER_LOGGED_OUT
  }
}

function requestUserNotifications(email) {
  return {
    type: types.REQUEST_USER_NOTIFICATIONS,
    email: email
  }
}

function receiveUserNotifications(notifications, email) {
  return {
    type: types.RECEIVE_USER_NOTIFICATIONS,
    notifications: notifications,
    email: email
  }
}

export default function userService($http, projectConfig) {
  "ngInject";
  function getUsers() {
    return dispatch => {
      dispatch(requestUsers())
      return $http.get(`${projectConfig.api_base_url}/users`)
        .then(response => response.data.results)
        .then(users => dispatch(receiveUsers(users)))
    }
  }

  function shouldGetUsers(state, timeout) {
    const { users, isLoading, lastUpdated } = state;
    if (isLoading.users) {
      return false;
    }
    if(lastUpdated.users === 0 || moment() > (lastUpdated.users + timeout*1000)) {
        return true
    }
    return false;
  }

  function getUsersIfNeeded(timeout=60) {
    return (dispatch, getState) => {
      if (shouldGetUsers(getState(timeout))) {
        return dispatch(getUsers());
      }
    };
  }

  function getUser(email) {
    return dispatch => {
      dispatch(requestUser(email));
      return $http({
        url: `${projectConfig.api_base_url}/users`,
        method: "GET",
        params: {"email": email}
      })
        .then(response => {
          return response.data
        })
        .then(user => dispatch(receiveUser(user)))
    }
  }

  /**
   * Load the User's notifications.
   * @param email
   */
  function getUserNotifications(email) {
    return dispatch => {
      dispatch(requestUserNotifications(email));
      return $http({
        url: `${projectConfig.api_base_url}/users/notifications`,
        method: "GET",
        params: {"email": email }
      })
        .then(response => {
          return response.data
        })
        .then(userNotifications => {
          dispatch(receiveUserNotifications(userNotifications, email))
        })
    }
  }

  /**
   * @param preferencesObj: An object with the following properties:
   *  email - the email address of the user whose notification settings are being modified
   *  rid - device identifier
   *  sms  - (boolean) indicates whether user should receive sms notifications
   *  receive_email - (boolean) indicates whether user should receive email notifications
   */
  function setUserNotifications(preferencesObj) {
    return dispatch => {
      return $http({
        url: `${projectConfig.api_base_url}/users/notifications`,
        method: 'POST',
        data: preferencesObj
      })
        .then(response => {
          return response.data
        })
        .then(userNotifications => {
          dispatch(receiveUserNotifications(userNotifications, preferencesObj.email))
        })
    }
  }

  function userLoggedOut() {
    return dispatch => {
      dispatch(removeCurrentUser())
    }
  }

  function userLoggedIn(profile) {
    return dispatch => {
      dispatch(receiveCurrentUser(profile))
    }
  }

  return {
    getUsers,
    getUsersIfNeeded,
    getUser,
    getUserNotifications,
    setUserNotifications,
    userLoggedIn,
    userLoggedOut
  }

}
