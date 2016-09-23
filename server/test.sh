export ENVIRONMENT="TEST"
tsc
mocha -R spec ./test/*.spec.js
