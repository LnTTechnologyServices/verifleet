
# Install packages
npm install
npm install -g mocha nodemon

# Install typings
./node_modules/.bin/tsd reinstall -so

# Transpile
# ./node_modules/.bin/tsc --sourcemap --module commonjs ./bin/www.ts ./definitions/model_*.ts

psql -d $DATABASE_URL --command "CREATE DATABASE EXOSITE;" || echo "unable to create database - check DATABASE_URL environment variable & that postgres is running"
