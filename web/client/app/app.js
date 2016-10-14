import angular from 'angular';

// pcc imports
import exosite from 'exosite-pcc/exosite'; // wayyyy faster for rebuilding w/ same module

// moment imports
import moment from 'moment';

// highcharts imports
import highcharts from './vendor/highstock';
highcharts.setOptions({
    global: {
        useUTC: false
    }
});
window.Highcharts = highcharts;

import hsMore from './vendor/highcharts-more';
import hsGauge from './vendor/solid-gauge';
hsMore(highcharts);
hsGauge(highcharts);

// redux imports
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

// redux state reducer imports
import { userReducer, userNotificationReducer, currentUserReducer } from './api/reducers/userReducer';
import { deviceReducer } from './api/reducers/deviceReducer';
import { alarmReducer } from './api/reducers/alarmReducer';
import { lasttripReducer } from './api/reducers/lasttripReducer';
import { activityReducer } from './api/reducers/activityReducer';
import { subscriptionReducer, websocketReducer } from './api/reducers/websocketReducer';
import { loadingReducer, updatedReducer } from './api/reducers';

// api imports
import deviceService from './api/deviceService';
import userService from './api/userService';
import websocket from './api/websocketFactory';


import websocketserver from './services/service';
import VfSharedService from './components/service';


// app specific imports
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';

// javascript extension imports - currently just provides Array.prototype.last()
import './javascriptExtensions';

// a0 configuration
// TODO AUTH: remove this when using Murano login system
let auth0Auth = {
    AUTH0_CLIENT_ID: 'Vggsg6L3VSk8q8JT14Xak4gWmb1z68vZ',
    AUTH0_DOMAIN: 'prashanthypdev.auth0.com',
    AUTH0_CALLBACK_URL: 'http://localhost:3000'
}

// project configuration
import { projectConfig } from './config';

if (!projectConfig.api_base_url) {
    console.error("No 'api_base_url' specified in file './config'!")
}
if (!projectConfig.ws_url) {
    console.error("No 'ws_url' specified in file './config'!")
}
if (!projectConfig.name) {
    console.error("No project name specified in './config'!")
}

// load external modules into our application,
// as well as our internal modules / services / factories
angular.module('app', [
        'ui.router',
        'ngAnimate',
        'ngMaterial',
        'ngMdIcons',
        'ngRedux',
        'auth0',
        'angular-storage',
        'angular-jwt',
        'angularMoment',
        'highcharts-ng',
        'angular-svg-round-progressbar',
        Common.name,
        Components.name,
        exosite.name,
        websocket.name,
    ])
    .service("deviceService", deviceService)
    .service("userService", userService)
    .service("websocketserver", websocketserver)
    .service("VfSharedService", VfSharedService)
    .constant("projectConfig", projectConfig)

.config(($mdThemingProvider) => {
        "ngInject";

        $mdThemingProvider.extendPalette('blue-grey', {
            '500': '001342',
        });
        $mdThemingProvider.extendPalette('yellow', {
            '500': 'ffb91d',
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey', {
                'default': '500'
            })
            .accentPalette('yellow', {
                'default': '500'
            })
    })
    .config($ngReduxProvider => {
        "ngInject";
        // redux store configuration
        // this sets the basic data that's available in the redux store
        // the deviceService / userService / websocketFactory will
        // modify this redux store, and the application's controllers
        // can request data through these services.
        // The controllers should have a hook for the redux store to be triggered
        // when the data has been modified
        $ngReduxProvider.createStoreWith({
            devices: deviceReducer,
            isLoading: loadingReducer,
            lastUpdated: updatedReducer,
            current_user: currentUserReducer,
            lasttrip: lasttripReducer,
            users: userReducer,
            notifications: userNotificationReducer,
            activities: activityReducer,
            alarms: alarmReducer,
            subscriptions: subscriptionReducer,
            websocket: websocketReducer
        }, [thunk, createLogger({
            duration: true,
            collapsed: true
        })]);
    })
    .factory('exositeAuthFactory', () => {
        // TODO AUTH: modify this to use the Murano login system
        return {
            request: (config) => {
                config.headers['Authorization'] = 'Bearer testAuthToken'
                return config
            }
        }
    })
    .config(($httpProvider) => {
        "ngInject";
        $httpProvider.interceptors.push('exositeAuthFactory');
    })
    .config(($httpProvider, authProvider, jwtInterceptorProvider) => {
        "ngInject";

        // TODO AUTH: modify this to use the Murano login system
        authProvider.init({
            clientID: auth0Auth.AUTH0_CLIENT_ID,
            domain: auth0Auth.AUTH0_DOMAIN,
            callbackUrl: auth0Auth.AUTH0_CALLBACK_URL,
            loginState: 'login'
        });

        authProvider.on('loginSuccess', ($location, profilePromise, idToken, store, $ngRedux, userService, websocket, projectConfig) => {
            "ngInject";
            console.log("Login Success");
            profilePromise.then(function(profile) {
                store.set('profile', profile);
                store.set('token', idToken);
                $ngRedux.dispatch(userService.userLoggedIn(store.get('profile')));
                $ngRedux.dispatch(websocket.shouldConnect(true));
                websocket.start(projectConfig.ws_url);
            });
            $location.path('/fuel');
        });

        authProvider.on('authenticated', function($location, store, $ngRedux, userService, websocket) {
            "ngInject";
            console.log("Authenticated successfully");
            $ngRedux.dispatch(userService.userLoggedIn(store.get('profile')));
            $ngRedux.dispatch(websocket.shouldConnect(true));
            // when we're authenticated, tell the websocketFactory to start and connect
            // to the websocket URL
            websocket.start(projectConfig.ws_url);
        });

        jwtInterceptorProvider.tokenGetter = function(store) {
            "ngInject";
            return store.get('token');
        };

        $httpProvider.interceptors.push('jwtInterceptor');

    }).run(($rootScope, auth, store, jwtHelper, $location) => {
        'ngInject';

        $rootScope.$on('$locationChangeStart', function() {
            var token = store.get('token');
            if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                    if (!auth.isAuthenticated) {
                        auth.authenticate(store.get('profile'), token);
                    }
                } else {
                    // Either show the login page or use the refresh token to get a new idToken
                    $location.path('/fuel');
                }
            }
        });
    })

.component('app', AppComponent);