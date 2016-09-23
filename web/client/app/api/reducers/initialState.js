let initialState = {
  alarms: [],
  activities: [],
  current_user: {},
  devices: [],
  users: [],
  notifications: [],
  lastUpdated: {
    device: 0,
    devices: 0,
    user: 0,
    users: 0
  },
  subscriptions: {},
  isLoading: {
    device: false,
    devices: false,
    users: false
  },
  websocket: {
    attempts: 0,
    connecting: false,
    connected: false,
    hasConnected: false,
    shouldConnect: true,
    lastHeard: 0
  }
}

export default initialState;
