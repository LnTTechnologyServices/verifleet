# Example API Server and type definitions 

Original source from: https://github.com/czechboy0/Express-4x-Typescript-Sample & the Auth0 NodeJS / Angular seed apps

Requirements
------------

* [nodejs & npm](https://nodejs.org/en/) - (using 4.X locally)
* [Postgres](https://www.postgresql.org/download/) - a newer version (>9.4) that supports JSONB
* [Auth0](https://auth0.com/) account for authentication

This project uses Typescript, so using an editor that supports automatic building (like Atom) is definitely helpful.

Setup
_____

To get setup, run `./setup.sh` which should handle grabbing the dependencies you need.

You will need to set up an Auth0 account and get a client id, client secret, set up the allowed CORS origins / callbacks / logout URLs. Auth0 has instructions how to do this [here](https://manage.auth0.com/#/connections/social) to set up the social connections, or you can just use the username-password scheme that Auth0 provides.

You will need an 'exosite' database (or some other database name to be specified in the .env file)

Copy the .env.template file to .env and populate it with your variables


How to run
----------

Run `./run.sh`

This will run `nodemon --ignore=./web/ bin/www`

Open your browser to [localhost:3000](http://localhost:3000) 

How to develop
--------------

If you don't use Atom, you will have to run the transpile step whenever `.ts` files are changed to convert the `.ts` files to `.js`.

