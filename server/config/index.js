"use strict";
var dotenv = require('dotenv');
dotenv.load();
var config = {
    env: process.env["ENVIRONMENT"],
    CIK: '07b03708551eb9e995fbff5fcbb762cfa079f9ff',
    APP_SECRET: process.env["APP_SECRET"],
    auth0: {
        domain: process.env["AUTH0_DOMAIN"],
        client_id: process.env["AUTH0_CLIENT_ID"],
        client_secret: process.env["AUTH0_CLIENT_SECRET"],
        callback: process.env["AUTH0_CALLBACK"]
    },
    database: {
        url: process.env["DATABASE_URL"] || 'postgres://postgres:admin@localhost:5432/exosite',
        options: {
            dialect: 'postgres',
            pool: {
                max: 10,
                min: 0,
                idle: 10000
            },
            logging: false
        }
    }
};
exports.config = config;
//# sourceMappingURL=index.js.map