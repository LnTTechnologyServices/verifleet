import initialState from './initialState';
import * as types from '../constants';
import { activityReducer, deviceReducer, currentUserReducer, userReducer, alarmReducer } from './';

import { devices, users } from './data';

describe('activityReducer', () => {
  it('should return the initial state', () => {
    let reduced = activityReducer(undefined, {});
    let expected = initialState.activities;
    expect(reduced).to.deep.equal(expected);
  })

   it('should handle RECEIVE_DEVICES', () => {
     let reduced = activityReducer([], {
       type: types.RECEIVE_DEVICES,
       devices: devices
     })

     // this is the data that should be derived from data.js
     let expectedActivities = [
      {
        "subtitle": "test@example.com",
        "title": "I turned it on",
        "timestamp": 12321,
        "did": "1234321234"
       }
     ]
     expect(reduced).to.deep.equal(expectedActivities)
   });

})

describe('deviceReducer', () => {
  it('should return the initial state', () => {
    let reduced = deviceReducer(undefined, {});
    let expected = initialState.devices;
    expect(reduced).to.deep.equal(expected);
  })

   it('should handle RECEIVE_DEVICES', () => {

     let reduced = deviceReducer([], {
       type: types.RECEIVE_DEVICES,
       devices: devices
     })

     // this is the data that should be derived from data.js
     let expected = devices

     expect(reduced).to.deep.equal(expected)
   });
});

describe('currentUserReducer', () => {
  it('should return the initial state', () => {
    let reduced = currentUserReducer(undefined, {});
    let expected = initialState.current_user;
    expect(reduced).to.deep.equal(expected);
  })

  it('should apply the profile to current_user when receiving a USER_LOGGED_IN', () => {
    let profile = {
      email: "test@example.com",
      name: "mr. test"
    }
    let reduced = currentUserReducer(profile, {
      type: types.USER_LOGGED_IN,
      profile: profile
    });
    let expected = profile;
    expect(reduced).to.deep.equal(expected);
  })
})

describe('userReducer', () => {
  it('should return the initial state', () => {
    let reduced = userReducer(undefined, {});
    let expected = initialState.users;
    expect(reduced).to.deep.equal(expected);
  })

  it('should return the given users', () => {
    let expectedUsers = users;
    let reduced = userReducer(undefined, {
      type: types.RECEIVE_USERS,
      users: users
    });
    expect(reduced).to.deep.equal(expectedUsers);
  })
})
