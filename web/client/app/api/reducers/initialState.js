let initialState = {
    alarms: [],
    lasttrip: {
        enginehours: 0,
        milesdriven: 0,
        faultcode: 0,
        dge_hr: 0,
        totalgasused: 0
    },
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
        alias: 0,
        data: 0,
        lastHeard: 0
    }
}

export default initialState;