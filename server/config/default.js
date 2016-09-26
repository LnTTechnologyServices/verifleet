"use strict";
var config = {
    CIK: '07b03708551eb9e995fbff5fcbb762cfa079f9ff',
    env: process.env["ENVIRONMENT"],
    auth0: {
        domain: process.env["AUTH0_DOMAIN"],
        client_id: process.env["AUTH0_CLIENT_ID"],
        client_secret: process.env["AUTH0_CLIENT_SECRET"],
        callback: process.env["AUTH0_CALLBACK"] || "/callback"
    },
    db: {
        url: 'postgres://postgres:welcome@localhost:5432/exosite'
    }
};
exports.config = config;
