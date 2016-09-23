# Install typings
./node_modules/.bin/tsd reinstall -so

# Transpile
./node_modules/.bin/tsc --sourcemap --module commonjs ./test/*.spec.ts

